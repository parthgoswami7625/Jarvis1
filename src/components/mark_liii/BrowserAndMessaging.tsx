import React, { useState } from "react";
import {
  Globe,
  Youtube,
  Send,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  CheckCircle,
  Smartphone,
} from "lucide-react";

export const BrowserAndMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"browser" | "messages" | "youtube">("browser");

  // Browser state
  const [currentUrl, setCurrentUrl] = useState("https://agencyagents.dev");
  const [browserTabs, setBrowserTabs] = useState([
    { id: 1, title: "Agency Agents - 300+ AI Specialists", url: "https://agencyagents.dev" },
    { id: 2, title: "LinkedIn Analytics", url: "https://linkedin.com/feed" },
    { id: 3, title: "GitHub - Mark-LIII", url: "https://github.com/FatihMakes/Mark-LIII" },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);

  // Messaging state
  const [msgPlatform, setMsgPlatform] = useState<"whatsapp" | "telegram">("whatsapp");
  const [recipient, setRecipient] = useState("+1 555 019 2834");
  const [messageBody, setMessageBody] = useState(
    "Hi Parth, the autonomous morning pipeline executed. LinkedIn post draft ready for review with 95% human score."
  );
  const [msgSentStatus, setMsgSentStatus] = useState<string | null>(null);

  // YouTube state
  const [ytQuery, setYtQuery] = useState("Autonomous AI agents local setup tutorial");
  const [isPlayingYt, setIsPlayingYt] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSentStatus(
      `Mark-LIII Voice: Dispatched via ${msgPlatform.toUpperCase()} to ${recipient}. Payload delivered.`
    );
    setTimeout(() => setMsgSentStatus(null), 4000);
  };

  const handleLaunchBrowser = (e: React.FormEvent) => {
    e.preventDefault();
    const newTab = {
      id: Date.now(),
      title: currentUrl.replace(/^https?:\/\//, ""),
      url: currentUrl,
    };
    setBrowserTabs([...browserTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("browser")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "browser"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Voice Browser Control</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "messages"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message (WhatsApp/Telegram)</span>
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "youtube"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Control</span>
          </button>
        </div>
      </div>

      {/* BROWSER TAB */}
      {activeTab === "browser" && (
        <div className="space-y-3">
          {/* Tab bar */}
          <div className="flex space-x-1 border-b border-slate-800 pb-2">
            {browserTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setCurrentUrl(tab.url);
                }}
                className={`px-3 py-1 rounded-t-lg text-[11px] truncate max-w-xs transition ${
                  activeTabId === tab.id
                    ? "bg-slate-950 text-cyan-300 border-t border-x border-slate-700"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Address bar */}
          <form onSubmit={handleLaunchBrowser} className="flex gap-2">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition"
            >
              Navigate
            </button>
          </form>

          {/* Browser viewport simulation */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 min-h-[160px] flex flex-col items-center justify-center text-center">
            <Globe className="w-8 h-8 text-cyan-500 mb-2 opacity-80" />
            <div className="text-slate-200 font-semibold text-sm">
              Navigated to: {currentUrl}
            </div>
            <div className="text-slate-400 text-[11px] mt-1">
              Mark-LIII Voice Browser Daemon: DOM elements active. Voice commands ready for page interaction.
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <form onSubmit={handleSendMessage} className="space-y-4 max-w-xl">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMsgPlatform("whatsapp")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl border transition ${
                msgPlatform === "whatsapp"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "border-slate-800 text-slate-400"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Integration</span>
            </button>

            <button
              type="button"
              onClick={() => setMsgPlatform("telegram")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl border transition ${
                msgPlatform === "telegram"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "border-slate-800 text-slate-400"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Telegram Bot Dispatch</span>
            </button>
          </div>

          <div>
            <div className="text-slate-400 mb-1">Recipient (Phone or @handle):</div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="text-slate-400 mb-1">Message Content:</div>
            <textarea
              rows={3}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
          >
            Dispatch Voice Message
          </button>

          {msgSentStatus && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{msgSentStatus}</span>
            </div>
          )}
        </form>
      )}

      {/* YOUTUBE TAB */}
      {activeTab === "youtube" && (
        <div className="space-y-4 max-w-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={ytQuery}
              onChange={(e) => setYtQuery(e.target.value)}
              placeholder="Search YouTube by voice..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => setIsPlayingYt(!isPlayingYt)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition"
            >
              {isPlayingYt ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingYt ? "Pause" : "Play"}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-400">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-200 font-bold">Now Queued: {ytQuery}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Voice playback controls: &quot;Hey Jarvis, pause YouTube&quot; / &quot;Hey Jarvis, skip 30s&quot;
                </div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPlayingYt ? "bg-emerald-950 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
              {isPlayingYt ? "PLAYING" : "PAUSED"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
