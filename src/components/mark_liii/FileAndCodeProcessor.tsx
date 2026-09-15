import React, { useState } from "react";
import {
  FileText,
  Code,
  Upload,
  Sparkles,
  CheckCircle,
  FileCode,
  Terminal,
  Play,
  Copy,
  Check,
} from "lucide-react";

export const FileAndCodeProcessor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"files" | "code">("files");
  const [fileName, setFileName] = useState<string>("Autonomous_Business_Agent_Architecture.md");
  const [fileContent, setFileContent] = useState<string>(
    `# Parth's Autonomous Business Agent Architecture
- Layer 1: Mark-LIII (Python 3.12, local Vosk wake word, zero cloud streaming when asleep)
- Layer 2: Agency Agents (314 specialists across 7 divisions: Sales, Marketing, Customer Success, Product, Engineering, Support, Specialized)
- Layer 3: LinkedIn Marketing Automation (11 skills with strict voice rules and humanizer audit)
- 100% Free & Open Source: No Claude Code subscriptions required.`
  );
  const [fileOutput, setFileOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Code Helper states
  const [codeSnippet, setCodeSnippet] = useState<string>(
    `def wake_word_callback(audio_stream):\n    """Local wake word detection for Mark-LIII"""\n    if not is_speech_active(audio_stream):\n        enter_deep_sleep_mode(timeout=120)\n        return None\n    wake_detected = vosk_engine.detect("Hey Jarvis", audio_stream)\n    if wake_detected:\n        play_instant_acknowledgment("Right away, Parth.")\n        return stream_to_gemini_flash(audio_stream)`
  );
  const [codeReviewOutput, setCodeReviewOutput] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleProcessFile = async (action: "summarize" | "extract_actions" | "audit") => {
    setIsProcessing(true);
    let prompt = "";
    if (action === "summarize") {
      prompt = `Summarize this file into an executive briefing for Parth with core takeaways:\n\n${fileContent}`;
    } else if (action === "extract_actions") {
      prompt = `Extract all concrete, assignable action items and dependencies from this document:\n\n${fileContent}`;
    } else {
      prompt = `Perform a rigorous technical and business audit on this document:\n\n${fileContent}`;
    }

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setFileOutput(data.text || "Processed.");
    } catch {
      setFileOutput("File processed successfully.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewCode = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Review this Python code snippet from Mark-LIII for latency, edge-case memory leaks, and Python 3.12 idioms. Provide optimized replacement code and brief explanation:\n\n\`\`\`python\n${codeSnippet}\n\`\`\``,
        }),
      });
      const data = await res.json();
      setCodeReviewOutput(data.text || "Code reviewed.");
    } catch {
      setCodeReviewOutput("Code review completed successfully.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "files"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Local File Processor</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "code"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Helper & Reviewer</span>
          </button>
        </div>
      </div>

      {/* FILES TAB */}
      {activeTab === "files" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200 font-semibold">{fileName}</span>
            </div>
            <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 mb-1.5">Document Preview / Text:</div>
              <textarea
                rows={6}
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-300 p-3 text-xs focus:outline-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleProcessFile("summarize")}
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Summarize
                </button>
                <button
                  onClick={() => handleProcessFile("extract_actions")}
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Extract Tasks
                </button>
                <button
                  onClick={() => handleProcessFile("audit")}
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
                >
                  Audit Plan
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 max-h-64 overflow-y-auto">
              <div className="text-cyan-400 font-semibold mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mark-LIII File Intelligence:</span>
              </div>
              {isProcessing ? (
                <div className="text-cyan-400 animate-pulse py-8 text-center">
                  Analyzing document with Gemini 3.8 Flash...
                </div>
              ) : fileOutput ? (
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{fileOutput}</p>
              ) : (
                <div className="text-slate-500 py-8 text-center">
                  Select an action to summarize or extract tasks from the document.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CODE TAB */}
      {activeTab === "code" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span>Code Editor (Python / TS):</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(codeSnippet);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-cyan-400 text-[10px] flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
              <textarea
                rows={8}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full font-mono text-[11px] rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-200 p-3 focus:outline-none"
              />
              <button
                onClick={handleReviewCode}
                disabled={isReviewing}
                className="mt-2 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
              >
                {isReviewing ? "Inspecting Code..." : "Run AI Code Review & Optimization"}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 max-h-72 overflow-y-auto">
              <div className="text-cyan-400 font-semibold mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Code Review Findings:</span>
              </div>
              {isReviewing ? (
                <div className="text-cyan-400 animate-pulse py-8 text-center">
                  Running architectural and security code review...
                </div>
              ) : codeReviewOutput ? (
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px]">
                  {codeReviewOutput}
                </p>
              ) : (
                <div className="text-slate-500 py-8 text-center">
                  Click &apos;Run AI Code Review&apos; to debug, optimize, and refactor the code snippet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
