export function assembleCorrectedText(sanitizedText, violations) {
  let correctedText = sanitizedText;

  for (const violation of violations) {
    const { originalSegment, correctedSegment, grammarReferenceRule } = violation;
    if (!originalSegment) continue;

    if (correctedText.includes(originalSegment)) {
      correctedText = correctedText.replace(originalSegment, correctedSegment);
      continue;
    }

    if (grammarReferenceRule === "Warriner's Rule 2c: End Punctuation") {
      // This rule only ever appends a period/!/? at the end, so apply it
      // directly instead of relying on a substring match that may no
      // longer exist after earlier rules changed the sentence.
      const lastChar = correctedText.slice(-1);
      const validEndings = [".", "!", "?"];
      if (!validEndings.includes(lastChar)) {
        correctedText = correctedText + ".";
      }
      continue;
    }

    if (grammarReferenceRule === "Warriner's Rule 3d: Article Usage (a/an)") {
      // The noun captured in originalSegment/correctedSegment may be stale
      // (spelling could have already fixed it by the time we get here), so
      // don't try to match the noun at all. Just swap the article word
      // itself — "a" or "an" — wherever it stands alone in the sentence.
      const originalArticle = originalSegment.split(" ")[0]; // "a" or "an"
      const correctedArticle = correctedSegment.split(" ")[0]; // "an" or "a"
      const articleWordPattern = new RegExp(`\\b${originalArticle}\\b`, "i");

      correctedText = correctedText.replace(articleWordPattern, correctedArticle);
      continue;
    }
  }

  return correctedText;
}