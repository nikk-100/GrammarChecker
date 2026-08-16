const NEGATIVES = ["not", "no", "never", "nothing", "nobody", "none", "neither"];

export function checkDoubleNegative(sanitizedText) {
  const words = sanitizedText.toLowerCase().replace(/[.,!?]/g, "").split(" ");
  const negativeCount = words.filter((w) => NEGATIVES.includes(w)).length;

  if (negativeCount >= 2) {
    return {
      stage: "Rule Matching",
      actionTaken: "Flagged double negative construction",
      grammarReferenceRule: "Warriner's Rule 8f: Double Negatives",
      originalSegment: sanitizedText,
      correctedSegment: "(review sentence — remove one negative word)",
    };
  }

  return null;
}