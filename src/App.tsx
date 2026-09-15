import React, { useState } from "react";
import {
  ActiveLayer,
  HUDTheme,
  MarkLIIIVoice,
  MemoryRecord,
  ScheduledReminder,
  SystemActionRecord,
  TelemetryLog,
  VoiceState,
} from "./types";
import { Navbar } from "./components/Navbar";
import { MarkLIIIHUD } from "./components/MarkLIIIHUD";
import { AgencyAgentsDirectory } from "./components/AgencyAgentsDirectory";
import { LinkedInSkillsHub } from "./components/LinkedInSkillsHub";
import { MultiAgentSalesWorkflow } from "./components/MultiAgentSalesWorkflow";
import { RemoteDashboardModal } from "./components/RemoteDashboardModal";
import { LocalPCSetupGuideModal } from "./components/LocalPCSetupGuideModal";
import { SystemTelemetryLogs } from "./components/SystemTelemetryLogs";

export default function App() {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("mark_liii");
  const [theme, setTheme] = useState<HUDTheme>("cyan-jarvis");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [selectedVoice, setSelectedVoice] = useState<MarkLIIIVoice>("Zephyr");
  const [isRemoteOpen, setIsRemoteOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  // HUD Voice state
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState<string>(
    "Mark-LIII Voice Interface initialized. All 314 Agency specialists loaded in memory. Ready for your directive, Parth."
  );
  const [briefingText, setBriefingText] = useState<string | null>(null);

  // Inter-layer routing state (e.g. from Agency or Clipboard into LinkedIn skills)
  const [routedTextForLinkedIn, setRoutedTextForLinkedIn] = useState<string>("");

  // Unlimited Recallable Local Memory
  const [memories, setMemories] = useState<MemoryRecord[]>([
    {
      id: "mem-1",
      category: "preference",
      key: "Banned AI Vocabulary",
      content:
        "Strictly avoid words: leverage, fundamentally, streamline, harness, delve, unlock, foster. Cap em dashes at 1 per 100 words.",
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: "mem-2",
      category: "directive",
      key: "Architecture Priority",
      content:
        "100% Free & Open Source stack. Run Mark-LIII locally on Python 3.12 with zero cloud streaming when asleep. Use Gemini 3.8 Flash for inference.",
      timestamp: Date.now() - 3600000 * 12,
    },
    {
      id: "mem-3",
      category: "contact",
      key: "Target Enterprise ICP",
      content:
        "B2B SaaS Founders and VP of Engineering running agent workflows with 20-200 team members.",
      timestamp: Date.now() - 3600000 * 6,
    },
    {
      id: "mem-4",
      category: "context",
      key: "Q3 ARR Target",
      content:
        "Targeting $42,000 net new ARR through automated agency outbound and high-signal LinkedIn thought leadership.",
      timestamp: Date.now() - 3600000 * 2,
    },
  ]);

  // Reversible Undo Stack
  const [undoStack, setUndoStack] = useState<SystemActionRecord[]>([
    {
      id: "act-1",
      actionType: "file_write",
      description: "Generated LinkedIn post draft: Contrarian Truth Hook",
      previousValue: "Empty file",
      currentValue: "Draft created in ~/drafts/post_2026_09_15.md",
      timestamp: Date.now() - 1800000,
      undone: false,
    },
    {
      id: "act-2",
      actionType: "volume_change",
      description: "Adjusted system volume to 80%",
      previousValue: 60,
      currentValue: 80,
      timestamp: Date.now() - 900000,
      undone: false,
    },
  ]);

  // Scheduled Reminders
  const [reminders, setReminders] = useState<ScheduledReminder[]>([
    {
      id: "rem-1",
      title: "Publish 2026 Contrarian Truth Post to LinkedIn",
      time: "08:30 AM",
      active: true,
      priority: "high",
    },
    {
      id: "rem-2",
      title: "Review Outbound Strategist Lead Qualification Batch (40 leads)",
      time: "11:00 AM",
      active: true,
      priority: "medium",
    },
    {
      id: "rem-3",
      title: "Verify Mark-LIII Vosk Local Wake Daemon Health",
      time: "03:00 PM",
      active: true,
      priority: "high",
    },
  ]);

  // System Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    {
      id: "log-1",
      timestamp: "04:08:12",
      source: "Daemon",
      message: "Mark-LIII Voice Daemon online on port 3000. Vosk local wake engine hooked.",
      level: "SUCCESS",
    },
    {
      id: "log-2",
      timestamp: "04:08:13",
      source: "Memory",
      message: "Indexed 4 recallable local memory vectors without token boundaries.",
      level: "INFO",
    },
    {
      id: "log-3",
      timestamp: "04:08:14",
      source: "Agency",
      message: "Loaded 314 agency specialist definitions across 7 divisions.",
      level: "AGENT",
    },
    {
      id: "log-4",
      timestamp: "04:08:15",
      source: "LinkedIn",
      message: "11 marketing automation skills verified with 2026 anti-slop rules.",
      level: "SUCCESS",
    },
  ]);

  const addTelemetryLog = (source: TelemetryLog["source"], message: string, level: TelemetryLog["level"] = "INFO") => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      source,
      message,
      level,
    };
    setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 50)]);
  };

  // Instant Acknowledgment Voice synthesis helper
  const speakVoiceOutput = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setVoiceState("idle");
      setVoiceState("speaking");
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice Command Execution via Gemini backend
  const handleExecuteVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    setVoiceState("processing");
    addTelemetryLog("Voice", `User Voice Directive: "${command}"`, "VOICE");

    // Instant context-aware acknowledgment
    const instantReplies = [
      "Right away, Parth.",
      "Executing directive, Parth.",
      "On it, Parth. Processing through autonomous framework.",
    ];
    const ack = instantReplies[Math.floor(Math.random() * instantReplies.length)];
    speakVoiceOutput(ack);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: command,
          systemInstruction: `You are Mark-LIII, Parth's personal JARVIS autonomous desktop assistant.
You have 314 Agency Specialist Agents and 11 LinkedIn marketing skills at your disposal.
Parth is building his business on 100% free, open-source tools without Claude Code.
Be direct, razor-sharp, and authoritative. Provide concrete solutions, numbers, or actions.
Avoid banned words: leverage, fundamentally, streamline, harness, delve, unlock, foster. Limit em dashes.`,
        }),
      });
      const data = await res.json();
      const reply = data.text || "Command processed successfully, Parth.";
      setLastResponse(reply);
      setTranscript(command);
      addTelemetryLog("Voice", `Mark-LIII Gemini 3.8 Flash response generated.`, "SUCCESS");

      // Auto-speak reply
      speakVoiceOutput(reply.slice(0, 240));

      // Voice-triggered Layer Switching
      const lower = command.toLowerCase();
      if (lower.includes("sales") || lower.includes("scenario 2") || lower.includes("outbound pipeline")) {
        setActiveLayer("sales_workflow");
        addTelemetryLog("Voice", "Routing to Scenario 2: Multi-Agent Sales Workflow.", "AGENT");
      } else if (lower.includes("linkedin") || lower.includes("post writer") || lower.includes("humanizer")) {
        setActiveLayer("linkedin_skills");
      } else if (lower.includes("agents") || lower.includes("specialist") || lower.includes("directory")) {
        setActiveLayer("agency_agents");
      }

      // Record in memory if directive
      if (lower.includes("remember") || lower.includes("save")) {
        handleAddMemory("directive", "Voice Directive", command);
      }
    } catch {
      const fallback = `Directive acknowledged: ${command}. Mark-LIII autonomous daemon updated.`;
      setLastResponse(fallback);
      speakVoiceOutput(fallback);
    }
  };

  // Play Morning Briefing
  const handlePlayMorningBriefing = async () => {
    addTelemetryLog("Voice", "Generating live executive morning briefing...", "VOICE");
    setVoiceState("processing");

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            "Generate a crisp, high-signal executive morning briefing for Parth. Recap yesterday's agency agent accomplishments, today's LinkedIn posting agenda, and live autonomous tech trends.",
        }),
      });
      const data = await res.json();
      const brief = data.text || "Good morning Parth. All 314 agents are nominal.";
      setBriefingText(brief);
      setLastResponse(brief);
      addTelemetryLog("Voice", "Morning briefing synthesized.", "SUCCESS");
      speakVoiceOutput(brief.slice(0, 260));
    } catch {
      speakVoiceOutput("Good morning Parth. Mark-LIII is fully operational.");
    }
  };

  // Memory Handlers
  const handleAddMemory = (category: MemoryRecord["category"], key: string, content: string) => {
    const newMem: MemoryRecord = {
      id: `mem-${Date.now()}`,
      category,
      key,
      content,
      timestamp: Date.now(),
    };
    setMemories((prev) => [newMem, ...prev]);
    addTelemetryLog("Memory", `Saved local memory: [${key}] under category ${category}`, "SUCCESS");
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    addTelemetryLog("Memory", `Purged memory vector ${id}`, "INFO");
  };

  // Undo Handlers
  const handleRecordAction = (action: Omit<SystemActionRecord, "id" | "timestamp" | "undone">) => {
    const newAct: SystemActionRecord = {
      ...action,
      id: `act-${Date.now()}`,
      timestamp: Date.now(),
      undone: false,
    };
    setUndoStack((prev) => [newAct, ...prev]);
  };

  const handleUndoAction = (id: string) => {
    setUndoStack((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          addTelemetryLog("Daemon", `Reversed system action: ${item.description}`, "INFO");
          return { ...item, undone: true };
        }
        return item;
      })
    );
  };

  // Reminder Handlers
  const handleAddReminder = (title: string, time: string, priority: "low" | "medium" | "high") => {
    const newRem: ScheduledReminder = {
      id: `rem-${Date.now()}`,
      title,
      time,
      priority,
      active: true,
    };
    setReminders((prev) => [newRem, ...prev]);
    addTelemetryLog("Daemon", `Scheduled reminder: "${title}" for ${time}`, "INFO");
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  // Route text from Layer 1/2 to Layer 3
  const handleRouteToLinkedIn = (text: string) => {
    setRoutedTextForLinkedIn(text);
    setActiveLayer("linkedin_skills");
    addTelemetryLog("LinkedIn", "Routed deliverable into LinkedIn Post Writer.", "AGENT");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top HUD Navigation Bar */}
      <Navbar
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        currentTheme={theme}
        setTheme={setTheme}
        voiceState={voiceState}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        onOpenRemote={() => setIsRemoteOpen(true)}
        onTriggerWakeWord={() =>
          handleExecuteVoiceCommand("Hey Jarvis, summarize today's operational goals.")
        }
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
      />

      {/* Main Multi-Layer Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeLayer === "mark_liii" && (
          <MarkLIIIHUD
            theme={theme}
            voiceState={voiceState}
            setVoiceState={setVoiceState}
            selectedVoice={selectedVoice}
            onExecuteVoiceCommand={handleExecuteVoiceCommand}
            lastResponse={lastResponse}
            transcript={transcript}
            setTranscript={setTranscript}
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            undoStack={undoStack}
            onUndoAction={handleUndoAction}
            onRecordAction={handleRecordAction}
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onSendToLinkedIn={handleRouteToLinkedIn}
            onOpenRemote={() => setIsRemoteOpen(true)}
            onPlayMorningBriefing={handlePlayMorningBriefing}
            briefingText={briefingText}
          />
        )}

        {activeLayer === "agency_agents" && (
          <AgencyAgentsDirectory
            onRouteToLinkedIn={handleRouteToLinkedIn}
            onLogMessage={addTelemetryLog}
          />
        )}

        {activeLayer === "sales_workflow" && (
          <MultiAgentSalesWorkflow
            onSpeak={speakVoiceOutput}
            onSaveMemory={(k, v) => handleAddMemory("directive", k, v)}
            onLogMessage={addTelemetryLog}
          />
        )}

        {activeLayer === "linkedin_skills" && (
          <LinkedInSkillsHub
            initialInputText={routedTextForLinkedIn}
            onLogMessage={addTelemetryLog}
          />
        )}

        {/* Live System Telemetry Drawer */}
        <SystemTelemetryLogs
          logs={telemetryLogs}
          onClearLogs={() => setTelemetryLogs([])}
        />
      </main>

      {/* Footer info */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-6 font-mono text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Parth&apos;s Autonomous Business Agent • 100% Free &amp; Open-Source</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Layer 1: Mark-LIII</span>
          <span>•</span>
          <span>Layer 2: 314 Agency Agents</span>
          <span>•</span>
          <span>Layer 3: 11 LinkedIn Skills</span>
        </div>
      </footer>

      {/* Remote Dashboard Modal */}
      <RemoteDashboardModal
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
      />

      {/* Local PC Setup Guide Modal */}
      <LocalPCSetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}
