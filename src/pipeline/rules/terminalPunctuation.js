export function checkTerminalPunctuation(sanitizedText) {
  const trimmedText = sanitizedText.trim();
  const lastChar = trimmedText.slice(-1);
  const validEndings = [".", "!", "?"];

  if (!validEndings.includes(lastChar)) {
    return {
      stage: "Rule Matching",
      actionTaken: "Added missing terminal punctuation",
      grammarReferenceRule: "Warriner's Rule 2c: End Punctuation",
      originalSegment: trimmedText,
      correctedSegment: trimmedText + ".",
    };
  }

  return null;
}