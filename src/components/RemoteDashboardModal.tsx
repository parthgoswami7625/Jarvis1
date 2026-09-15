import React, { useState } from "react";
import { Smartphone, QrCode, X, CheckCircle, Wifi, Shield, RefreshCw } from "lucide-react";

interface RemoteDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RemoteDashboardModal: React.FC<RemoteDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pairingCode] = useState("PARTH-773-LIII");
  const [isPaired, setIsPaired] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200 text-sm">
              Mark-LIII Remote Mobile HUD
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-slate-400 text-xs">
            Scan this QR code from your phone or mobile browser to control Mark-LIII JARVIS hands-free via local WebSocket.
          </p>

          {/* QR Code Frame */}
          <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-2 text-center text-[10px] text-cyan-400 font-mono space-y-1">
              <QrCode className="w-16 h-16 text-cyan-400 animate-pulse" />
              <span className="font-bold">PARTH-REMOTE-PAIR</span>
              <span className="text-slate-400 text-[9px]">ws://192.168.1.144:3000</span>
            </div>
          </div>

          {/* Pairing Code info */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">One-Time Pairing Passcode:</div>
            <div className="text-lg font-bold tracking-widest text-cyan-300 mt-0.5">
              {pairingCode}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-emerald-400 text-[11px]">
            <CheckCircle className="w-4 h-4" />
            <span>End-to-End Encrypted over Local LAN</span>
          </div>

          <button
            onClick={() => {
              setIsPaired(true);
              setTimeout(() => onClose(), 1200);
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
          >
            {isPaired ? "Mobile Device Connected!" : "Simulate Phone Connected"}
          </button>
        </div>
      </div>
    </div>
  );
};
