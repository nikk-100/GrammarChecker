// Reference: Wren & Martin, Ch. 15–19 — Pronouns (Subject vs Object case).

// Object-case pronouns mistakenly used as the subject of a sentence.
const OBJECT_TO_SUBJECT = {
  me: "I",
  him: "he",
  her: "she",
  us: "we",
  them: "they",
};

// Subject-case pronouns mistakenly used after a preposition, where an
// object-case pronoun is required.
const SUBJECT_TO_OBJECT = {
  i: "me",
  he: "him",
  she: "her",
  we: "us",
  they: "them",
};

// Common prepositions that require an object pronoun to follow them.
const PREPOSITIONS = new Set([
  "to", "for", "with", "at", "from", "by", "about", "of",
  "between", "before", "after", "near", "against", "without",
]);

export function checkPronounCase(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  // Case 1: object pronoun used as the subject at the start of the
  // sentence (e.g. "Me went to school").
  const firstWord = words[0];
  const lowerFirstWord = firstWord ? firstWord.toLowerCase() : "";
  const subjectReplacement = OBJECT_TO_SUBJECT[lowerFirstWord];

  if (subjectReplacement && words.length > 1) {
    const isCapitalized = firstWord[0] === firstWord[0].toUpperCase();
    const correctedWord = isCapitalized
      ? subjectReplacement[0].toUpperCase() + subjectReplacement.slice(1)
      : subjectReplacement;

    violations.push({
      stage: "Rule Matching",
      actionTaken: `Corrected object pronoun "${firstWord}" used as subject`,
      grammarReferenceRule: "Wren & Martin Ch. 15–19: Pronouns (Subject Case)",
      originalSegment: `${firstWord} ${words[1]}`,
      correctedSegment: `${correctedWord} ${words[1]}`,
    });
  }

  // Case 2: subject pronoun used after a preposition (e.g. "for I").
  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i].toLowerCase();
    if (!PREPOSITIONS.has(currentWord)) continue;

    const nextWord = words[i + 1];
    const lowerNextWord = nextWord.toLowerCase();
    const objectReplacement = SUBJECT_TO_OBJECT[lowerNextWord];
    if (!objectReplacement) continue;

    violations.push({
      stage: "Rule Matching",
      actionTaken: `Corrected subject pronoun "${nextWord}" used after preposition "${words[i]}"`,
      grammarReferenceRule: "Wren & Martin Ch. 15–19: Pronouns (Object Case)",
      originalSegment: `${words[i]} ${nextWord}`,
      correctedSegment: `${words[i]} ${objectReplacement}`,
    });
  }

  return violations.length > 0 ? violations : null;
}