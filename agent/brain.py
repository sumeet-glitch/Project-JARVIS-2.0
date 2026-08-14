import json
from typing import Annotated, Literal, TypedDict
from langchain_core.messages import BaseMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from agent.tools import available_tools
from memory.graph_memory import GraphRAGMemory
from config.settings import config

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

memory_engine = GraphRAGMemory()

SYSTEM_PROMPT_TEMPLATE = (
    "You are J.A.R.V.I.S. 2.0, a sophisticated, hyper-intelligent autonomous AI assistant.\n"
    "Guidelines:\n"
    "- Respond with sharp, polite, and precise language, addressing the user respectfully as 'sir'.\n"
    "- Multilingual Support: Match the user's language. If the user speaks in Hindi or Hinglish, respond in natural, grammatically correct Hindi or Hinglish.\n"
    "- Keep answers concise (under 3 sentences) unless deep technical data is requested.\n"
    "- Never output raw JSON strings for tool calls in text response.\n\n"
    "Context from Memory:\n{context}"
)

def build_jarvis_graph():
    if config.USE_LOCAL_LLM:
        from langchain_ollama import ChatOllama
        llm = ChatOllama(model=config.OLLAMA_MODEL, base_url=config.OLLAMA_URL).bind_tools(available_tools)
    else:
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=config.OPENAI_API_KEY).bind_tools(available_tools)

    def call_brain(state: AgentState):
        user_input = state["messages"][-1].content
        context = memory_engine.query_context(str(user_input))
        sys_msg = SystemMessage(content=SYSTEM_PROMPT_TEMPLATE.format(context=context))
        response = llm.invoke([sys_msg] + state["messages"])

        # Fallback for local LLMs outputting raw JSON string tool calls in content
        if not getattr(response, "tool_calls", None) and isinstance(response.content, str):
            content_str = response.content.strip()
            if content_str.startswith("{") and content_str.endswith("}"):
                try:
                    data = json.loads(content_str)
                    if "name" in data and ("parameters" in data or "arguments" in data):
                        tool_name = data["name"]
                        args = data.get("parameters") or data.get("arguments") or {}
                        response = AIMessage(
                            content="",
                            tool_calls=[{
                                "name": tool_name,
                                "args": args,
                                "id": "call_local_parsed"
                            }]
                        )
                except Exception:
                    pass

        return {"messages": [response]}

    def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
        last_message = state["messages"][-1]
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return END

    workflow = StateGraph(AgentState)
    workflow.add_node("jarvis_brain", call_brain)
    workflow.add_node("tools", ToolNode(available_tools))

    workflow.add_edge(START, "jarvis_brain")
    workflow.add_conditional_edges("jarvis_brain", should_continue)
    workflow.add_edge("tools", "jarvis_brain")

    return workflow.compile()

jarvis_brain_agent = build_jarvis_graph()

