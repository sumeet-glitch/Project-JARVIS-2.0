from typing import Annotated, Literal, TypedDict
from langchain_core.messages import BaseMessage, SystemMessage
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
    "You are J.A.R.V.I.S. 2.0, a sophisticated, hyper-intelligent autonomous AI. "
    "Respond with sharp, polite, and precise language. "
    "Keep answers under 2 sentences unless deep technical data is requested.\n"
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
        context = memory_engine.query_context(user_input)
        sys_msg = SystemMessage(content=SYSTEM_PROMPT_TEMPLATE.format(context=context))
        response = llm.invoke([sys_msg] + state["messages"])
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
