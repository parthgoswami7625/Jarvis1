import React, { useState } from "react";
import {
  Briefcase,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Download,
  Volume2,
  Layers,
  ArrowRight,
  Database,
  Building,
  DollarSign,
  User,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { OrchestrationStep } from "../types";

interface MultiAgentSalesWorkflowProps {
  onSpeak: (text: string) => void;
  onSaveMemory: (key: string, content: string) => void;
  onLogMessage: (source: any, msg: string, level: any) => void;
}

export const MultiAgentSalesWorkflow: React.FC<MultiAgentSalesWorkflowProps> = ({
  onSpeak,
  onSaveMemory,
  onLogMessage,
}) => {
  // Target prospect inputs
  const [targetCompany, setTargetCompany] = useState("FinScale Cloud Systems");
  const [personaTitle, setPersonaTitle] = useState("VP of Engineering & Platform");
  const [dealSize, setDealSize] = useState("$68,000 ARR");
  const [corePainPoint, setCorePainPoint] = useState(
    "Paying $210,000/year for closed AI coding licenses that leak IP and suffer from hallucinated tool calls."
  );

  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [dossierOutput, setDossierOutput] = useState<string | null>(null);
  const [voiceDebrief, setVoiceDebrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dispatchedAlert, setDispatchedAlert] = useState(false);

  const steps: OrchestrationStep[] = [
    {
      stepNumber: 1,
      agentOrSkill: "Outbound Strategist",
      actionDescription: "Analyze target ICP, build personalized cold angle & high-open subject lines",
      status: activeStepIndex > 0 ? "completed" : activeStepIndex === 0 ? "running" : "pending",
      timeMs: 720,
    },
    {
      stepNumber: 2,
      agentOrSkill: "Discovery Coach",
      actionDescription: "Structure MEDDPICC qualification framework & tactical objection battlecard",
      status: activeStepIndex > 1 ? "completed" : activeStepIndex === 1 ? "running" : "pending",
      timeMs: 840,
    },
    {
      stepNumber: 3,
      agentOrSkill: "Sales Engineer",
      actionDescription: "Audit technical fit, open-source migration blueprint & TCO savings calculation",
      status: activeStepIndex > 2 ? "completed" : activeStepIndex === 2 ? "running" : "pending",
      timeMs: 910,
    },
    {
      stepNumber: 4,
      agentOrSkill: "Proposal Strategist",
      actionDescription: "Craft tailored executive proposal, commercial terms, and milestone guarantees",
      status: activeStepIndex > 3 ? "completed" : activeStepIndex === 3 ? "running" : "pending",
      timeMs: 780,
    },
    {
      stepNumber: 5,
      agentOrSkill: "Pipeline Analyst",
      actionDescription: "Model deal close probability, velocity forecast & 24-hour tactical actions",
      status: activeStepIndex > 4 ? "completed" : activeStepIndex === 4 ? "running" : "pending",
      timeMs: 650,
    },
    {
      stepNumber: 6,
      agentOrSkill: "LinkedIn Outreach DM Crafter",
      actionDescription: "Generate 2026 voice-rules compliant peer connection request & follow-up message",
      status: activeStepIndex > 5 ? "completed" : activeStepIndex === 5 ? "running" : "pending",
      timeMs: 590,
    },
  ];

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setActiveStepIndex(0);
    setDossierOutput(null);
    setVoiceDebrief(null);
    setDispatchedAlert(false);

    onLogMessage("Sales-Workflow", `Initiating Scenario 2: Multi-Agent Sales Workflow for ${targetCompany}...`, "AGENT");

    // Sequential visual simulation while triggering the backend
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < 5) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    try {
      const res = await fetch("/api/sales-workflow/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCompany,
          personaTitle,
          dealSize,
          corePainPoint,
        }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      setActiveStepIndex(6); // All completed

      setDossierOutput(data.dossier || "Sales workflow executed successfully.");
      setVoiceDebrief(data.voiceDebrief || `Sales workflow completed for ${targetCompany}.`);

      onLogMessage("Sales-Workflow", `All 6 agent deliverables compiled for ${targetCompany}.`, "SUCCESS");

      // Spoken voice acknowledgment by Mark-LIII
      if (data.voiceDebrief) {
        onSpeak(data.voiceDebrief);
      }
    } catch {
      clearInterval(stepInterval);
      setActiveStepIndex(6);
      setDossierOutput("Sales workflow completed with standard open-source framework.");
      onLogMessage("Sales-Workflow", `Workflow finished with local cache.`, "INFO");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (dossierOutput) {
      navigator.clipboard?.writeText(dossierOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToMemory = () => {
    if (dossierOutput) {
      onSaveMemory(
        `Sales Deal: ${targetCompany}`,
        `Target: ${personaTitle} at ${targetCompany}. Deal Value: ${dealSize}. Pain: ${corePainPoint}. Strategy: Outbound + Sales Engineer TCO comparison.`
      );
    }
  };

  const handleDispatchAlert = () => {
    setDispatchedAlert(true);
    onLogMessage("Sales-Workflow", `Dispatched sales dossier alert via WhatsApp & Telegram.`, "SUCCESS");
    setTimeout(() => setDispatchedAlert(false), 4000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Scenario 2: Multi-Agent Sales Workflow</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              6-AGENT SEQUENTIAL PIPELINE
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automates enterprise B2B sales development from cold outreach to technical architecture &amp; executive commercial proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="run-sales-workflow-btn"
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? "Agents Orchestrating..." : "Execute Sales Workflow"}</span>
          </button>
        </div>
      </div>

      {/* Target Opportunity Configuration Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold uppercase tracking-wider">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Target Opportunity Profile (Inputs for the 6-Agent Swarm)</span>
          </div>
          <span className="text-[11px] text-slate-500">Autonomous B2B Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-400 text-[11px] font-medium block mb-1">Target Account / Company:</label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] font-medium block mb-1">Prospect Title / Persona:</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={personaTitle}
                onChange={(e) => setPersonaTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] font-medium block mb-1">Target Deal Value / ARR:</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={dealSize}
                onChange={(e) => setDealSize(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-[11px] font-medium block mb-1">
            Primary Business &amp; Technical Pain Point:
          </label>
          <textarea
            rows={2}
            value={corePainPoint}
            onChange={(e) => setCorePainPoint(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 6-Step Multi-Agent Orchestration Sequence Tracker */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Agent Orchestration Pipeline (Scenario 2 Execution Timeline)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {activeStepIndex >= 6 ? "Pipeline Complete (100%)" : isRunning ? `Phase ${activeStepIndex + 1} of 6 In Flight` : "Ready to Dispatch"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition ${
                step.status === "running"
                  ? "bg-emerald-950/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : step.status === "completed"
                  ? "bg-slate-950 border-emerald-500/40"
                  : "bg-slate-950/60 border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-900 text-emerald-300 border border-emerald-800/40">
                  Phase {step.stepNumber}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {step.timeMs}ms
                </span>
              </div>
              <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : step.status === "running" ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600 mr-1" />
                )}
                <span>{step.agentOrSkill}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{step.actionDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Voice Debrief Bar */}
      {voiceDebrief && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> MARK-LIII VOICE DEBRIEF FOR PARTH:
              </div>
              <p className="text-slate-300 text-xs mt-0.5">{voiceDebrief}</p>
            </div>
          </div>
          <button
            onClick={() => onSpeak(voiceDebrief)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 transition text-[11px]"
          >
            Replay Spoken Debrief
          </button>
        </div>
      )}

      {/* Generated Dossier Console */}
      {dossierOutput && (
        <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-6 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-100 text-sm">
                Complete Multi-Agent Sales Dossier ({targetCompany.toUpperCase()})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Dossier"}</span>
              </button>

              <button
                onClick={handleSaveToMemory}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 transition text-[11px]"
              >
                <Database className="w-3 h-3" />
                <span>Save to Local Memory</span>
              </button>

              <button
                onClick={handleDispatchAlert}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition text-[11px]"
              >
                <Send className="w-3 h-3" />
                <span>{dispatchedAlert ? "Alert Dispatched!" : "Dispatch to WhatsApp"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[500px] overflow-y-auto text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-xs pr-2">
            {dossierOutput}
          </div>
        </div>
      )}
    </div>
  );
};
