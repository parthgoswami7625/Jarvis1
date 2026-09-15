import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Sun,
  Wifi,
  WifiOff,
  Power,
  Terminal,
  Globe,
  Code,
  MessageSquare,
  FileText,
  Calculator,
  Settings,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { SystemActionRecord } from "../../types";

interface DesktopControlBarProps {
  volume: number;
  setVolume: (v: number) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (w: boolean) => void;
  powerMode: "performance" | "balanced" | "eco";
  setPowerMode: (m: "performance" | "balanced" | "eco") => void;
  onRecordAction: (action: Omit<SystemActionRecord, "id" | "timestamp" | "undone">) => void;
  onUndoLastAction: () => void;
  undoCount: number;
}

export const DesktopControlBar: React.FC<DesktopControlBarProps> = ({
  volume,
  setVolume,
  brightness,
  setBrightness,
  wifiEnabled,
  setWifiEnabled,
  powerMode,
  setPowerMode,
  onRecordAction,
  onUndoLastAction,
  undoCount,
}) => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const apps = [
    { id: "terminal", name: "Terminal", icon: Terminal, cmd: "open -a Terminal" },
    { id: "browser", name: "Chrome", icon: Globe, cmd: "open -a Google Chrome" },
    { id: "vscode", name: "VS Code", icon: Code, cmd: "code ." },
    { id: "slack", name: "Slack", icon: MessageSquare, cmd: "open -a Slack" },
    { id: "notion", name: "Notion", icon: FileText, cmd: "open -a Notion" },
    { id: "calc", name: "Calculator", icon: Calculator, cmd: "open -a Calculator" },
    { id: "settings", name: "Sys Settings", icon: Settings, cmd: "open /System/Applications/System\\ Settings.app" },
  ];

  const handleLaunchApp = (app: typeof apps[0]) => {
    setActiveApp(app.name);
    setFeedbackMsg(`Mark-LIII Voice: Launched ${app.name} (${app.cmd})`);
    onRecordAction({
      actionType: "file_write",
      description: `Launched application: ${app.name}`,
      previousValue: null,
      currentValue: app.name,
    });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleVolumeChange = (newVol: number) => {
    onRecordAction({
      actionType: "volume_change",
      description: `Adjusted system volume to ${newVol}%`,
      previousValue: volume,
      currentValue: newVol,
    });
    setVolume(newVol);
  };

  const handleBrightnessChange = (newBri: number) => {
    onRecordAction({
      actionType: "brightness_change",
      description: `Adjusted display brightness to ${newBri}%`,
      previousValue: brightness,
      currentValue: newBri,
    });
    setBrightness(newBri);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Desktop & PC Automation (Mark-LIII OS Control)</span>
        </div>

        {/* Undo Trigger */}
        <div className="flex items-center space-x-2">
          {feedbackMsg && (
            <span className="flex items-center gap-1 text-emerald-400 text-[11px] animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> {feedbackMsg}
            </span>
          )}
          <button
            id="desktop-undo-btn"
            onClick={onUndoLastAction}
            disabled={undoCount === 0}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition ${
              undoCount > 0
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                : "bg-slate-800/40 border-slate-800 text-slate-400 cursor-not-allowed"
            }`}
            title="Reverse last action (file move, write, volume, brightness)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Action ({undoCount})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hardware Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                System Volume
              </span>
              <span className="text-cyan-300 font-semibold">{volume}%</span>
            </div>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Display Brightness
              </span>
              <span className="text-amber-300 font-semibold">{brightness}%</span>
            </div>
            <input
              id="brightness-slider"
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Network & Power States */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2">
              {wifiEnabled ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
              <div>
                <div className="text-slate-200 font-medium">Parth-Mesh-WiFi</div>
                <div className="text-[10px] text-slate-400">{wifiEnabled ? "5.8 GHz • 840 Mbps" : "Offline"}</div>
              </div>
            </div>
            <button
              id="wifi-toggle-btn"
              onClick={() => {
                const next = !wifiEnabled;
                setWifiEnabled(next);
                onRecordAction({
                  actionType: "file_write",
                  description: `Toggled WiFi: ${next ? "Connected" : "Disconnected"}`,
                  previousValue: wifiEnabled,
                  currentValue: next,
                });
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                wifiEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-400"
              }`}
            >
              {wifiEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-slate-200 font-medium">Power Profile</div>
                <div className="text-[10px] text-slate-400">Zero Cloud Sleep Daemon</div>
              </div>
            </div>
            <div className="flex gap-1">
              {(["eco", "balanced", "performance"] as const).map((mode) => (
                <button
                  key={mode}
                  id={`power-mode-${mode}-btn`}
                  onClick={() => setPowerMode(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                    powerMode === mode
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mode.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick App Launcher */}
        <div>
          <div className="text-slate-400 mb-2 font-medium">Voice App Launcher:</div>
          <div className="grid grid-cols-4 gap-1.5">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  id={`launch-app-${app.id}`}
                  onClick={() => handleLaunchApp(app)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition group"
                  title={`Launch ${app.name} (${app.cmd})`}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 mb-1" />
                  <span className="text-[10px] tracking-tight">{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
