const VOWEL_SOUND = /^[aeiou]/i;

export function checkArticleUsage(sanitizedText) {
  const words = sanitizedText.split(" ");
  const violations = [];

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i].toLowerCase();
    const nextWord = words[i + 1];

    if (currentWord === "a" && VOWEL_SOUND.test(nextWord)) {
      violations.push({
        stage: "Rule Matching",
        actionTaken: `Changed "a" to "an" before a vowel sound`,
        grammarReferenceRule: "Warriner's Rule 3d: Article Usage (a/an)",
        originalSegment: `a ${nextWord}`,
        correctedSegment: `an ${nextWord}`,
      });
      continue;
    }

    if (currentWord === "an" && !VOWEL_SOUND.test(nextWord)) {
      violations.push({
        stage: "Rule Matching",
        actionTaken: `Changed "an" to "a" before a consonant sound`,
        grammarReferenceRule: "Warriner's Rule 3d: Article Usage (a/an)",
        originalSegment: `an ${nextWord}`,
        correctedSegment: `a ${nextWord}`,
      });
    }
  }

  return violations.length > 0 ? violations : null;
}