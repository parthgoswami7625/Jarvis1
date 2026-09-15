import React from "react";
import {
  Mic,
  MicOff,
  Cpu,
  Layers,
  Share2,
  Briefcase,
  GitMerge,
  Terminal,
  Smartphone,
  Laptop,
  Volume2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ActiveLayer, HUDTheme, MarkLIIIVoice, VoiceState } from "../types";

interface NavbarProps {
  activeLayer: ActiveLayer;
  setActiveLayer: (layer: ActiveLayer) => void;
  currentTheme: HUDTheme;
  setTheme: (theme: HUDTheme) => void;
  voiceState: VoiceState;
  selectedVoice: MarkLIIIVoice;
  setSelectedVoice: (voice: MarkLIIIVoice) => void;
  onOpenRemote: () => void;
  onTriggerWakeWord: () => void;
  onOpenSetupGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeLayer,
  setActiveLayer,
  currentTheme,
  setTheme,
  voiceState,
  selectedVoice,
  setSelectedVoice,
  onOpenRemote,
  onTriggerWakeWord,
  onOpenSetupGuide,
}) => {
  const themes: { id: HUDTheme; label: string; color: string }[] = [
    { id: "arc-blue", label: "Arc Blue", color: "bg-cyan-500" },
    { id: "emerald-matrix", label: "Matrix", color: "bg-emerald-500" },
    { id: "crimson-protocol", label: "Crimson", color: "bg-rose-500" },
    { id: "amber-titan", label: "Titan", color: "bg-amber-500" },
    { id: "violet-synth", label: "Synth", color: "bg-purple-500" },
  ];

  const voices: MarkLIIIVoice[] = ["Zephyr", "Kore", "Puck", "Charon", "Fenrir"];

  const tabs: { id: ActiveLayer; label: string; icon: any; badge: string }[] = [
    { id: "mark_liii", label: "Mark-LIII Voice HUD", icon: Mic, badge: "Voice & PC" },
    { id: "agency_agents", label: "Agency Agents", icon: Layers, badge: "314 Roles" },
    { id: "sales_workflow", label: "Scenario 2: Sales Workflow", icon: Briefcase, badge: "6-Agent Swarm" },
    { id: "linkedin_skills", label: "LinkedIn Skills", icon: Share2, badge: "11 Skills" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Cpu className="w-5 h-5 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
                  Parth's Autonomous Business Agent
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-tight font-medium rounded bg-cyan-950/70 border border-cyan-700/50 text-cyan-300">
                  MARK-LIII
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> 100% Free & Open-Source
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400">Gemini 3.8 Flash Core</span>
              </div>
            </div>
          </div>

          {/* Quick Controls: Wake word, Voice picker, Theme, Phone Remote */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wake Word Status Button */}
            <button
              id="wake-word-toggle-btn"
              onClick={onTriggerWakeWord}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                voiceState === "listening" || voiceState === "speaking"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : voiceState === "sleeping"
                  ? "bg-slate-900 border-slate-700 text-slate-400"
                  : "bg-slate-900/90 border-slate-700 hover:border-cyan-500/50 text-slate-300"
              }`}
              title="Click to trigger wake word simulation"
            >
              {voiceState === "sleeping" ? (
                <MicOff className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Mic className={`w-3.5 h-3.5 ${voiceState === "listening" ? "text-cyan-400 animate-bounce" : "text-emerald-400"}`} />
              )}
              <span>Wake: &quot;Hey Jarvis&quot;</span>
              <span className={`w-2 h-2 rounded-full ${voiceState === "sleeping" ? "bg-rose-500" : "bg-emerald-400 animate-ping"}`} />
            </button>

            {/* Voice Picker */}
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 font-mono text-[11px]">Voice:</span>
              <select
                id="voice-picker-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as MarkLIIIVoice)}
                className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v} value={v} className="bg-slate-900 text-slate-200">
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* HUD Theme Picker */}
            <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-900/80 border border-slate-800 rounded-lg">
              <Sparkles className="w-3 h-3 text-slate-400" />
              {themes.map((t) => (
                <button
                  key={t.id}
                  id={`theme-btn-${t.id}`}
                  onClick={() => setTheme(t.id)}
                  title={`HUD Theme: ${t.label}`}
                  className={`w-4 h-4 rounded-full ${t.color} transition-all ${
                    currentTheme === t.id ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* Phone Remote QR Trigger */}
            <button
              id="open-remote-phone-btn"
              onClick={onOpenRemote}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition"
              title="Pair Phone via QR Code"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Remote</span>
            </button>

            {/* Local PC Setup Guide Button */}
            {onOpenSetupGuide && (
              <button
                id="open-pc-setup-guide-btn"
                onClick={onOpenSetupGuide}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:text-emerald-200 transition"
                title="View local PC setup commands"
              >
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span>PC Setup</span>
              </button>
            )}
          </div>
        </div>

        {/* Layer Navigation Tabs */}
        <div className="flex space-x-2 py-2 overflow-x-auto scrollbar-none border-t border-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLayer === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveLayer(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-cyan-500/15 border border-cyan-400/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? "bg-cyan-900/60 text-cyan-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
