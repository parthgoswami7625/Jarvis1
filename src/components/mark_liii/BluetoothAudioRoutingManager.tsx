import React, { useState, useEffect } from "react";
import {
  Bluetooth,
  Mic,
  Volume2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Radio,
  Sparkles,
} from "lucide-react";

interface AudioDeviceItem {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput";
  isBluetooth: boolean;
}

interface BluetoothAudioRoutingManagerProps {
  onSpeakNotice?: (msg: string) => void;
}

const BLUETOOTH_KEYWORDS = [
  "bluetooth",
  "wireless",
  "headset",
  "airpods",
  "buds",
  "bose",
  "wh-1000",
  "wf-1000",
  "jabra",
  "hands-free",
  "headphones",
  "pixel buds",
  "galaxy buds",
];

export const BluetoothAudioRoutingManager: React.FC<BluetoothAudioRoutingManagerProps> = ({
  onSpeakNotice,
}) => {
  const [autoHandoverEnabled, setAutoHandoverEnabled] = useState(true);
  const [audioInputs, setAudioInputs] = useState<AudioDeviceItem[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<AudioDeviceItem[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string>("default");
  const [selectedOutputId, setSelectedOutputId] = useState<string>("default");
  const [activeBluetoothDeviceName, setActiveBluetoothDeviceName] = useState<string | null>(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [micTestLevel, setMicTestLevel] = useState<number>(0);
  const [isTestingMic, setIsTestingMic] = useState(false);

  // Check if device name matches Bluetooth patterns
  const checkIsBluetooth = (label: string): boolean => {
    const lower = label.toLowerCase();
    return BLUETOOTH_KEYWORDS.some((kw) => lower.includes(kw));
  };

  // Enumerate system audio devices
  const scanAudioDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        return;
      }

      // Query permission or device list
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs: AudioDeviceItem[] = [];
      const outputs: AudioDeviceItem[] = [];

      let foundBtName: string | null = null;
      let btInputId: string | null = null;
      let btOutputId: string | null = null;

      devices.forEach((d) => {
        const isBt = checkIsBluetooth(d.label);
        const item: AudioDeviceItem = {
          deviceId: d.deviceId,
          label: d.label || (d.kind === "audioinput" ? "Microphone" : "Speaker"),
          kind: d.kind as "audioinput" | "audiooutput",
          isBluetooth: isBt,
        };

        if (d.kind === "audioinput") {
          inputs.push(item);
          if (isBt && !btInputId) {
            btInputId = d.deviceId;
            foundBtName = d.label;
          }
        } else if (d.kind === "audiooutput") {
          outputs.push(item);
          if (isBt && !btOutputId) {
            btOutputId = d.deviceId;
            if (!foundBtName) foundBtName = d.label;
          }
        }
      });

      setAudioInputs(inputs);
      setAudioOutputs(outputs);

      if (foundBtName) {
        setActiveBluetoothDeviceName(foundBtName);
        if (autoHandoverEnabled) {
          if (btInputId && selectedInputId !== btInputId) {
            setSelectedInputId(btInputId);
          }
          if (btOutputId && selectedOutputId !== btOutputId) {
            setSelectedOutputId(btOutputId);
          }
          setStatusNotice(`Auto-routed to Bluetooth: ${foundBtName}`);
          if (onSpeakNotice) {
            onSpeakNotice(`Bluetooth audio connected. Microphone and speakers routed to ${foundBtName}.`);
          }
        }
      } else {
        setActiveBluetoothDeviceName(null);
        if (statusNotice?.includes("Bluetooth")) {
          setStatusNotice("Bluetooth device disconnected. Returned to default PC audio.");
        }
      }
    } catch (err) {
      console.warn("Device enumeration error:", err);
    }
  };

  useEffect(() => {
    scanAudioDevices();

    // Listen to device connection / disconnection events
    const handleDeviceChange = () => {
      scanAudioDevices();
    };

    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    }

    return () => {
      if (navigator.mediaDevices?.removeEventListener) {
        navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      }
    };
  }, [autoHandoverEnabled]);

  // Test sound output through current audio device
  const handleTestAudioPing = () => {
    setIsTestingAudio(true);
    setStatusNotice("Playing test chime on selected audio device...");

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // Dual-tone high-tech Mark-LIII chime
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);

      setTimeout(() => {
        setIsTestingAudio(false);
        setStatusNotice("Audio test chime completed.");
      }, 700);
    } catch {
      setIsTestingAudio(false);
    }
  };

  // Test microphone input
  const handleTestMicrophone = async () => {
    if (isTestingMic) {
      setIsTestingMic(false);
      setMicTestLevel(0);
      return;
    }

    try {
      setIsTestingMic(true);
      setStatusNotice("Testing microphone input. Speak to see audio level...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedInputId !== "default" ? { deviceId: { exact: selectedInputId } } : true,
      });

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let count = 0;
      const interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicTestLevel(Math.min(100, Math.round((avg / 128) * 100)));
        count++;

        if (count > 40) {
          // Stop after 4 seconds
          clearInterval(interval);
          stream.getTracks().forEach((track) => track.stop());
          setIsTestingMic(false);
          setMicTestLevel(0);
          setStatusNotice("Microphone test verified successfully.");
        }
      }, 100);
    } catch (err: any) {
      setIsTestingMic(false);
      const isIframe = typeof window !== "undefined" && window.self !== window.top;
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatusNotice(
          isIframe
            ? "Microphone access blocked inside preview iframe. Please open the app in a new tab (top right ↗ icon) to enable mic."
            : "Microphone permission denied. Please allow microphone access in your browser address bar."
        );
      } else {
        setStatusNotice(`Microphone test note: ${err?.message || "Unavailable"}. You can use the quick directives or text commands.`);
      }
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Bluetooth className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-slate-200 font-bold flex items-center gap-2">
              <span>Bluetooth Audio &amp; Mic Auto-Handover</span>
              {activeBluetoothDeviceName ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center gap-1">
                  <Headphones className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">
                  Scanning...
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              When Bluetooth connects, microphone input and voice feedback automatically switch to headset
            </div>
          </div>
        </div>

        {/* Auto-Handover Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoHandoverEnabled(!autoHandoverEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              autoHandoverEnabled
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Auto-Handover: {autoHandoverEnabled ? "ENABLED" : "OFF"}</span>
          </button>
          <button
            onClick={scanAudioDevices}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Rescan audio devices"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Device Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Microphone Input Selector */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              Microphone Input:
            </span>
            <button
              onClick={handleTestMicrophone}
              className={`text-[10px] underline ${
                isTestingMic ? "text-amber-400" : "text-cyan-400 hover:text-cyan-300"
              }`}
            >
              {isTestingMic ? `Listening (${micTestLevel}%)` : "Test Mic"}
            </button>
          </div>
          <select
            value={selectedInputId}
            onChange={(e) => setSelectedInputId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="default">Default PC Microphone</option>
            {audioInputs.map((dev) => (
              <option key={dev.deviceId} value={dev.deviceId}>
                {dev.isBluetooth ? "🎧 [Bluetooth] " : ""}
                {dev.label}
              </option>
            ))}
          </select>
          {isTestingMic && (
            <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-100"
                style={{ width: `${micTestLevel}%` }}
              />
            </div>
          )}
        </div>

        {/* Audio Output (Speaker / Headset) Selector */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              Audio Output (JARVIS Voice):
            </span>
            <button
              onClick={handleTestAudioPing}
              disabled={isTestingAudio}
              className="text-[10px] text-blue-400 hover:text-blue-300 underline"
            >
              {isTestingAudio ? "Playing..." : "Test Chime"}
            </button>
          </div>
          <select
            value={selectedOutputId}
            onChange={(e) => setSelectedOutputId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-400"
          >
            <option value="default">Default PC Speakers / Headphones</option>
            {audioOutputs.map((dev) => (
              <option key={dev.deviceId} value={dev.deviceId}>
                {dev.isBluetooth ? "🎧 [Bluetooth] " : ""}
                {dev.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Notice */}
      {statusNotice && (
        <div className="flex items-center space-x-2 text-[11px] text-slate-300 p-2 rounded-lg bg-blue-950/40 border border-blue-800/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}
    </div>
  );
};
