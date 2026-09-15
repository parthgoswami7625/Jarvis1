export type HUDTheme = "arc-blue" | "emerald-matrix" | "crimson-protocol" | "amber-titan" | "violet-synth" | "cyan-jarvis";

export type MarkLIIIVoice = "Zephyr" | "Kore" | "Puck" | "Charon" | "Fenrir";

export type VoiceState = "idle" | "listening" | "processing" | "speaking" | "sleeping";

export type ActiveLayer = "mark_liii" | "agency_agents" | "linkedin_skills" | "sales_workflow";

export interface TelemetryLog {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "VOICE" | "AGENT" | "ERROR";
  source: string;
  message: string;
}

export interface LinkedInHumanizerResult {
  wordCount: number;
  charCount: number;
  emDashCount: number;
  emDashPer100: number;
  bannedWordsFound: string[];
  numberCount: number;
  voiceAuthenticityScore: number;
  aiRiskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface SystemActionRecord {
  id: string;
  timestamp: string | number;
  actionType: "file_write" | "file_rename" | "file_move" | "volume_change" | "brightness_change" | "clipboard_edit";
  description: string;
  previousValue: any;
  currentValue: any;
  undone: boolean;
}

export interface MemoryRecord {
  id: string;
  timestamp: string | number;
  key: string;
  category: "preference" | "contact" | "directive" | "credential" | "context";
  content: string;
}

export interface ScheduledReminder {
  id: string;
  title: string;
  time: string;
  priority: "low" | "medium" | "high";
  active: boolean;
}

export interface AgencyAgent {
  id: string;
  name: string;
  division: "Sales" | "Marketing" | "Customer Success" | "Product" | "Engineering" | "Support" | "Specialized";
  role: string;
  description: string;
  keyCapabilities: string[];
  sampleTask: string;
  systemPrompt: string;
  avatarIcon: string;
  toolIntegrations: string[];
}

export interface LinkedInSkill {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  targetChars?: { min: number; max: number };
  sampleInput: string;
  voiceRules: string[];
}

export interface LinkedInAuditResult {
  wordCount: number;
  charCount: number;
  emDashCount: number;
  emDashPer100: number;
  bannedWordsFound: string[];
  numbersFound: number;
  humanScore: number;
  aiRiskLevel: string;
}

export interface OrchestrationStep {
  stepNumber: number;
  agentOrSkill: string;
  actionDescription: string;
  status: "pending" | "running" | "completed" | "failed";
  output?: string;
  timeMs?: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "VOICE" | "AGENT";
  source: "Mark-LIII" | "Agency-Agents" | "LinkedIn-Skills" | "Daemon";
  message: string;
}
