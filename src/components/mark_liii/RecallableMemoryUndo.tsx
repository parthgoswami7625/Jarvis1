import React, { useState } from "react";
import {
  Brain,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  Clock,
  History,
  CheckCircle,
  Database,
} from "lucide-react";
import { MemoryRecord, SystemActionRecord } from "../../types";

interface RecallableMemoryUndoProps {
  memories: MemoryRecord[];
  onAddMemory: (category: MemoryRecord["category"], key: string, content: string) => void;
  onDeleteMemory: (id: string) => void;
  undoStack: SystemActionRecord[];
  onUndoAction: (id: string) => void;
}

export const RecallableMemoryUndo: React.FC<RecallableMemoryUndoProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  undoStack,
  onUndoAction,
}) => {
  const [activeTab, setActiveTab] = useState<"memory" | "undo">("memory");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCat, setNewCat] = useState<MemoryRecord["category"]>("directive");

  const filteredMemories = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;
    onAddMemory(newCat, newKey.trim(), newContent.trim());
    setNewKey("");
    setNewContent("");
    setIsAdding(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs">
      {/* Header with Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <button
            id="tab-memory-btn"
            onClick={() => setActiveTab("memory")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "memory"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Recallable Local Memory ({memories.length})</span>
          </button>

          <button
            id="tab-undo-btn"
            onClick={() => setActiveTab("undo")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "undo"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Reversible Undo Stack ({undoStack.filter((a) => !a.undone).length})</span>
          </button>
        </div>

        {activeTab === "memory" && (
          <button
            id="add-memory-btn"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Store Context</span>
          </button>
        )}
      </div>

      {/* MEMORY VIEW */}
      {activeTab === "memory" && (
        <div>
          {/* Add form */}
          {isAdding && (
            <form onSubmit={handleSaveMemory} className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
              <div className="flex gap-2">
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-xs"
                >
                  <option value="directive">Directive</option>
                  <option value="preference">Preference</option>
                  <option value="contact">Contact</option>
                  <option value="context">Context</option>
                </select>
                <input
                  type="text"
                  placeholder="Key name (e.g. 'Target ICP Criteria')"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-xs"
                />
              </div>
              <textarea
                placeholder="Persistent memory content without token limits..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-500 text-slate-950 font-semibold rounded"
                >
                  Save to Local Memory
                </button>
              </div>
            </form>
          )}

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search unlimited recallable local memory..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Memory grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {mem.category}
                    </span>
                    <span className="font-semibold text-slate-200">{mem.key}</span>
                  </div>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{mem.content}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600">
                  <span>{new Date(mem.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="text-emerald-500 flex items-center gap-0.5">
                    <Database className="w-2.5 h-2.5" /> Local Vector Indexed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UNDO STACK VIEW */}
      {activeTab === "undo" && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {undoStack.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              No actions in history. Any file moves, renames, writes, volume or brightness changes will appear here for reverse execution.
            </div>
          ) : (
            undoStack.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                  item.undone
                    ? "bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60"
                    : "bg-slate-950/80 border-amber-500/30 text-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold uppercase text-[10px]">
                      {item.actionType.replace("_", " ")}
                    </span>
                    <span className="text-slate-300 font-medium">{item.description}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Prev: {String(item.previousValue)} ➔ Current: {String(item.currentValue)}
                  </div>
                </div>

                <div>
                  {item.undone ? (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5" /> Reversed
                    </span>
                  ) : (
                    <button
                      onClick={() => onUndoAction(item.id)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
