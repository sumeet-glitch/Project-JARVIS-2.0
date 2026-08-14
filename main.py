import queue
import sounddevice as sd
import numpy as np
from config.settings import config
from core.audio_pipeline import AudioPipeline
from agent.brain import jarvis_brain_agent
from langchain_core.messages import HumanMessage

def main():
    print(f"=================================================")
    print(f"       {config.PROJECT_NAME} - SYSTEM ONLINE     ")
    print(f"=================================================")

    audio_io = AudioPipeline()
    audio_queue = queue.Queue()

    def audio_callback(indata, frames, time, status):
        audio_queue.put(indata.copy())

    audio_io.speak("Project J.A.R.V.I.S. 2.0 systems fully operational, sir. How may I assist you today?")

    while True:
        try:
            user_input = input("\n[USER (Type or press Enter for Voice)]: ").strip()
            if not user_input:
                print("[LISTENING] Recording 4 seconds of audio...")
                with sd.InputStream(samplerate=config.SAMPLE_RATE, channels=1, dtype="int16", 
                                    blocksize=config.AUDIO_CHUNK_SIZE, callback=audio_callback):
                    recorded = []
                    for _ in range(int(config.SAMPLE_RATE / config.AUDIO_CHUNK_SIZE * 4)):
                        recorded.append(audio_queue.get())
                    raw_audio = np.concatenate(recorded, axis=0).flatten()
                    user_input = audio_io.transcribe(raw_audio)
                    print(f"[TRANSCRIBED]: {user_input}")

            if user_input.lower() in ["exit", "quit", "shutdown"]:
                audio_io.speak("Shutting down core systems. Have a productive day, sir.")
                break

            if user_input:
                result = jarvis_brain_agent.invoke({"messages": [HumanMessage(content=user_input)]})
                final_reply = result["messages"][-1].content
                audio_io.speak(final_reply)

        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()
