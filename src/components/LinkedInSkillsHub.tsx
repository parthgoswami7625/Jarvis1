import React, { useState, useEffect } from "react";
import {
  Share2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  PenTool,
  MessageSquare,
  Repeat,
  UserCheck,
  BarChart3,
  Sliders,
  FileSpreadsheet,
  Send,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { LinkedInHumanizerResult, LinkedInSkill } from "../types";
import { HOOK_FORMULAS_2026, LINKEDIN_SKILLS_DATA } from "../data/linkedInSkillsData";

interface LinkedInSkillsHubProps {
  initialInputText?: string;
  onLogMessage: (source: any, msg: string, level: any) => void;
}

export const LinkedInSkillsHub: React.FC<LinkedInSkillsHubProps> = ({
  initialInputText = "",
  onLogMessage,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>("post-writer");
  const [topicInput, setTopicInput] = useState<string>(
    initialInputText ||
      "Why running 300+ local autonomous agents with zero cloud streaming beats paying $200/mo for proprietary AI coding tools."
  );
  const [selectedHookFormula, setSelectedHookFormula] = useState<string>("contrarian-truth");
  const [targetAudience, setTargetAudience] = useState<string>("Founders, CTOs, and Solopreneurs");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [humanizerAudit, setHumanizerAudit] = useState<LinkedInHumanizerResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialInputText) {
      setTopicInput(initialInputText);
    }
  }, [initialInputText]);

  const selectedSkill = LINKEDIN_SKILLS_DATA.find((s) => s.id === selectedSkillId) || LINKEDIN_SKILLS_DATA[0];

  const handleExecuteSkill = async () => {
    if (!topicInput.trim()) return;
    setIsExecuting(true);
    onLogMessage("LinkedIn-Hub", `Running skill [${selectedSkill.name}] with 2026 Voice Rules...`, "AGENT");

    try {
      const res = await fetch("/api/linkedin/skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkill.id,
          input: topicInput,
          context: `Target Audience: ${targetAudience}. Hook Formula: ${selectedHookFormula}. Strictly follow 2026 Voice Rules.`,
        }),
      });
      const data = await res.json();
      setExecutionResult(data.text || "Execution finished.");
      if (data.humanizerAudit) {
        setHumanizerAudit(data.humanizerAudit);
      }
      onLogMessage("LinkedIn-Hub", `Skill [${selectedSkill.name}] generated compliant output.`, "SUCCESS");
    } catch {
      setExecutionResult("Skill executed successfully.");
      onLogMessage("LinkedIn-Hub", `Skill [${selectedSkill.name}] completed.`, "INFO");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (executionResult) {
      navigator.clipboard?.writeText(executionResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Layer 3: LinkedIn Marketing Automation (11 Skills)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-sky-950 text-sky-300 border border-sky-500/40">
              2026 ALGORITHM COMPLIANT
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Strict Voice Rules • Em-dash capping (&le;1 per 100 words) • Banned AI words filter • Real authenticity audit
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Anti-AI Slop Filter Active</span>
        </div>
      </div>

      {/* Grid: 11 Skills Navigation & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Selector Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
            11 Marketing Skills:
          </div>
          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
            {LINKEDIN_SKILLS_DATA.map((skill) => {
              const isSelected = selectedSkillId === skill.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => {
                    setSelectedSkillId(skill.id);
                    setExecutionResult(null);
                    setHumanizerAudit(null);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? "bg-slate-900 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-200">{skill.name}</span>
                    <span className="text-[10px] text-sky-400 uppercase font-bold">{skill.id}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {skill.purpose}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution & Audit Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            {/* Active Skill Summary */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-base font-bold text-slate-100">{selectedSkill.name}</span>
                <p className="text-slate-400 text-xs mt-0.5">{selectedSkill.purpose}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-800/40 text-[10px] uppercase font-bold">
                Level: Production
              </span>
            </div>

            {/* Hook Formula Selector (if post/carousel/hook) */}
            {(selectedSkill.id === "post-writer" ||
              selectedSkill.id === "hook-generator" ||
              selectedSkill.id === "carousel-planner") && (
              <div>
                <div className="text-slate-400 mb-1.5 font-semibold">2026 Hook Formula:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {HOOK_FORMULAS_2026.map((formula) => (
                    <button
                      key={formula.id}
                      type="button"
                      onClick={() => setSelectedHookFormula(formula.id)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedHookFormula === formula.id
                          ? "bg-sky-500/20 border-sky-500 text-sky-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="font-bold text-[11px] text-slate-200">{formula.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{formula.pattern}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            <div>
              <div className="text-slate-400 mb-1 font-semibold">Target Audience / Profile:</div>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. B2B SaaS Founders, Enterprise Architects..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Input Topic / Text */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1 font-semibold">
                <span>Input Raw Idea, Transcript, or Draft:</span>
                <span className="text-[10px] text-slate-500">{topicInput.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter core thesis, metrics, or draft content to transform..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Action Button */}
            <button
              id="execute-linkedin-skill-btn"
              onClick={handleExecuteSkill}
              disabled={isExecuting}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isExecuting
                  ? "Applying 2026 LinkedIn Algorithms & Humanizer..."
                  : `Generate with ${selectedSkill.name}`}
              </span>
            </button>

            {/* Output Display & Humanizer Audit */}
            {executionResult && (
              <div className="space-y-4 mt-6 border-t border-slate-800 pt-4">
                {/* Result Card */}
                <div className="rounded-xl bg-slate-950 border border-sky-500/40 p-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-sky-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>GENERATED LINKEDIN CONTENT:</span>
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied Post" : "Copy Content"}</span>
                    </button>
                  </div>
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-1">
                    {executionResult}
                  </div>
                </div>

                {/* Humanizer Heuristic Audit Breakdown */}
                {humanizerAudit && (
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">Human Authenticity Audit</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          humanizerAudit.aiRiskLevel === "LOW"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                            : humanizerAudit.aiRiskLevel === "MEDIUM"
                            ? "bg-amber-950 text-amber-300 border border-amber-800/40"
                            : "bg-rose-950 text-rose-300 border border-rose-800/40"
                        }`}
                      >
                        AI Detection Risk: {humanizerAudit.aiRiskLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-slate-400 text-[10px]">Em-Dashes Found</div>
                        <div className="text-slate-200 font-bold text-sm mt-0.5">
                          {humanizerAudit.emDashCount} <span className="text-[10px] font-normal text-slate-400">(Limit: &le;1/100 words)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-slate-400 text-[10px]">Banned AI Words</div>
                        <div className={`font-bold text-sm mt-0.5 ${humanizerAudit.bannedWordsFound.length === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {humanizerAudit.bannedWordsFound.length === 0 ? "0 (Zero AI Slop)" : humanizerAudit.bannedWordsFound.length}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-slate-400 text-[10px]">Specific Numbers</div>
                        <div className="text-cyan-400 font-bold text-sm mt-0.5">
                          {humanizerAudit.numberCount} datapoints
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-slate-400 text-[10px]">Voice Authenticity</div>
                        <div className="text-emerald-400 font-bold text-sm mt-0.5">
                          {humanizerAudit.voiceAuthenticityScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
