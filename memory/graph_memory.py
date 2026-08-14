import json

class GraphRAGMemory:
    def __init__(self):
        self.nodes = {
            "user": {"name": "Sumit", "role": "Lead Architect", "preference": "Concise verbal replies"},
            "project_jarvis": {"status": "Active Development 2.0", "stack": "Python, LangGraph, Whisper, Ollama, OmniParser"},
            "workspace": {"os": "Windows", "drive": "D:\\Project-JARVIS 2.0"}
        }
        self.relations = [
            ("user", "ARCHITECTS", "project_jarvis"),
            ("user", "OPERATES_IN", "workspace")
        ]

    def query_context(self, text: str) -> str:
        text_lower = text.lower()
        extracted_info = []
        for key, data in self.nodes.items():
            if key in text_lower or any(word in text_lower for word in key.split('_')):
                extracted_info.append(f"Node [{key}]: {json.dumps(data)}")
        
        if not extracted_info:
            return f"User context: {json.dumps(self.nodes['user'])}"
        return " | ".join(extracted_info)

    def add_fact(self, node_id: str, attributes: dict):
        self.nodes[node_id] = attributes
