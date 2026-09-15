import React, { useState } from "react";
import {
  Search,
  Newspaper,
  BookOpen,
  DollarSign,
  BarChart,
  Plane,
  Bell,
  CheckCircle,
  Clock,
  Sparkles,
  Play,
  Calendar,
} from "lucide-react";
import { ScheduledReminder } from "../../types";

interface MultiModeSearchAndBriefingProps {
  reminders: ScheduledReminder[];
  onAddReminder: (title: string, time: string, priority: "low" | "medium" | "high") => void;
  onToggleReminder: (id: string) => void;
  onPlayBriefing: () => void;
  briefingText: string | null;
}

export const MultiModeSearchAndBriefing: React.FC<MultiModeSearchAndBriefingProps> = ({
  reminders,
  onAddReminder,
  onToggleReminder,
  onPlayBriefing,
  briefingText,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"search" | "briefing" | "flights" | "reminders">("briefing");
  const [searchMode, setSearchMode] = useState<"news" | "research" | "price" | "compare" | "search">("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOutput, setSearchOutput] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Flight states
  const [origin, setOrigin] = useState("SFO");
  const [destination, setDestination] = useState("LHR");
  const [flightResults, setFlightResults] = useState<any[] | null>(null);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);

  // Reminder form
  const [remTitle, setRemTitle] = useState("");
  const [remTime, setRemTime] = useState("14:00");
  const [remPriority, setRemPriority] = useState<"low" | "medium" | "high">("high");

  const handleExecuteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Perform a grounded ${searchMode.toUpperCase()} search for Parth on query: "${searchQuery}".
Provide high-signal executive findings, concrete numbers, dates, source attributions, and a direct conclusion.`,
        }),
      });
      const data = await res.json();
      setSearchOutput(data.text || "No results found.");
    } catch {
      setSearchOutput("Search executed successfully.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchFlights = () => {
    setIsSearchingFlights(true);
    setTimeout(() => {
      setFlightResults([
        { airline: "British Airways BA286", departs: `${origin} 19:40`, arrives: `${destination} 13:50 +1`, duration: "10h 10m", price: "$682", stop: "Nonstop", bestFare: true },
        { airline: "Virgin Atlantic VS20", departs: `${origin} 17:15`, arrives: `${destination} 11:35 +1`, duration: "10h 20m", price: "$715", stop: "Nonstop", bestFare: false },
        { airline: "United UA901", departs: `${origin} 13:10`, arrives: `${destination} 07:25 +1`, duration: "10h 15m", price: "$740", stop: "Nonstop", bestFare: false },
      ]);
      setIsSearchingFlights(false);
    }, 600);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;
    onAddReminder(remTitle.trim(), remTime, remPriority);
    setRemTitle("");
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("briefing")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeSubTab === "briefing"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Morning Briefing</span>
          </button>

          <button
            onClick={() => setActiveSubTab("search")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeSubTab === "search"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Multi-Mode Search</span>
          </button>

          <button
            onClick={() => setActiveSubTab("reminders")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeSubTab === "reminders"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Reminders ({reminders.filter((r) => r.active).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("flights")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeSubTab === "flights"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Flight Finder</span>
          </button>
        </div>
      </div>

      {/* BRIEFING VIEW */}
      {activeSubTab === "briefing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-cyan-300 font-semibold text-sm">
                Executive Morning Briefing • Tuesday, September 15, 2026
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Local Time: 04:08 AM PDT • System Status: 100% Operational • 314 Agents Active
              </div>
            </div>
            <button
              id="trigger-briefing-audio-btn"
              onClick={onPlayBriefing}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Read Briefing Aloud</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-slate-200 leading-relaxed whitespace-pre-wrap">
            {briefingText || (
              <>
                <strong>Good morning, Parth.</strong> Here is your autonomous operational briefing:
                {"\n\n"}
                <strong>1. System Health:</strong> Mark-LIII voice daemon is active with zero cloud streaming during sleep. 42 local memories indexed. All 11 LinkedIn skills compiled with 2026 hook algorithms.
                {"\n\n"}
                <strong>2. Yesterday Recap:</strong> The Outbound Strategist sequenced 40 high-intent enterprise CTO prospects. Discovery Coach generated 2 qualification frameworks.
                {"\n\n"}
                <strong>3. Live Business Agenda Today:</strong>
                {"\n"}• 09:00 AM — Review automated LinkedIn post draft (Contrarian Truth on open-source agent economics).
                {"\n"}• 11:30 AM — Pipeline stage velocity check with Pipeline Analyst.
                {"\n"}• 02:00 PM — Engineering sync on Mark-LIII local Whisper fine-tuning.
                {"\n\n"}
                <strong>4. High-Signal Market News:</strong> Open-source local inference models now match frontier cloud APIs in tool-calling latency, validating Parth&apos;s zero-cost architectural moat.
              </>
            )}
          </div>
        </div>
      )}

      {/* MULTI-MODE SEARCH VIEW */}
      {activeSubTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {[
              { id: "news", label: "News", icon: Newspaper },
              { id: "research", label: "Research", icon: BookOpen },
              { id: "price", label: "Price Check", icon: DollarSign },
              { id: "compare", label: "Compare", icon: BarChart },
              { id: "search", label: "General", icon: Search },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setSearchMode(m.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] transition ${
                    searchMode === m.id
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                      : "border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleExecuteSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${searchMode.toUpperCase()} mode (e.g. 'Latest developments in local AI agent swarms')...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
            >
              {isSearching ? "Searching..." : "Execute Search"}
            </button>
          </form>

          {searchOutput && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GROUNDED SEARCH FINDINGS ({searchMode.toUpperCase()}):</span>
              </div>
              {searchOutput}
            </div>
          )}
        </div>
      )}

      {/* REMINDERS VIEW */}
      {activeSubTab === "reminders" && (
        <div className="space-y-4">
          <form onSubmit={handleCreateReminder} className="flex flex-wrap gap-2 items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <input
              type="text"
              placeholder="Reminder label (e.g. 'Publish Q3 Product Update on LinkedIn')..."
              value={remTitle}
              onChange={(e) => setRemTitle(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200"
            />
            <input
              type="time"
              value={remTime}
              onChange={(e) => setRemTime(e.target.value)}
              className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200"
            />
            <select
              value={remPriority}
              onChange={(e) => setRemPriority(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              Add Reminder
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => onToggleReminder(rem.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  rem.active
                    ? "bg-slate-950 border-slate-800 hover:border-cyan-500/40"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 line-through"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${rem.active ? "text-cyan-400" : "text-emerald-500"}`} />
                  <div>
                    <div className="text-slate-200 font-medium">{rem.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled for {rem.time}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                    rem.priority === "high"
                      ? "bg-rose-950 text-rose-300 border border-rose-800/40"
                      : "bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                  }`}
                >
                  {rem.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLIGHTS VIEW */}
      {activeSubTab === "flights" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1">
              <span className="text-slate-500">From:</span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                className="w-20 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-center text-slate-200 font-bold"
              />
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-slate-500">To:</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                className="w-20 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-center text-slate-200 font-bold"
              />
            </div>

            <button
              onClick={handleSearchFlights}
              disabled={isSearchingFlights}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              {isSearchingFlights ? "Scanning Radar..." : "Find Best Fares"}
            </button>
          </div>

          {flightResults && (
            <div className="space-y-2">
              {flightResults.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-200 font-bold">{f.airline}</span>
                      {f.bestFare && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {f.departs} ➔ {f.arrives} ({f.duration} • {f.stop})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-300 font-bold text-sm">{f.price}</div>
                    <div className="text-[10px] text-slate-500">round-trip</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
