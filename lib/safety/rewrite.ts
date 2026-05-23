import type { SafetyResult } from "@/lib/types";
import { hardBlockPatterns, rewriteRules } from "@/lib/safety/rules";

export function evaluateSafety(prompt: string): SafetyResult {
  const original = prompt.trim();

  if (!original) {
    return {
      action: "blocked",
      status: "blocked",
      original,
      rewritten: "",
      reason: "Add a scenario before generating.",
      flags: ["empty_prompt"]
    };
  }

  if (hardBlockPatterns.some((pattern) => pattern.test(original))) {
    return {
      action: "blocked",
      status: "blocked",
      original,
      rewritten: "",
      reason:
        "That prompt asks for realistic harm, crime, or instructions. Keep it as parody with embarrassment, gas money, fake snacks, or group-chat consequences.",
      flags: ["hard_block"]
    };
  }

  const matches = rewriteRules.filter((rule) => rule.pattern.test(original));

  if (matches.length === 0) {
    return {
      action: "pass_through",
      status: "pass_through",
      original,
      rewritten: original,
      reason: "Prompt is already in parody-safe territory.",
      flags: []
    };
  }

  const converted = matches.map((rule) => rule.replacement).join(", plus ");

  return {
    action: "rewritten",
    status: "rewritten",
    original,
    rewritten: `Turn this into a parody Crazy Story skit about ${converted}. Original vibe: ${original}. Make the flex collapse into a funny, expensive, fake, or embarrassing consequence.`,
    reason: "Converted risky language into absurd parody before generation.",
    flags: matches.map((rule) => rule.flag)
  };
}
