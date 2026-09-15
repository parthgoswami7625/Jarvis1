import React, { useState } from "react";
import {
  X,
  Terminal,
  Copy,
  Check,
  Download,
  Cpu,
  Mic,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Bluetooth,
  Headphones,
} from "lucide-react";

interface LocalPCSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalPCSetupGuideModal: React.FC<LocalPCSetupGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"quick" | "voice" | "agents" | "env" | "bluetooth">("quick");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const quickStartScript = `# 1. Clone the repository
git clone https://github.com/your-username/parths-autonomous-business-agent.git
cd parths-autonomous-business-agent

# 2. Install dependencies & configure API key
npm install
cp .env.example .env
# Open .env and insert your free GEMINI_API_KEY from Google AI Studio

# 3. Start the Unified Web Engine (HUD + Express Server)
npm run dev
# Dashboard is live at http://localhost:3000`;

  const markLIIIScript = `# 1. Create a Python 3.12 virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate

# 2. Install local audio, wake-word, and PC control packages
pip install vosk sounddevice numpy pyautogui pyttsx3 google-genai python-dotenv

# 3. Download lightweight offline Vosk wake-word model (50MB)
mkdir -p model
curl -L https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip -o model.zip
unzip model.zip && mv vosk-model-small-en-us-0.15 model/vosk && rm model.zip

# 4. Launch the Mark-LIII Voice Daemon
python mark_liii_daemon.py`;

  const agencyAgentsScript = `# Option A: One-line automatic installer
curl -fsSL https://agencyagents.dev/install.sh | bash

# Option B: Git Clone directly from open-source repository
git clone https://github.com/msitarzewski/agency-agents.git ~/.agency-agents

# Add to your shell config (~/.zshrc or ~/.bashrc)
export AGENCY_AGENTS_PATH="$HOME/.agency-agents"
export PATH="$AGENCY_AGENTS_PATH/bin:$PATH"

# Test agent execution in terminal
agency-run "Sales/Outbound-Strategist" --task "Generate outreach for Apex Tech"`;

  const bluetoothAutoScript = `# Verify audio device recognition in Mark-LIII Daemon
python mark_liii_daemon.py
# Type: 'devices' to view all connected Bluetooth audio and mic streams

# Linux auto-handover (PulseAudio/PipeWire):
pactl load-module module-switch-on-connect

# macOS (optional helper to switch audio source via CLI):
# brew install switchaudio-osx
# SwitchAudioSource -s "AirPods Pro"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden font-mono text-xs flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <Laptop className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Local PC Installation &amp; Setup Guide
              </h2>
              <p className="text-[11px] text-slate-400">
                Run 100% locally on Windows, macOS, or Linux • 100% Free &amp; Open-Source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4">
          <button
            onClick={() => setActiveTab("quick")}
            className={`px-4 py-2.5 font-bold border-b-2 transition ${
              activeTab === "quick"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            1. Quick Start
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`px-4 py-2.5 font-bold border-b-2 transition ${
              activeTab === "voice"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            2. Mark-LIII Voice Daemon
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`px-4 py-2.5 font-bold border-b-2 transition ${
              activeTab === "agents"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            3. Agency Agents (314 Roles)
          </button>
          <button
            onClick={() => setActiveTab("env")}
            className={`px-4 py-2.5 font-bold border-b-2 transition ${
              activeTab === "env"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            4. Free Gemini Key
          </button>
          <button
            onClick={() => setActiveTab("bluetooth")}
            className={`px-4 py-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "bluetooth"
                ? "border-blue-400 text-blue-300 bg-blue-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>5. Bluetooth Mic &amp; Audio</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "quick" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hardware &amp; Software Requirements:</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>Operating System: Windows 10/11, macOS (Apple Silicon or Intel), or Ubuntu Linux 22.04+</li>
                  <li>Runtime: Node.js v20+ and Python 3.11+ or 3.12</li>
                  <li>Microphone &amp; Speakers for JARVIS voice commands</li>
                  <li>Zero paid subscriptions required (uses free Google AI Studio Gemini API tier)</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-bold">Terminal Quickstart Commands:</span>
                  <button
                    onClick={() => copyToClipboard(quickStartScript, "quick")}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedCode === "quick" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === "quick" ? "Copied" : "Copy commands"}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] overflow-x-auto leading-relaxed">
                  {quickStartScript}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Mark-LIII Voice Assistant Architecture:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The local voice assistant uses the lightweight, 100% offline <strong>Vosk</strong> engine to listen for the &quot;Hey Jarvis&quot; wake word directly on your CPU. It records zero audio to the cloud while asleep, and transitions to Gemini 3.8 Flash live inference only after the wake word is detected.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-bold">Voice Daemon Setup Script:</span>
                  <button
                    onClick={() => copyToClipboard(markLIIIScript, "voice")}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedCode === "voice" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === "voice" ? "Copied" : "Copy commands"}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-200 text-[11px] overflow-x-auto leading-relaxed">
                  {markLIIIScript}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Agency Agents Open-Source Directory (314 Roles):</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All 314 agency roles are stored as open-source markdown directives under <code>~/.agency-agents/</code>. You can run them via the web UI dashboard, or through your favorite terminal and editor (VS Code, Cursor, OpenCode).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-bold">Installation Script:</span>
                  <button
                    onClick={() => copyToClipboard(agencyAgentsScript, "agents")}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedCode === "agents" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === "agents" ? "Copied" : "Copy commands"}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-200 text-[11px] overflow-x-auto leading-relaxed">
                  {agencyAgentsScript}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "env" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>100% Free Gemini API Setup:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  No credit card or paid subscription is required. Google AI Studio gives you a free API key with generous daily quota for personal development.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-200 font-bold">Follow these steps:</div>
                <ol className="list-decimal list-inside text-slate-300 space-y-2 text-[11px]">
                  <li>
                    Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 underline hover:text-cyan-300"
                    >
                      aistudio.google.com/app/apikey
                    </a>{" "}
                    and log in with your Google account.
                  </li>
                  <li>Click <strong>&quot;Create API Key&quot;</strong>.</li>
                  <li>Copy your key and paste it inside your local <code>.env</code> file:</li>
                </ol>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono">
                  GEMINI_API_KEY=AIzaSy...your_free_key_here
                </div>
              </div>
            </div>
          )}

          {activeTab === "bluetooth" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                  <Bluetooth className="w-4 h-4 text-blue-400" />
                  <span>Bluetooth Audio &amp; Microphone Auto-Handover:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When you turn on your Bluetooth headset (AirPods, Galaxy Buds, Sony WH-1000XM, Bose, etc.), both your <strong>voice recognition (Microphone)</strong> and <strong>JARVIS speech replies (Audio Output)</strong> immediately route through your Bluetooth device.
                </p>
              </div>

              {/* OS Configuration Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">Windows 11 / 10</div>
                  <p className="text-[11px] text-slate-400">
                    1. Pair Bluetooth headset.<br />
                    2. Press <code>Win + G</code> or go to <strong>Settings &gt; System &gt; Sound</strong>.<br />
                    3. Ensure your headset is set as <strong>Default Device</strong> and <strong>Default Communication Device</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">macOS</div>
                  <p className="text-[11px] text-slate-400">
                    1. Open <strong>System Settings &gt; Sound</strong>.<br />
                    2. macOS automatically sets connected AirPods or Bluetooth headsets for both Output and Input.<br />
                    3. Browser &amp; Python daemon detect the handover automatically.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">Linux (Pulse/PipeWire)</div>
                  <p className="text-[11px] text-slate-400">
                    Enable auto-handover module so audio switches instantly upon connection:<br />
                    <code>pactl load-module module-switch-on-connect</code>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-bold">Python Daemon Bluetooth Audio Commands:</span>
                  <button
                    onClick={() => copyToClipboard(bluetoothAutoScript, "bt")}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode === "bt" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === "bt" ? "Copied" : "Copy commands"}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-200 text-[11px] overflow-x-auto leading-relaxed">
                  {bluetoothAutoScript}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Parth&apos;s Autonomous Business Agent • Version 3.12-LIII
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
