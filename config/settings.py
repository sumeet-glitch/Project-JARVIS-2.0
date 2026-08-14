import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Project-JARVIS-2.0"
    WAKE_WORD: str = "hey_jarvis"
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    USE_LOCAL_LLM: bool = os.getenv("USE_LOCAL_LLM", "true").lower() == "true"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SAMPLE_RATE: int = 16000
    AUDIO_CHUNK_SIZE: int = 1280

config = Settings()
