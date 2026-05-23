export const hardBlockPatterns = [
  /\bhow\s+to\b.*\b(kill|shoot|stab|rob|traffic|sell drugs|move drugs|hide a gun|make a gun)\b/i,
  /\b(step[-\s]?by[-\s]?step|instructions|guide)\b.*\b(shoot|weapon|gun|drug dealing|trafficking)\b/i,
  /\b(real|actual)\b.*\b(retaliation|hit|murder|shooting|drug route)\b/i,
  /\bthreaten\b.*\b(real person|teacher|ex|boss|cop|judge)\b/i
];

export const rewriteRules = [
  {
    flag: "drug_crime",
    pattern: /\b(sell|selling|trap|trapping|plug|dealer|exotic|za|perc|percs|lean|coke|dope)\b/i,
    replacement:
      "a fake plug selling gas station snacks, barbecue chips, mystery vapes, and suspicious coffee from a Hellcat"
  },
  {
    flag: "violence_fantasy",
    pattern: /\b(shoot|shooting|opps|opp|slide|spin|retaliate|smoke|drill)\b/i,
    replacement:
      "a harmless rival friend-group roast over who lied, who paid for gas, and who got exposed in the group chat"
  },
  {
    flag: "gang_roleplay",
    pattern: /\b(gang|crew|set|block|territory|beef)\b/i,
    replacement:
      "a fake cinematic loyalty test where the only consequence is embarrassment and a dashboard warning"
  }
];
