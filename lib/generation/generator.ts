import { getMode } from "@/lib/modes";
import { evaluateSafety } from "@/lib/safety/rewrite";
import type { DashboardStat, EndingStyle, GenerateRequest, SkitProject, SkitScene } from "@/lib/types";

const endingLines: Record<EndingStyle, string[]> = {
  humiliating: [
    "The stare was cinematic. The receipt was louder.",
    "He entered like a legend and left explaining himself."
  ],
  broke: [
    "The Hellcat was loud. The pockets were quiet. Crazy Story.",
    "The budget tapped out before Demon Mode did."
  ],
  exposed: [
    "The caption said owned. The notification said rented.",
    "The group chat got the evidence before he got the gas."
  ],
  mechanical_failure: [
    "The car had a demon. So did the invoice.",
    "Sport mode started it. The check-engine light finished it."
  ],
  legal_panic: [
    "He beat the alarm clock, not the case.",
    "The confidence was early. The court appearance was not."
  ],
  group_chat_roast: [
    "The story ended in the group chat with screenshots.",
    "Everybody moved weird except the receipts."
  ],
  crazy_story_twist: [
    "The twist was simple: reality had better timing.",
    "Crazy Story, but the villain was the gas light."
  ]
};

const modeHooks: Record<string, string> = {
  hellcat_demon: "It started with the engine growling and the dashboard telling the truth.",
  fake_plug: "He said it was exotic, but the evidence had a gas station barcode.",
  friend_weird: "He said five minutes, but the timeline started moving suspicious.",
  rental_flex: "The post looked expensive until the rental notification joined the story.",
  court_panic: "He woke up fearless, then the calendar started snitching."
};

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function seedFrom(input: string): number {
  return input.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function normalizeScenario(input: string): string {
  const cleaned = input.replace(/\s+/g, " ").trim();
  return cleaned.endsWith(".") ? cleaned.slice(0, -1) : cleaned;
}

function makeDashboard(base: DashboardStat[], chaosLevel: number): DashboardStat[] {
  return [
    ...base,
    { label: "Chaos Level", value: `${chaosLevel}/10`, tone: chaosLevel > 7 ? "danger" : "caution" },
    {
      label: "Humiliation Risk",
      value: chaosLevel > 7 ? "CRITICAL" : chaosLevel > 4 ? "RISING" : "ACTIVE",
      tone: chaosLevel > 7 ? "danger" : "neutral"
    }
  ];
}

function withSceneMeta(scenes: Omit<SkitScene, "id" | "order">[], modeId: string): SkitScene[] {
  return scenes.map((scene, index) => ({
    ...scene,
    id: `${modeId}-scene-${index + 1}`,
    order: index + 1,
    overlay: scene.overlay ?? "Stare Reaction: Consequence Loading"
  }));
}

function makeScenes(request: GenerateRequest, safeScenario: string): SkitScene[] {
  const mode = getMode(request.mode ?? request.theme ?? "hellcat_demon");
  const scenario = normalizeScenario(safeScenario);
  const car = request.carType || "Hellcat";
  const friend = request.friendType || "bro";

  const sceneMap: Record<string, Omit<SkitScene, "id" | "order">[]> = {
    hellcat_demon: [
      {
        caption: "Demon Mode: Activated",
        line: `${scenario}. The ${car} sounded expensive, but the gas light was already narrating the downfall.`,
        overlay: "Gas Money: Critical"
      },
      {
        caption: "Dashboard Evidence",
        line: `He gave everybody the stare, then the range dropped to 7 miles like the car wanted honesty.`,
        overlay: "Range: 7 Miles"
      },
      {
        caption: "Repo Risk: Rising",
        line: `${friend} said keep driving, but the tires were whispering invoice numbers.`,
        overlay: "Tire Life: 3%"
      },
      {
        caption: "Humble Ending Incoming",
        line: `By the time he asked for five dollars, Demon Mode had become donation mode.`,
        overlay: "Demon Mode: Donation Mode"
      }
    ],
    fake_plug: [
      {
        caption: "Case File: Exotic Claim",
        line: `${scenario}. He talked like it came imported, but the bag sounded like it came from aisle three.`,
        overlay: "Authenticity: Questionable"
      },
      {
        caption: "Authenticity: Questionable",
        line: `The label said barbecue, the confidence said luxury, and the math said scam.`,
        overlay: "Receipt Evidence: Found"
      },
      {
        caption: "Gas Station Energy",
        line: `${friend} started whispering like the honey buns had street value.`,
        overlay: "Snack Market: Inflated"
      },
      {
        caption: "Evidence Recovered",
        line: `The receipt fell out and solved the whole mystery before the narrator could.`,
        overlay: "Scam Probability: 94%"
      }
    ],
    friend_weird: [
      {
        caption: "Loyalty Test: Started",
        line: `${scenario}. He said he was outside, but outside apparently had a couch and Wi-Fi.`,
        overlay: "Location: Suspicious"
      },
      {
        caption: "Location: Suspicious",
        line: `The map said home, the text said traffic, and the story said absolutely not.`,
        overlay: "ETA: Fictional"
      },
      {
        caption: "Food Post Detected",
        line: `${friend} posted wings four minutes later like the internet had no witnesses.`,
        overlay: "Screenshot Risk: Rising"
      },
      {
        caption: "Group Chat Verdict",
        line: `The screenshots arrived before he did, and that was the real Crazy Story twist.`,
        overlay: "Verdict: Moving Weird"
      }
    ],
    rental_flex: [
      {
        caption: "Ownership Claim: Unverified",
        line: `${scenario}. The pictures looked permanent, but the rental timer was doing cardio.`,
        overlay: "Ownership: Unverified"
      },
      {
        caption: "Notification Leak",
        line: `He cropped the logo, forgot the app, and let the phone expose the whole production.`,
        overlay: "Rental Timer: Active"
      },
      {
        caption: "Enterprise Calling",
        line: `${friend} said ignore it, but his mom was already asking why a company needed the car back.`,
        overlay: "Mom Call: Incoming"
      },
      {
        caption: "Caption Under Review",
        line: `He had the vehicle for one day and the personality for the rest of the week.`,
        overlay: "Exposure Risk: High"
      }
    ],
    court_panic: [
      {
        caption: "Confidence: Too Early",
        line: `${scenario}. He woke up posting discipline quotes with one eye still closed.`,
        overlay: "Calendar: Armed"
      },
      {
        caption: "Calendar Betrayal",
        line: `Court said 9:30, the clock said 11:42, and the room got quiet.`,
        overlay: "Court Time: Missed"
      },
      {
        caption: "Legal Heat: Active",
        line: `${friend} told him stay calm, which is exactly what people say when it is not calm.`,
        overlay: "Panic: Active"
      },
      {
        caption: "Demon Mode: Deactivated",
        line: `The stare disappeared the moment the reminder said missed.`,
        overlay: "Stare Factor: Offline"
      }
    ]
  };

  return withSceneMeta(sceneMap[mode.id] ?? sceneMap.hellcat_demon, mode.id);
}

export function generateSkit(request: GenerateRequest): SkitProject {
  const safety = evaluateSafety(request.scenario);

  if (safety.status === "blocked") {
    throw new Error(safety.reason);
  }

  const safeScenario = safety.rewritten;
  const modeId = request.mode ?? request.theme ?? "hellcat_demon";
  const seed = seedFrom(`${safeScenario}-${modeId}-${request.chaosLevel}`);
  const mode = getMode(modeId);
  const ending = pick(endingLines[request.endingStyle], seed);
  const now = new Date().toISOString();
  const narrator = `Narrator: ${mode.description} The confidence starts high, the receipts arrive higher, and the ending makes sure nobody leaves undefeated.`;

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}`,
    title:
      mode.id === "hellcat_demon"
        ? "Crazy Story: The Hellcat Demon"
        : `Crazy Story: ${mode.shortLabel} Incident`,
    mode: mode.id,
    theme: mode.id,
    modeLabel: mode.label,
    scenarioInput: request.scenario,
    safeScenario,
    hook: modeHooks[mode.id] ?? "The setup was loud, but the twist was louder.",
    dashboard: makeDashboard(mode.stats, request.chaosLevel),
    scenes: makeScenes(request, safeScenario),
    ending,
    narrator,
    narrator_script: narrator,
    safety,
    safety_rewrites: safety,
    format: request.format,
    chaosLevel: request.chaosLevel,
    endingStyle: request.endingStyle,
    createdAt: now,
    updatedAt: now
  };
}
