/**
 * Project J.A.R.V.I.S. 2.0 - Interactive HUD & AI Assistant Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initArcReactorCanvas();
  initConsoleEngine();
  initTelemetryLoop();
  initCopyButtons();
  initAudioSynthesizer();
});

/* ----------------------------------------------------
 * 1. Futuristic Arc Reactor HUD Canvas Renderer
 * ---------------------------------------------------- */
function initArcReactorCanvas() {
  const canvas = document.getElementById('arcReactorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set internal buffer resolution
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
 * 2. Interactive J.A.R.V.I.S. AI Demo Console
 * ---------------------------------------------------- */
let audioFxEnabled = true;

function initConsoleEngine() {
  const consoleBody = document.getElementById('consoleBody');
  const consoleInput = document.getElementById('consoleInput');
  const sendBtn = document.getElementById('sendBtn');
  const chips = document.querySelectorAll('.chip');
  const audioToggle = document.getElementById('audioToggle');

  if (!consoleBody || !consoleInput) return;

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioFxEnabled = !audioFxEnabled;
      audioToggle.classList.toggle('active', audioFxEnabled);
      audioToggle.textContent = audioFxEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      playBeep(800, 0.05);
    });
  }

  const responses = {
    "status": {
      text: "All core J.A.R.V.I.S. 2.0 systems are fully operational. LangGraph brain node is active with Ollama llama3.2:3b local LLM fallback.",
      tool: "[GraphRAG Memory]: Retrieved system topology (35 nodes, 0 errors)"
    },
    "memory": {
      text: "GraphRAG knowledge graph contains 148 entity relations. Active workspace context indexed for real-time memory retrieval.",
      tool: "[GraphRAG Memory]: Executed query_context('user intent history')"
    },
    "vision": {
      text: "Multimodal vision grounding engine ready. Screen analysis module initialized for screen coordinate grounding and UI element detection.",
      tool: "[Vision Engine]: ScreenGrounder captured active frame (1920x1080 resolution)"
    },
    "audio": {
      text: "Audio pipeline configured at 16,000Hz sampling rate with Whisper STT transcription and pyttsx3/gTTS voice output.",
      tool: "[Audio Pipeline]: Sounddevice buffer verified (chunk size: 1280)"
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
      let matchedKey = "status";
      const qLower = query.toLowerCase();
      if (qLower.includes("memory") || qLower.includes("graph")) matchedKey = "memory";
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
}

/* ----------------------------------------------------
 * 3. Speech Synthesis Audio Output
 * ---------------------------------------------------- */
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop ongoing speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;
  
  // Try finding a clean English voice
  const voices = window.speechSynthesis.getVoices();
  const jarvisVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('UK English'));
  if (jarvisVoice) utterance.voice = jarvisVoice;
  
  window.speechSynthesis.speak(utterance);
}

/* ----------------------------------------------------
 * 4. Web Audio API Sci-Fi Sound Effects Synthesizer
 * ---------------------------------------------------- */
let audioCtx = null;

function initAudioSynthesizer() {
  const buttons = document.querySelectorAll('button, .chip, .nav-link, .btn-github');
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
    // Ignore audio context autoplay restrictions
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
    // Subtle realistic variations
    const latency = (18 + Math.random() * 6).toFixed(1);
    const nodes = 148 + Math.floor(Math.random() * 3);
    const cpu = (12 + Math.random() * 8).toFixed(1);

    latencyEl.textContent = `${latency}ms`;
    memoryNodesEl.textContent = nodes;
    cpuLoadEl.textContent = `${cpu}%`;
  }, 2500);
}

/* ----------------------------------------------------
 * 6. Code Snippet Copy-to-Clipboard
 * ---------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBox = btn.nextElementSibling;
      if (!codeBox) return;
      
      const codeText = codeBox.textContent.trim();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        btn.style.background = 'var(--cyan-primary)';
        btn.style.color = '#000';
        playBeep(900, 0.05);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}
