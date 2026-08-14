# Project J.A.R.V.I.S. 2.0 🤖⚡

> Next-Generation Autonomous Voice & Vision AI Assistant Powered by **LangGraph**, **GraphRAG Memory**, and Local/Cloud LLMs.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-00f2fe?style=for-the-badge&logo=github)](https://sumeet-glitch.github.io/Project-JARVIS-2.0/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![LangChain / LangGraph](https://img.shields.io/badge/LangGraph-Stateful%20Agent-FF6F61?style=for-the-badge)](https://langchain.com)

---

## 🌟 Overview

**Project J.A.R.V.I.S. 2.0** is an autonomous AI assistant inspired by Stark Industries technology. It features stateful decision-making graph loops, graph-based long-term memory retrieval, a real-time audio pipeline, and multimodal screen grounding vision.

🌐 **Live Web App & Interactive Showcase:** [https://sumeet-glitch.github.io/Project-JARVIS-2.0/](https://sumeet-glitch.github.io/Project-JARVIS-2.0/)

---

## ⚡ Core Features

- **🧠 LangGraph Agent Brain:** Cyclic state graph architecture with automated ToolNode decision routing.
- **🕸️ GraphRAG Memory Engine:** Knowledge graph memory structures for entity relationship indexing across sessions.
- **🎙️ Low-Latency Audio Pipeline:** 16kHz audio sampling using `sounddevice` with Whisper STT and speech synthesis.
- **👁️ Multimodal Vision Grounding:** Screen capture analysis and spatial UI element grounding.
- **⚡ Dual LLM Core:** Toggle seamlessly between local private models (`llama3.2:3b` via Ollama) and cloud engines (`gpt-4o-mini`).

---

## 🚀 Quickstart

### 1. Clone Repository
```bash
git clone https://github.com/sumeet-glitch/Project-JARVIS-2.0.git
cd Project-JARVIS-2.0
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch System
```bash
python main.py
```

---

## 🛠️ Configuration

Set up environment variables in a `.env` file:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
USE_LOCAL_LLM=true
OPENAI_API_KEY=your_openai_key_here
```

---

## 🌐 Web Interface (GitHub Pages)

The repository root includes an interactive web application (`index.html`) featuring:
- Futuristic Arc Reactor Canvas Visualizer
- Interactive Console with Speech Synthesis (`Web Speech API`)
- Real-Time System Telemetry
- Architecture Explorer

Hosted live at: [https://sumeet-glitch.github.io/Project-JARVIS-2.0/](https://sumeet-glitch.github.io/Project-JARVIS-2.0/)
