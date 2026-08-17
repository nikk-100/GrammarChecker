// Detects a "be" verb (am/is/are) directly followed by a bare-form verb,
// which should instead be in the -ing (present continuous) form.
// Reference: Wren & Martin, Ch. 25 — The Present Continuous Tense.

const BE_WORDS = new Set(["am", "is", "are"]);

// A curated list of common bare-form verbs. We check against this list
// instead of relying on POS tags, since compromise sometimes mis-tags
// familiar verbs as nouns (e.g. "play") depending on sentence context.
const BASE_VERBS = new Set([
  "play", "walk", "talk", "study", "watch", "listen", "speak", "learn",
  "teach", "help", "want", "need", "like", "love", "live", "work",
  "start", "stop", "open", "close", "jump", "sing", "dance", "cook",
  "clean", "drive", "buy", "sell", "bring", "sleep", "wake", "sit",
  "stand", "smile", "laugh", "cry", "ask", "answer", "call", "tell",
  "find", "feel", "seem", "try", "go", "eat", "read", "write", "run",
  "do", "have", "say", "know", "take", "see", "come", "think", "give",
  "use", "make",
]);

// Converts a bare-form verb to its -ing form, following standard
// English spelling rules.
function toIngForm(baseVerb) {
  // "die" -> "dying" style: "ie" becomes "y" before "ing"
  if (baseVerb.endsWith("ie")) return baseVerb.slice(0, -2) + "ying";

  // "see" -> "seeing", "agree" -> "agreeing": keep double vowel endings
  if (/(ee|oe|ye)$/.test(baseVerb)) return baseVerb + "ing";

  // "make" -> "making", "write" -> "writing": drop silent e before "ing"
  if (/[^aeiou]e$/.test(baseVerb)) return baseVerb.slice(0, -1) + "ing";

  // "run" -> "running", "sit" -> "sitting": double the final consonant
  // for short verbs ending in a single vowel + single consonant
  const isShortCvcVerb = /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(baseVerb) && baseVerb.length <= 5;
  if (isShortCvcVerb) return baseVerb + baseVerb.slice(-1) + "ing";

  // Regular case: just add "ing"
  return baseVerb + "ing";
}

export function checkPresentContinuous(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  for (let i = 0; i < words.length - 1; i++) {
    const beWord = words[i];
    const lowerBeWord = beWord.toLowerCase();
    if (!BE_WORDS.has(lowerBeWord)) continue;

    const verbWord = words[i + 1];
    const lowerVerb = verbWord.toLowerCase();

    if (lowerVerb.endsWith("ing")) continue; // already correct
    if (!BASE_VERBS.has(lowerVerb)) continue; // not a recognized bare verb

    const ingForm = toIngForm(lowerVerb);

    violations.push({
      stage: "Rule Matching",
      actionTaken: `Changed "${verbWord}" to present continuous form after "${beWord}"`,
      grammarReferenceRule: "Wren & Martin Ch. 25: Present Continuous Tense",
      originalSegment: `${beWord} ${verbWord}`,
      correctedSegment: `${beWord} ${ingForm}`,
    });
  }

  return violations.length > 0 ? violations : null;
}