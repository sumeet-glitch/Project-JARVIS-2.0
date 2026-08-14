import pyttsx3
from faster_whisper import WhisperModel
import numpy as np

class AudioPipeline:
    def __init__(self):
        print("[PIPELINE] Initializing Neural Voice Engine & Whisper STT...")
        self.stt_model = WhisperModel("base.en", device="cpu", compute_type="int8")
        
        self.tts_engine = pyttsx3.init()
        voices = self.tts_engine.getProperty("voices")
        for v in voices:
            if "british" in v.name.lower() or "david" in v.name.lower() or "zira" in v.name.lower():
                self.tts_engine.setProperty("voice", v.id)
                break
        self.tts_engine.setProperty("rate", 185)

    def transcribe(self, audio_data: np.ndarray) -> str:
        segments, _ = self.stt_model.transcribe(audio_data, language="en")
        return " ".join([seg.text for seg in segments]).strip()

    def speak(self, text: str):
        print(f"\n[J.A.R.V.I.S. 2.0]: {text}")
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()
