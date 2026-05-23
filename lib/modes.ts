import type { ModeDefinition } from "@/lib/types";

export const modes: ModeDefinition[] = [
  {
    id: "hellcat_demon",
    label: "Hellcat / Demon Mode",
    shortLabel: "Hellcat",
    description: "Rental flex, gas light truth, repo risk, and fading stare intensity.",
    accent: "hazard",
    sample: "Pulled up in a Hellcat with 707 hp and $14 in gas.",
    stats: [
      { label: "Demon Mode", value: "ON", tone: "danger" },
      { label: "Gas Money", value: "CRITICAL", tone: "danger" },
      { label: "Repo Risk", value: "RISING", tone: "caution" },
      { label: "Stare Factor", value: "UNSTABLE", tone: "caution" }
    ],
    sceneBeats: ["arrival", "dashboard warning", "friend pressure", "humble invoice"],
    safetyNote: "No real crime. Just gas-light consequences."
  },
  {
    id: "fake_plug",
    label: "Fake Plug / Crazy Story Mode",
    shortLabel: "Fake Plug",
    description: "Suspicious snack economy, fake exotic claims, and cheap-store evidence.",
    accent: "volt",
    sample: "Bro said he had exotic but pulled out barbecue chips.",
    stats: [
      { label: "Plug Reliability", value: "12%", tone: "danger" },
      { label: "Authenticity", value: "QUESTIONABLE", tone: "caution" },
      { label: "Gas Station Energy", value: "MAXIMUM", tone: "neutral" },
      { label: "Scam Probability", value: "94%", tone: "danger" }
    ],
    sceneBeats: ["mystery offer", "bag inspection", "receipt evidence", "food punchline"],
    safetyNote: "Fake snacks only. No real drug dealing."
  },
  {
    id: "friend_weird",
    label: "Friend Moving Weird / Loyalty Test",
    shortLabel: "Moving Weird",
    description: "Location lies, fake outside texts, food posts, and group-chat court.",
    accent: "petrol",
    sample: "He said he was five minutes away for two hours.",
    stats: [
      { label: "Trust", value: "LOW", tone: "danger" },
      { label: "Location", value: "SUSPICIOUS", tone: "caution" },
      { label: "Excuse Count", value: "7", tone: "neutral" },
      { label: "Group Chat Heat", value: "RISING", tone: "caution" }
    ],
    sceneBeats: ["promise text", "location mismatch", "story post reveal", "group-chat verdict"],
    safetyNote: "Roasts and receipts, not threats."
  },
  {
    id: "rental_flex",
    label: "Rental Car Flex",
    shortLabel: "Rental Flex",
    description: "Posting like ownership, app notifications, family calls, and exposure.",
    accent: "chrome",
    sample: "I posted the Hellcat like it was mine and the rental app snitched.",
    stats: [
      { label: "Ownership Claim", value: "UNVERIFIED", tone: "caution" },
      { label: "Rental Timer", value: "02:14:09", tone: "danger" },
      { label: "Enterprise Call", value: "MISSED", tone: "caution" },
      { label: "Exposure Risk", value: "HIGH", tone: "danger" }
    ],
    sceneBeats: ["photo shoot", "caption lie", "notification leak", "family call"],
    safetyNote: "Flex gets exposed before it gets glorified."
  },
  {
    id: "court_panic",
    label: "Court Date Panic",
    shortLabel: "Court Panic",
    description: "False confidence, calendar betrayal, late wakeups, and legal heat.",
    accent: "hazard",
    sample: "I forgot I had court and woke up posting motivational quotes.",
    stats: [
      { label: "Legal Heat", value: "63", tone: "caution" },
      { label: "Alarm Status", value: "DEFEATED", tone: "danger" },
      { label: "Court Time", value: "MISSED", tone: "danger" },
      { label: "Panic", value: "ACTIVE", tone: "caution" }
    ],
    sceneBeats: ["confident morning", "calendar reveal", "time disaster", "panic ending"],
    safetyNote: "Consequence comedy, no evasion tips."
  }
];

export function getMode(id: string): ModeDefinition {
  return modes.find((mode) => mode.id === id) ?? modes[0];
}
