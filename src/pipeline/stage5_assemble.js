export function assembleCorrectedText(sanitizedText, violations) {
  let correctedText = sanitizedText;

  for (const violation of violations) {
    const { originalSegment, correctedSegment, grammarReferenceRule } = violation;
    if (!originalSegment) continue;

    // Terminal punctuation's originalSegment is the whole sentence, which
    // can accidentally appear as a substring of a word changed by an
    // earlier rule (e.g. "He is run" is a substring of "He is running").
    // So this rule always uses its own direct logic and skips the
    // generic substring-replace path entirely.
    if (grammarReferenceRule === "Warriner's Rule 2c: End Punctuation") {
      const lastChar = correctedText.slice(-1);
      const validEndings = [".", "!", "?"];
      if (!validEndings.includes(lastChar)) {
        correctedText = correctedText + ".";
      }
      continue;
    }

    if (grammarReferenceRule === "Warriner's Rule 3d: Article Usage (a/an)") {
      // Multiple article violations can exist in one sentence (e.g. two
      // separate "a" -> "an" fixes). Replacing with a single non-global
      // regex would only ever fix the first occurrence and silently skip
      // the rest. Instead, walk the word list and fix the first word that
      // (a) still matches the article this violation is about, and
      // (b) sits directly before the same noun this violation targets —
      // so each violation corrects a different occurrence.
      const originalArticle = originalSegment.split(" ")[0];
      const correctedArticle = correctedSegment.split(" ")[0];
      const nounWord = originalSegment.split(" ")[1];

      const words = correctedText.split(" ");
      const targetIndex = words.findIndex((word, index) => {
        const isSameArticle = word.toLowerCase() === originalArticle.toLowerCase();
        const nextWordMatches = words[index + 1] && words[index + 1].toLowerCase() === nounWord.toLowerCase();
        return isSameArticle && nextWordMatches;
      });

      if (targetIndex !== -1) {
        words[targetIndex] = correctedArticle;
        correctedText = words.join(" ");
      }
      continue;
    }

    if (grammarReferenceRule === "Wren & Martin Ch. 25: Present Continuous Tense") {
      const verbWord = originalSegment.split(" ")[1];
      const ingForm = correctedSegment.split(" ")[1];
      const pattern = new RegExp(`\\b(am|is|are)\\b\\s+\\b${verbWord}\\b`, "i");
      correctedText = correctedText.replace(pattern, (match, currentBeWord) => `${currentBeWord} ${ingForm}`);
      continue;
    }

    if (grammarReferenceRule === "Warriner's Rule 8f: Double Negatives") {
      // This rule only flags an issue for the student to review — it
      // doesn't provide an automatic correction. Skip assembly entirely
      // so the sentence isn't replaced with the review note text.
      continue;
    }

    if (grammarReferenceRule === "Wren & Martin Ch. 22: Active and Passive Voice") {
      // This rule restructures the whole sentence, so just take over the
      // corrected text directly rather than trying to substring-match.
      correctedText = correctedSegment;
      continue;
    }

    // Generic fallback for rules without special handling (spelling,
    // capitalization, subject-verb agreement, past tense, pronoun case,
    // preposition usage).
    if (correctedText.includes(originalSegment)) {
      correctedText = correctedText.replace(originalSegment, correctedSegment);
    }
  }

  return correctedText;
}