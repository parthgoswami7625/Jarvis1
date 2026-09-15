import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
  Clock,
  Terminal,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { HUDTheme, MarkLIIIVoice, VoiceState } from "../../types";

interface VoiceHUDCoreProps {
  theme: HUDTheme;
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  selectedVoice: MarkLIIIVoice;
  onExecuteCommand: (cmd: string) => Promise<void>;
  lastResponse: string;
  transcript: string;
  setTranscript: (t: string) => void;
  onPlayMorningBriefing: () => void;
}

export const VoiceHUDCore: React.FC<VoiceHUDCoreProps> = ({
  theme,
  voiceState,
  setVoiceState,
  selectedVoice,
  onExecuteCommand,
  lastResponse,
  transcript,
  setTranscript,
  onPlayMorningBriefing,
}) => {
  const [inputText, setInputText] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(25);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isInsideIframe = typeof window !== "undefined" && window.self !== window.top;

  // Animated visualizer loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isActive = voiceState === "listening" || voiceState === "speaking";
      const baseAmp = isActive ? 35 : 12;
      const bars = 36;
      const step = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * step + step / 2;
        const normalizedI = (i - bars / 2) / (bars / 2);
        const envelope = Math.cos(normalizedI * (Math.PI / 2));
        const wave = Math.sin(phase + i * 0.3) * baseAmp * Math.max(0.2, envelope);
        const barHeight = Math.max(4, Math.abs(wave) + (isActive ? Math.random() * 15 : 4));

        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight, 0, height / 2 + barHeight);
        if (theme === "emerald-matrix") {
          gradient.addColorStop(0, "#10b981");
          gradient.addColorStop(1, "#047857");
        } else if (theme === "crimson-protocol") {
          gradient.addColorStop(0, "#f43f5e");
          gradient.addColorStop(1, "#be123c");
        } else if (theme === "amber-titan") {
          gradient.addColorStop(0, "#f59e0b");
          gradient.addColorStop(1, "#b45309");
        } else if (theme === "violet-synth") {
          gradient.addColorStop(0, "#a855f7");
          gradient.addColorStop(1, "#7e22ce");
        } else {
          gradient.addColorStop(0, "#06b6d4");
          gradient.addColorStop(1, "#0284c7");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x - 2, (height - barHeight) / 2, 4, barHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [voiceState, theme]);

  // Speech Recognition hook via Web Speech API if supported
  const toggleListening = () => {
    if (voiceState === "listening") {
      setVoiceState("idle");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        let capturedTranscript = "";

        recognition.onstart = () => {
          setVoiceState("listening");
          setTranscript("Listening for command...");
          setMicNotice(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          capturedTranscript = text;
          setTranscript(text);
        };

        recognition.onend = () => {
          if (capturedTranscript.trim()) {
            onExecuteCommand(capturedTranscript.trim());
          } else {
            setVoiceState("idle");
          }
        };

        recognition.onerror = (event: any) => {
          setVoiceState("idle");
          if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
            setMicNotice(
              isInsideIframe
                ? "Microphone access is restricted inside preview iframes. Open app in a new tab (top right icon) for live mic access."
                : "Microphone permission was denied. Please allow microphone access in your browser address bar."
            );
          } else if (event?.error !== "no-speech") {
            setMicNotice(`Speech recognition notice: ${event?.error || "Ended"}. You can also type commands or click directives below.`);
          }
        };

        recognition.start();
      } catch (err) {
        simulateVoiceWake();
      }
    } else {
      simulateVoiceWake();
    }
  };

  const simulateVoiceWake = () => {
    setVoiceState("listening");
    setTranscript("Hey Jarvis, optimize our LinkedIn strategy and check today's pipeline.");
    setTimeout(() => {
      setVoiceState("processing");
      setTimeout(() => {
        onExecuteCommand("Hey Jarvis, optimize our LinkedIn strategy and check today's pipeline.");
      }, 700);
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onExecuteCommand(inputText);
    setInputText("");
  };

  // Instant TTS voice tester
  const handleTestVoiceAudio = async () => {
    setIsSynthesizing(true);
    try {
      const promptText = `Hello Parth. Mark-LIII voice synthesis initialized using native ${selectedVoice} model. All autonomous systems are standing by.`;
      const res = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptText, voiceName: selectedVoice }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
          await audio.play().catch(() => {
            if ("speechSynthesis" in window) {
              const utter = new SpeechSynthesisUtterance(promptText);
              window.speechSynthesis.speak(utter);
            }
          });
        } catch {
          if ("speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(promptText);
            window.speechSynthesis.speak(utter);
          }
        }
      } else {
        // Fallback Web Speech
        if ("speechSynthesis" in window) {
          const utter = new SpeechSynthesisUtterance(promptText);
          window.speechSynthesis.speak(utter);
        }
      }
    } catch {
      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(`Hello Parth. Mark-LIII voice online.`);
        window.speechSynthesis.speak(utter);
      }
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top HUD Telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              MARK-LIII DESKTOP JARVIS
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-xs text-slate-400">
            Wake Word: <strong className="text-slate-200">&quot;Hey Jarvis&quot;</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-xs text-emerald-400">
            2m Silence Auto-Sleep Active
          </span>
        </div>

        {/* Quick Voice & Briefing triggers */}
        <div className="flex items-center space-x-2">
          <button
            id="morning-briefing-btn"
            onClick={onPlayMorningBriefing}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Morning Briefing</span>
          </button>

          <button
            id="test-voice-btn"
            onClick={handleTestVoiceAudio}
            disabled={isSynthesizing}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs transition"
            title={`Test voice audio (${selectedVoice})`}
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSynthesizing ? "Synthesizing..." : `Voice: ${selectedVoice}`}</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Reactor Core & Audio Waveform */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4 text-center">
        {/* Core Ring */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-36 h-36 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${
              voiceState === "listening"
                ? "border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.6)] scale-105"
                : voiceState === "processing"
                ? "border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.5)] animate-spin"
                : voiceState === "speaking"
                ? "border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105"
                : "border-slate-700/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            }`}
          >
            {/* Inner Rotating Ring */}
            <div className="w-28 h-28 rounded-full border border-dashed border-cyan-500/40 flex items-center justify-center animate-[spin_12s_linear_infinite]">
              <div className="w-20 h-20 rounded-full bg-slate-950/80 border border-cyan-500/50 flex items-center justify-center shadow-inner">
                <button
                  id="hud-mic-main-btn"
                  onClick={toggleListening}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    voiceState === "listening"
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-110"
                      : "bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-cyan-500/50"
                  }`}
                  title="Click to speak or trigger wake word"
                >
                  {voiceState === "listening" ? (
                    <Mic className="w-7 h-7 animate-pulse" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Audio Visualizer Canvas */}
        <div className="w-full max-w-lg mt-5">
          <canvas
            ref={canvasRef}
            width={480}
            height={48}
            className="w-full h-12 rounded-lg bg-slate-950/60 border border-slate-800/80"
          />
        </div>

        {/* Microphone Notice / Fallback Banner */}
        {micNotice && (
          <div className="w-full max-w-lg mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[11px] font-mono flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{micNotice}</p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    setMicNotice(null);
                    simulateVoiceWake();
                  }}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px]"
                >
                  Run Demo Directive
                </button>
                {isInsideIframe && (
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px]"
                  >
                    <span>Open in Full Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator text */}
        <div className="mt-3 flex items-center space-x-2 font-mono text-xs">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">STATUS:</span>
          <span
            className={`font-semibold uppercase ${
              voiceState === "listening"
                ? "text-cyan-400"
                : voiceState === "processing"
                ? "text-amber-400"
                : voiceState === "speaking"
                ? "text-emerald-400"
                : "text-slate-300"
            }`}
          >
            {voiceState === "listening"
              ? "Listening for instruction..."
              : voiceState === "processing"
              ? "Gemini 3.8 Flash Reasoning..."
              : voiceState === "speaking"
              ? "Jarvis Speaking..."
              : "Standing By (Voice Wake Ready)"}
          </span>
        </div>

        {/* Live Transcript Display */}
        {(transcript || voiceState === "listening") && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono max-w-xl">
            <span className="text-slate-400 font-bold mr-2">&gt; USER:</span>
            {transcript || "Speak now..."}
          </div>
        )}

        {/* Last Assistant Response with Acknowledgment */}
        {lastResponse && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-slate-200 text-xs font-mono max-w-2xl text-left">
            <div className="flex items-center justify-between text-cyan-400 mb-1 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> MARK-LIII RESPONSE:
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Gemini 3.8 Flash • Local Memory Saved</span>
            </div>
            <p className="leading-relaxed whitespace-pre-wrap text-slate-300">{lastResponse}</p>
          </div>
        )}
      </div>

      {/* Manual Directive Input & Sample Prompts */}
      <div className="relative z-10 mt-6 border-t border-slate-800 pt-4">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Terminal className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              id="voice-command-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type voice directive: 'Hey Jarvis, draft a viral post about autonomous agents'..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-slate-200 text-xs font-mono focus:outline-none placeholder-slate-500 transition"
            />
          </div>
          <button
            id="submit-voice-command-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            Execute
          </button>
        </form>

        {/* Quick Directive Chips */}
        <div className="mt-3 flex flex-wrap gap-2 items-center text-[11px] font-mono">
          <span className="text-slate-400">Quick Voice Directives:</span>
          {[
            "Hey Jarvis, draft viral post on autonomous agents",
            "Hey Jarvis, audit pipeline conversion with Sales Division",
            "Hey Jarvis, analyze clipboard text with Humanizer",
            "Hey Jarvis, set volume to 75% and open VS Code",
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(prompt);
                onExecuteCommand(prompt);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
