/**
 * Project J.A.R.V.I.S. 2.0 - Multilingual Web Voice & AI Assistant Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initArcReactorCanvas();
  initConsoleEngine();
  initTelemetryLoop();
  initAudioSynthesizer();
});

/* ----------------------------------------------------
 * 1. Futuristic Arc Reactor HUD Canvas Renderer
 * ---------------------------------------------------- */
function initArcReactorCanvas() {
  const canvas = document.getElementById('arcReactorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = 400;
  canvas.height = 400;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let angle = 0;
  let pulsePhase = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Outer Glow Background
    const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 180);
    bgGlow.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
    bgGlow.addColorStop(0.5, 'rgba(79, 172, 254, 0.1)');
    bgGlow.addColorStop(1, 'rgba(7, 9, 14, 0)');
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
    ctx.fill();

    // Rotating Outer Segment Rings
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.lineWidth = 3;
    const numSegments = 12;
    for (let i = 0; i < numSegments; i++) {
      ctx.rotate((Math.PI * 2) / numSegments);
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI / 18);
      ctx.stroke();
    }
    ctx.restore();

    // Counter-Rotating Inner Ring
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-angle * 1.5);
    ctx.strokeStyle = 'rgba(127, 0, 255, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.rotate((Math.PI * 2) / 8);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI / 6);
      ctx.stroke();
    }
    ctx.restore();

    // Pulsing Arc Core
    pulsePhase += 0.05;
    const coreRadius = 45 + Math.sin(pulsePhase) * 6;
    
    const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 1.5);
    coreGlow.addColorStop(0, '#ffffff');
    coreGlow.addColorStop(0.3, '#00f2fe');
    coreGlow.addColorStop(0.7, '#4facfe');
    coreGlow.addColorStop(1, 'rgba(0, 242, 254, 0)');
    
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // Core Triangles / Stark Pattern
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * 0.5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -coreRadius * 0.7);
    ctx.lineTo(coreRadius * 0.6, coreRadius * 0.5);
    ctx.lineTo(-coreRadius * 0.6, coreRadius * 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    angle += 0.008;
    requestAnimationFrame(render);
  }

  render();
}

/* ----------------------------------------------------
 * 2. Multilingual Voice & AI Assistant Console Engine
 * ---------------------------------------------------- */
let audioFxEnabled = true;

