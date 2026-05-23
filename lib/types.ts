export type ModeId =
  | "hellcat_demon"
  | "fake_plug"
  | "friend_weird"
  | "rental_flex"
  | "court_panic";

export type EndingStyle =
  | "humiliating"
  | "broke"
  | "exposed"
  | "mechanical_failure"
  | "legal_panic"
  | "group_chat_roast"
  | "crazy_story_twist";

export type FormatType =
  | "tiktok_skit"
  | "case_file"
  | "caption_pack"
  | "narrator_script"
  | "reels_caption"
  | "shorts_script";

export type RewriteAction = "pass_through" | "rewritten" | "blocked";

export type StatTone = "danger" | "caution" | "neutral" | "good";

export interface DashboardStat {
  label: string;
  value: string;
  tone: StatTone;
}

export interface SkitScene {
  id: string;
  order: number;
  caption: string;
  line: string;
  overlay?: string;
}

export interface SafetyResult {
  action?: RewriteAction;
  status: RewriteAction;
  original: string;
  rewritten: string;
  reason: string;
  flags: string[];
}

export interface GenerateRequest {
  scenario: string;
  mode: ModeId;
  theme?: ModeId;
  chaosLevel: number;
  endingStyle: EndingStyle;
  format: FormatType;
  carType?: string;
  friendType?: string;
}

export interface SkitProject {
  id: string;
  title: string;
  mode: ModeId;
  theme: ModeId;
  modeLabel: string;
  scenarioInput: string;
  safeScenario: string;
  hook: string;
  dashboard: DashboardStat[];
  scenes: SkitScene[];
  ending: string;
  narrator: string;
  narrator_script: string;
  safety: SafetyResult;
  safety_rewrites: SafetyResult;
  format: FormatType;
  chaosLevel: number;
  endingStyle: EndingStyle;
  createdAt: string;
  updatedAt: string;
}

export interface ModeDefinition {
  id: ModeId;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  sample: string;
  stats: DashboardStat[];
  sceneBeats: string[];
  safetyNote: string;
}
