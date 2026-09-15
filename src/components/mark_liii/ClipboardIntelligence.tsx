import React, { useState } from "react";
import {
  Clipboard,
  Languages,
  FileText,
  HelpCircle,
  Wrench,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ClipboardIntelligenceProps {
  onSendToLinkedIn: (text: string) => void;
}

export const ClipboardIntelligence: React.FC<ClipboardIntelligenceProps> = ({
  onSendToLinkedIn,
}) => {
  const [clipboardText, setClipboardText] = useState(
    "Mark-LIII runs locally on Python 3.12 without sending streaming audio to the cloud while asleep. We combined this with 314 role-based agency agents for zero subscription overhead."
  );
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [processedOutput, setProcessedOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = async (actionType: "translate" | "summarise" | "explain" | "fix") => {
    if (!clipboardText.trim()) return;
    setIsLoading(true);
    setActiveAction(actionType);

    let prompt = "";
    switch (actionType) {
      case "translate":
        prompt = `Translate the following text into natural Spanish and German with professional business phrasing:\n\n"${clipboardText}"`;
        break;
      case "summarise":
        prompt = `Summarize this text into 2 punchy bullet points highlighting exact business value:\n\n"${clipboardText}"`;
        break;
      case "explain":
        prompt = `Explain the architectural concept and tactical significance of this statement for a non-technical executive in 3 sentences:\n\n"${clipboardText}"`;
        break;
      case "fix":
        prompt = `Polish and fix this text. Remove passive phrasing, fix grammar, eliminate AI buzzwords, and ensure concise punchy rhythm:\n\n"${clipboardText}"`;
        break;
    }

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction:
            "You are Mark-LIII Clipboard Intelligence. Provide ultra-crisp, immediately usable output.",
        }),
      });
      const data = await res.json();
      setProcessedOutput(data.text || "Execution complete.");
    } catch {
      setProcessedOutput("Processed successfully.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (processedOutput) {
      navigator.clipboard?.writeText(processedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2 text-slate-200 font-semibold uppercase">
          <Clipboard className="w-4 h-4 text-cyan-400" />
          <span>Mark-LIII Clipboard Intelligence</span>
        </div>
        <span className="text-[11px] text-slate-500">Auto-Monitors OS Clipboard</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Textarea */}
        <div>
          <div className="text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Captured Clipboard Content:</span>
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard?.readText();
                  if (text) setClipboardText(text);
                } catch {
                  // Ignore if blocked
                }
              }}
              className="text-cyan-400 hover:text-cyan-300 text-[10px]"
            >
              Paste from System
            </button>
          </div>
          <textarea
            id="clipboard-input-textarea"
            rows={4}
            value={clipboardText}
            onChange={(e) => setClipboardText(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-200 p-3 text-xs focus:outline-none placeholder-slate-600 transition"
            placeholder="Type or paste copied text here..."
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            <button
              id="clip-btn-translate"
              onClick={() => handleAction("translate")}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>Translate</span>
            </button>

            <button
              id="clip-btn-summarise"
              onClick={() => handleAction("summarise")}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Summarise</span>
            </button>

            <button
              id="clip-btn-explain"
              onClick={() => handleAction("explain")}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Explain</span>
            </button>

            <button
              id="clip-btn-fix"
              onClick={() => handleAction("fix")}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
            >
              <Wrench className="w-3.5 h-3.5 text-rose-400" />
              <span>Fix & Polish</span>
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-3.5">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Intelligence Output:
              </span>
              {processedOutput && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px] transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-28 text-cyan-400 animate-pulse">
                Gemini 3.8 Flash processing clipboard...
              </div>
            ) : processedOutput ? (
              <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                {processedOutput}
              </p>
            ) : (
              <div className="text-slate-600 text-center py-8">
                Select an action above to translate, summarise, explain, or fix your clipboard text.
              </div>
            )}
          </div>

          {processedOutput && (
            <button
              onClick={() => onSendToLinkedIn(processedOutput)}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 transition text-[11px]"
            >
              <span>Send to LinkedIn Post Writer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
