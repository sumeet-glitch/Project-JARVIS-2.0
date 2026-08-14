import os
import re
import tempfile
import pyttsx3
from faster_whisper import WhisperModel
import numpy as np

class AudioPipeline:
    def __init__(self):
        print("[PIPELINE] Initializing Multilingual Neural Voice Engine & Whisper STT...")
        # Use 'base' (multilingual model supporting Hindi, Hinglish, English) instead of English-only 'base.en'
        self.stt_model = WhisperModel("base", device="cpu", compute_type="int8")
        
        self.tts_engine = pyttsx3.init()
        voices = self.tts_engine.getProperty("voices")
        for v in voices:
            if "hindi" in v.name.lower() or "british" in v.name.lower() or "david" in v.name.lower() or "zira" in v.name.lower():
                self.tts_engine.setProperty("voice", v.id)
                break
        self.tts_engine.setProperty("rate", 180)

    def transcribe(self, audio_data: np.ndarray) -> str:
        # Auto-convert int16 PCM audio to float32 if needed
        if audio_data.dtype == np.int16:
            audio_data = audio_data.astype(np.float32) / 32768.0
        # Auto-detect language (Hindi, Hinglish, English)
        segments, _ = self.stt_model.transcribe(audio_data)
        return " ".join([seg.text for seg in segments]).strip()


    def speak(self, text: str):
        print(f"\n[J.A.R.V.I.S. 2.0]: {text}")
        
        # Check for Devanagari Hindi characters (\u0900-\u097F)
        contains_hindi = bool(re.search(r'[\u0900-\u097F]', text))
        
        if contains_hindi:
            try:
                from gtts import gTTS
                import pygame
                
                tts = gTTS(text=text, lang='hi')
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
                    temp_path = fp.name
                    tts.save(temp_path)
                
                pygame.mixer.init()
                pygame.mixer.music.load(temp_path)
                pygame.mixer.music.play()
                while pygame.mixer.music.get_busy():
                    pygame.time.Clock().tick(10)
                pygame.mixer.music.unload()
                os.remove(temp_path)
                return
            except Exception:
                pass # Fallback to pyttsx3 if gtts/pygame is unavailable

        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

