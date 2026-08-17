// Reference: Wren & Martin, Ch. 38–39 — Prepositions.
// Maps a "trigger word + wrong preposition" pair to the correct
// preposition that should follow it.
const PREPOSITION_CORRECTIONS = {
  "married-with": "to",
  "married-to": null, // already correct, listed for clarity
  "good-in": "at",
  "bad-in": "at",
  "interested-on": "in",
  "interested-at": "in",
  "afraid-from": "of",
  "afraid-with": "of",
  "depend-of": "on",
  "depend-with": "on",
  "angry-on": "with",
  "angry-of": "with",
  "proud-with": "of",
  "proud-from": "of",
  "similar-with": "to",
  "similar-of": "to",
  "different-with": "from",
  "different-than": "from",
  "arrive-to": "at",
  "arrive-in": "at",
  "capable-in": "of",
  "capable-to": "of",
  "aware-of-": null,
  "aware-with": "of",
  "believe-on": "in",
  "believe-at": "in",
  "rely-of": "on",
  "rely-in": "on",
  "look-after-": null,
  "search-of": "for",
  "search-at": "for",
  "wait-of": "for",
  "wait-to": "for",
  "listen-at": "to",
  "listen-of": "to",
  "compare-with-to": null,
  "consist-in": "of",
  "consist-with": "of",
  "congratulate-of": "on",
  "congratulate-for": "on",
  "insist-of": "on",
  "insist-for": "on",
  "succeed-to": "in",
  "succeed-at": "in",
  "good-with": null,
};

export function checkPrepositionUsage(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  for (let i = 0; i < words.length - 1; i++) {
    const triggerWord = words[i].toLowerCase();
    const prepositionWord = words[i + 1].toLowerCase();
    const lookupKey = `${triggerWord}-${prepositionWord}`;

    const correctPreposition = PREPOSITION_CORRECTIONS[lookupKey];
    if (!correctPreposition) continue; // no entry, or explicitly already correct

    violations.push({
      stage: "Rule Matching",
      actionTaken: `Corrected preposition after "${words[i]}"`,
      grammarReferenceRule: "Wren & Martin Ch. 38–39: Prepositions",
      originalSegment: `${words[i]} ${words[i + 1]}`,
      correctedSegment: `${words[i]} ${correctPreposition}`,
    });
  }

  return violations.length > 0 ? violations : null;
}