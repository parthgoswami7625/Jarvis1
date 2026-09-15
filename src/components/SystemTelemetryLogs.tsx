import React, { useState } from "react";
import { Terminal, ChevronUp, ChevronDown, Trash2, Shield, Radio } from "lucide-react";
import { TelemetryLog } from "../types";

interface SystemTelemetryLogsProps {
  logs: TelemetryLog[];
  onClearLogs: () => void;
}

export const SystemTelemetryLogs: React.FC<SystemTelemetryLogsProps> = ({
  logs,
  onClearLogs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs overflow-hidden">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3.5 bg-slate-950/80 hover:bg-slate-950 cursor-pointer border-b border-slate-800/80 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              System Telemetry &amp; Daemon Logs
            </span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">
            {logs.length} events logged • Zero Cloud Sleep Active
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearLogs();
            }}
            className="p-1 text-slate-500 hover:text-rose-400 transition"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Logs container */}
      {isExpanded && (
        <div className="p-3 bg-slate-950 max-h-48 overflow-y-auto space-y-1.5 text-[11px]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2">
              <span className="text-slate-500">{log.timestamp}</span>
              <span
                className={`px-1 rounded text-[9px] uppercase font-bold ${
                  log.level === "ERROR"
                    ? "bg-rose-950 text-rose-300"
                    : log.level === "SUCCESS"
                    ? "bg-emerald-950 text-emerald-300"
                    : log.level === "VOICE"
                    ? "bg-cyan-950 text-cyan-300"
                    : log.level === "AGENT"
                    ? "bg-indigo-950 text-indigo-300"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {log.source}
              </span>
              <span
                className={
                  log.level === "ERROR"
                    ? "text-rose-400"
                    : log.level === "SUCCESS"
                    ? "text-emerald-300"
                    : log.level === "VOICE"
                    ? "text-cyan-200"
                    : "text-slate-300"
                }
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
