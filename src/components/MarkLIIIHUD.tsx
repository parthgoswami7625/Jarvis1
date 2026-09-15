import React, { useState } from "react";
import { Eye, Smartphone, RotateCcw, Sparkles } from "lucide-react";
import { HUDTheme, MarkLIIIVoice, MemoryRecord, ScheduledReminder, SystemActionRecord, VoiceState } from "../types";
import { VoiceHUDCore } from "./mark_liii/VoiceHUDCore";
import { BluetoothAudioRoutingManager } from "./mark_liii/BluetoothAudioRoutingManager";
import { DesktopControlBar } from "./mark_liii/DesktopControlBar";
import { RecallableMemoryUndo } from "./mark_liii/RecallableMemoryUndo";
import { VisualAwarenessModal } from "./mark_liii/VisualAwarenessModal";
import { ClipboardIntelligence } from "./mark_liii/ClipboardIntelligence";
import { MultiModeSearchAndBriefing } from "./mark_liii/MultiModeSearchAndBriefing";
import { FileAndCodeProcessor } from "./mark_liii/FileAndCodeProcessor";
import { BrowserAndMessaging } from "./mark_liii/BrowserAndMessaging";

interface MarkLIIIHUDProps {
  theme: HUDTheme;
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  selectedVoice: MarkLIIIVoice;
  onExecuteVoiceCommand: (cmd: string) => Promise<void>;
  lastResponse: string;
  transcript: string;
  setTranscript: (t: string) => void;
  memories: MemoryRecord[];
  onAddMemory: (category: MemoryRecord["category"], key: string, content: string) => void;
  onDeleteMemory: (id: string) => void;
  undoStack: SystemActionRecord[];
  onUndoAction: (id: string) => void;
  onRecordAction: (action: Omit<SystemActionRecord, "id" | "timestamp" | "undone">) => void;
  reminders: ScheduledReminder[];
  onAddReminder: (title: string, time: string, priority: "low" | "medium" | "high") => void;
  onToggleReminder: (id: string) => void;
  onSendToLinkedIn: (text: string) => void;
  onOpenRemote: () => void;
  onPlayMorningBriefing: () => void;
  briefingText: string | null;
}

export const MarkLIIIHUD: React.FC<MarkLIIIHUDProps> = ({
  theme,
  voiceState,
  setVoiceState,
  selectedVoice,
  onExecuteVoiceCommand,
  lastResponse,
  transcript,
  setTranscript,
  memories,
  onAddMemory,
  onDeleteMemory,
  undoStack,
  onUndoAction,
  onRecordAction,
  reminders,
  onAddReminder,
  onToggleReminder,
  onSendToLinkedIn,
  onOpenRemote,
  onPlayMorningBriefing,
  briefingText,
}) => {
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(90);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [powerMode, setPowerMode] = useState<"performance" | "balanced" | "eco">("performance");
  const [isVisionOpen, setIsVisionOpen] = useState(false);

  const handleUndoLast = () => {
    const lastActive = [...undoStack].reverse().find((a) => !a.undone);
    if (lastActive) {
      onUndoAction(lastActive.id);
    }
  };

  const undoCount = undoStack.filter((a) => !a.undone).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Visual Awareness & Remote Pairing shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Layer 1: Mark-LIII Voice Interface &amp; Desktop Control</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              JARVIS HUD ACTIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Voice-driven PC automation • Local Vosk wake word (&quot;Hey Jarvis&quot;) • Gemini 3.8 Flash • Unlimited recallable memory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-vision-modal-btn"
            onClick={() => setIsVisionOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Awareness</span>
          </button>

          <button
            id="hud-remote-btn"
            onClick={onOpenRemote}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>QR Remote</span>
          </button>
        </div>
      </div>

      {/* Main Reactor Core & Waveform Visualizer */}
      <VoiceHUDCore
        theme={theme}
        voiceState={voiceState}
        setVoiceState={setVoiceState}
        selectedVoice={selectedVoice}
        onExecuteCommand={onExecuteVoiceCommand}
        lastResponse={lastResponse}
        transcript={transcript}
        setTranscript={setTranscript}
        onPlayMorningBriefing={onPlayMorningBriefing}
      />

      {/* Bluetooth Audio & Microphone Auto-Handover Subsystem */}
      <BluetoothAudioRoutingManager />

      {/* Desktop Hardware & App Launcher Controls */}
      <DesktopControlBar
        volume={volume}
        setVolume={setVolume}
        brightness={brightness}
        setBrightness={setBrightness}
        wifiEnabled={wifiEnabled}
        setWifiEnabled={setWifiEnabled}
        powerMode={powerMode}
        setPowerMode={setPowerMode}
        onRecordAction={onRecordAction}
        onUndoLastAction={handleUndoLast}
        undoCount={undoCount}
      />

      {/* Clipboard Intelligence Panel */}
      <ClipboardIntelligence onSendToLinkedIn={onSendToLinkedIn} />

      {/* Grid: Recallable Memory & Multi-Mode Search / Briefing */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecallableMemoryUndo
          memories={memories}
          onAddMemory={onAddMemory}
          onDeleteMemory={onDeleteMemory}
          undoStack={undoStack}
          onUndoAction={onUndoAction}
        />

        <MultiModeSearchAndBriefing
          reminders={reminders}
          onAddReminder={onAddReminder}
          onToggleReminder={onToggleReminder}
          onPlayBriefing={onPlayMorningBriefing}
          briefingText={briefingText}
        />
      </div>

      {/* Local Files & Code Reviewer */}
      <FileAndCodeProcessor />

      {/* Voice Browser & Messaging Integration */}
      <BrowserAndMessaging />

      {/* Visual Awareness Modal */}
      <VisualAwarenessModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
      />
    </div>
  );
};
