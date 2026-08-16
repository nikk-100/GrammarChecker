export function checkCapitalization(sanitizedText) {
  const firstChar = sanitizedText.charAt(0);

  if (firstChar && firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase()) {
    const correctedText = firstChar.toUpperCase() + sanitizedText.slice(1);

    return {
      stage: "Rule Matching",
      actionTaken: "Capitalized the first word of the sentence",
      grammarReferenceRule: "Warriner's Rule 1a: Sentence Capitalization",
      originalSegment: sanitizedText.split(" ")[0],
      correctedSegment: correctedText.split(" ")[0],
    };
  }

  return null;
}