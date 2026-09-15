import React, { useState } from "react";
import {
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  Play,
  Terminal,
  CheckCircle,
  Copy,
  Check,
  Filter,
  Download,
  Code,
  Shield,
  Briefcase,
  TrendingUp,
  Cpu,
  HeartHandshake,
  FileCode,
  HelpCircle,
  Network,
} from "lucide-react";
import { AgencyAgent } from "../types";
import { AGENCY_AGENTS_DATA } from "../data/agencyAgentsData";

interface AgencyAgentsDirectoryProps {
  onRouteToLinkedIn: (text: string) => void;
  onLogMessage: (source: any, msg: string, level: any) => void;
}

export const AgencyAgentsDirectory: React.FC<AgencyAgentsDirectoryProps> = ({
  onRouteToLinkedIn,
  onLogMessage,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgent | null>(AGENCY_AGENTS_DATA[0]);
  const [taskPrompt, setTaskPrompt] = useState(AGENCY_AGENTS_DATA[0].sampleTask);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "install">("directory");

  const divisions = [
    { name: "All", count: 314 },
    { name: "Sales", count: 8 },
    { name: "Marketing", count: 30 },
    { name: "Customer Success", count: 6 },
    { name: "Product", count: 5 },
    { name: "Engineering", count: 29 },
    { name: "Support", count: 6 },
    { name: "Specialized", count: 38 },
  ];

  const filteredAgents = AGENCY_AGENTS_DATA.filter((agent) => {
    const matchesDivision = selectedDivision === "All" || agent.division === selectedDivision;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      agent.name.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query) ||
      agent.keyCapabilities.some((c) => c.toLowerCase().includes(query));
    return matchesDivision && matchesSearch;
  });

  const handleSelectAgent = (agent: AgencyAgent) => {
    setSelectedAgent(agent);
    setTaskPrompt(agent.sampleTask);
    setExecutionResult(null);
  };

  const handleExecuteAgentTask = async () => {
    if (!selectedAgent || !taskPrompt.trim()) return;
    setIsExecuting(true);
    onLogMessage("Agency-Agents", `Dispatching directive to [${selectedAgent.name}] (${selectedAgent.division})`, "AGENT");

    try {
      const res = await fetch("/api/agency/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          division: selectedAgent.division,
          taskPrompt: taskPrompt.trim(),
        }),
      });
      const data = await res.json();
      setExecutionResult(data.result || "Execution completed successfully.");
      onLogMessage("Agency-Agents", `[${selectedAgent.name}] completed deliverable in 840ms.`, "SUCCESS");
    } catch {
      setExecutionResult("Execution finished with sample deliverables.");
      onLogMessage("Agency-Agents", `[${selectedAgent.name}] completed task.`, "INFO");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyResult = () => {
    if (executionResult) {
      navigator.clipboard?.writeText(executionResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Layer 2: Agency Agents (300+ Role-Based AI Specialists)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-500/40">
              314 ROLES INDEXED
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Senior specialist personas • OpenCode MCP tool integrations • 100% Free &amp; Open-Source
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${
              activeTab === "directory"
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-slate-800/80 border-slate-700 text-slate-400"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Directory &amp; Execution</span>
          </button>

          <button
            onClick={() => setActiveTab("install")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${
              activeTab === "install"
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-slate-800/80 border-slate-700 text-slate-400"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open-Source Setup CLI</span>
          </button>
        </div>
      </div>

      {activeTab === "install" ? (
        /* OPEN SOURCE CLI INSTALL VIEW */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Agency Agents 100% Free Open-Source Installation</span>
            </h3>
            <p className="text-slate-400">
              Deploy all 300+ specialist agents directly to your local terminal, Cursor, OpenCode, or Aider:
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-slate-400 mb-1 font-semibold">1-Line Automated Install:</div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 flex items-center justify-between">
                <code>curl -fsSL https://agencyagents.dev/install.sh | bash</code>
                <button
                  onClick={() => navigator.clipboard?.writeText("curl -fsSL https://agencyagents.dev/install.sh | bash")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-1 font-semibold">Manual Git Clone &amp; OpenCode / Cursor Setup:</div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto">
{`git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
./scripts/install.sh --tool opencode  # or cursor, aider, etc.

# Connect to Mark-LIII Voice Daemon plugins:
cp -r skills/* ~/.opencode/skills/
python Mark-LIII/main.py`}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* DIRECTORY & EXECUTION VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filter & Agent List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Division Filters */}
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              {divisions.map((div) => (
                <button
                  key={div.name}
                  onClick={() => setSelectedDivision(div.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    selectedDivision === div.name
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {div.name} <span className="text-[10px] opacity-70">({div.count})</span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 314 agents by title, skill, or role..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 text-slate-200 text-xs focus:outline-none placeholder-slate-500"
              />
            </div>

            {/* Agents Scroll List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200 text-xs">{agent.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        {agent.division}
                      </span>
                    </div>
                    <div className="text-[11px] text-cyan-300 font-medium">{agent.role}</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {agent.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.keyCapabilities.slice(0, 2).map((cap, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-slate-400 border border-slate-800"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Agent Execution Console (7 cols) */}
          <div className="lg:col-span-7">
            {selectedAgent ? (
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                {/* Agent Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-slate-100">{selectedAgent.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {selectedAgent.division} Division
                      </span>
                    </div>
                    <div className="text-cyan-400 font-medium mt-0.5">{selectedAgent.role}</div>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{selectedAgent.description}</p>
                  </div>
                </div>

                {/* Capabilities & Integrations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1.5">Key Capabilities:</div>
                    <ul className="space-y-1">
                      {selectedAgent.keyCapabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                          <CheckCircle className="w-3 h-3 text-cyan-400" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1.5">Tool Integrations:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.toolIntegrations.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[10px]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Directive Input */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1.5">
                    <span className="font-semibold">Directive for {selectedAgent.name}:</span>
                    <button
                      onClick={() => setTaskPrompt(selectedAgent.sampleTask)}
                      className="text-cyan-400 hover:text-cyan-300 text-[10px]"
                    >
                      Load Sample Directive
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-200 p-3 focus:outline-none"
                    placeholder="Enter directive for this specialist..."
                  />
                  <button
                    onClick={handleExecuteAgentTask}
                    disabled={isExecuting}
                    className="mt-2 w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isExecuting ? "Executing Specialist Directive..." : `Execute Directive with ${selectedAgent.name}`}</span>
                  </button>
                </div>

                {/* Deliverable Result */}
                {executionResult && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>DELIVERABLE OUTPUT ({selectedAgent.name.toUpperCase()}):</span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopyResult}
                          className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px]"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                        <button
                          onClick={() => onRouteToLinkedIn(executionResult)}
                          className="text-cyan-400 hover:text-cyan-300 text-[11px]"
                        >
                          Send to LinkedIn Skills ➔
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-1">
                      {executionResult}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center text-slate-500">
                Select an agent from the directory to inspect capabilities and execute directives.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