function initConsoleEngine() {
  const consoleBody = document.getElementById('consoleBody');
  const consoleInput = document.getElementById('consoleInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const micLabel = document.getElementById('micLabel');
  const chips = document.querySelectorAll('.chip');
  const audioToggle = document.getElementById('audioToggle');

  if (!consoleBody || !consoleInput) return;

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioFxEnabled = !audioFxEnabled;
      audioToggle.classList.toggle('active', audioFxEnabled);
      audioToggle.textContent = audioFxEnabled ? 'VOICE SPEECH: ON' : 'VOICE SPEECH: OFF';
      playBeep(800, 0.05);
    });
  }

  const responses = {
    "namaste": {
      text: "नमस्ते सर! मैं जे.आर.वी.आई.एस. 2.0 हूँ। सभी कोर सिस्टम्स (LangGraph, GraphRAG, Multilingual Audio) पूरी तरह सक्रिय हैं।",
      tool: "[GraphRAG Memory]: Multilingual Indian Language Context active"
    },
    "diagnostics": {
      text: "System diagnostics summary: CPU Load is 13.8%, Memory usage is optimal, and all LangGraph agent state nodes are online.",
      tool: "[System Diagnostics]: Executed get_system_diagnostics()"
    },
    "memory": {
      text: "GraphRAG knowledge graph contains 152 entity relations with full context indexing across sessions.",
      tool: "[GraphRAG Memory]: Executed query_context('user memory query')"
    },
    "vision": {
      text: "Multimodal vision grounding engine ready. Capturing current desktop window frame for spatial UI analysis.",
      tool: "[Vision Engine]: ScreenGrounder captured active frame (1920x1080 resolution)"
    },
    "audio": {
      text: "Multilingual Voice Audio Pipeline running. Supporting Hindi, Hinglish, and English STT and TTS speech synthesis.",
      tool: "[Audio Pipeline]: Multilingual Neural Voice IO operational"
    }
  };

  function addMessage(author, text, isUser = false, toolTrace = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user' : 'jarvis'}`;
    
    let html = `<div class="msg-author">${author}</div><div class="msg-bubble">${text}</div>`;
    if (toolTrace) {
      html += `<div class="tool-trace">⚡ ${toolTrace}</div>`;
    }
    
    msgDiv.innerHTML = html;
    consoleBody.appendChild(msgDiv);
    consoleBody.scrollTop = consoleBody.scrollHeight;

    // Speak response if from J.A.R.V.I.S.
    if (!isUser && audioFxEnabled) {
      speakText(text);
    }
  }

  function handleSend() {
    const query = consoleInput.value.trim();
    if (!query) return;

    playBeep(600, 0.03);
    addMessage("USER", query, true);
    consoleInput.value = '';

    // Simulate AI thinking and response
    setTimeout(() => {
      let matchedKey = "diagnostics";
      const qLower = query.toLowerCase();
      if (qLower.includes("namaste") || qLower.includes("नमस्ते") || qLower.includes("status")) matchedKey = "namaste";
      else if (qLower.includes("memory") || qLower.includes("graph")) matchedKey = "memory";
      else if (qLower.includes("vision") || qLower.includes("screen") || qLower.includes("see")) matchedKey = "vision";
      else if (qLower.includes("audio") || qLower.includes("voice") || qLower.includes("sound")) matchedKey = "audio";

      const res = responses[matchedKey];
      addMessage("J.A.R.V.I.S. 2.0", res.text, false, res.tool);
    }, 600);
  }

  sendBtn.addEventListener('click', handleSend);
  consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      consoleInput.value = chip.textContent;
      handleSend();
    });
  });

  /* ----------------------------------------------------
   * Web Speech Recognition (Browser Voice Input)
   * ---------------------------------------------------- */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN'; // Default to Hindi / Multilingual

    let isRecording = false;

    micBtn.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch (e) {
          console.warn("Speech recognition already running");
        }
      }
    });

    recognition.onstart = () => {
      isRecording = true;
      micBtn.classList.add('recording');
      if (micLabel) micLabel.textContent = 'LISTENING...';
      playBeep(900, 0.04);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      consoleInput.value = transcript;
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopRecordingUI();
    };

    recognition.onend = () => {
      stopRecordingUI();
      if (consoleInput.value.trim()) {
        handleSend();
      }
    };

    function stopRecordingUI() {
      isRecording = false;
      micBtn.classList.remove('recording');
      if (micLabel) micLabel.textContent = 'SPEAK';
    }
  } else if (micBtn) {
    micBtn.addEventListener('click', () => {
      alert("Browser speech recognition is not supported in this browser. Please type your query in the terminal input.");
    });
  }
}

/* ----------------------------------------------------
 * 3. Multilingual Speech Synthesis Audio Output
 * ---------------------------------------------------- */
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Check for Devanagari Hindi characters
  const isHindi = /[\u0900-\u097F]/.test(text);
  if (isHindi) {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-US';
  }
  
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;
  if (isHindi) {
    selectedVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Google हिन्दी'));
  }
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('UK English'));
  }
  if (selectedVoice) utterance.voice = selectedVoice;
  
  window.speechSynthesis.speak(utterance);
}

/* ----------------------------------------------------
 * 4. Web Audio API Sci-Fi Sound Effects Synthesizer
 * ---------------------------------------------------- */
let audioCtx = null;

function initAudioSynthesizer() {
  const buttons = document.querySelectorAll('button, .chip, .nav-link');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (audioFxEnabled) playBeep(1200, 0.015);
    });
  });
}

function playBeep(freq, duration) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio context restrictions
  }
}

/* ----------------------------------------------------
 * 5. Real-Time Telemetry Dashboard Simulator
 * ---------------------------------------------------- */
function initTelemetryLoop() {
  const latencyEl = document.getElementById('metricLatency');
  const memoryNodesEl = document.getElementById('metricMemoryNodes');
  const cpuLoadEl = document.getElementById('metricCpuLoad');

  if (!latencyEl) return;

  setInterval(() => {
    const latency = (18 + Math.random() * 5).toFixed(1);
    const nodes = 152 + Math.floor(Math.random() * 3);
    const cpu = (12 + Math.random() * 6).toFixed(1);

    latencyEl.textContent = `${latency}ms`;
    memoryNodesEl.textContent = nodes;
    cpuLoadEl.textContent = `${cpu}%`;
  }, 2500);
}
