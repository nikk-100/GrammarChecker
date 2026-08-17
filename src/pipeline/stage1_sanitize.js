// Common English contractions, expanded to their full form so every
// downstream rule (spelling, pronoun case, agreement, tense, etc.) sees
// plain, standalone words instead of apostrophe-joined tokens.
const CONTRACTION_EXPANSIONS = {
  "i'm": "I am",
  "you're": "you are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "we're": "we are",
  "they're": "they are",
  "that's": "that is",
  "there's": "there is",
  "who's": "who is",
  "what's": "what is",

  "i've": "I have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",

  "i'll": "I will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "we'll": "we will",
  "they'll": "they will",

  "i'd": "I would",
  "you'd": "you would",
  "he'd": "he would",
  "she'd": "she would",
  "we'd": "we would",
  "they'd": "they would",

  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "can't": "cannot",
  "couldn't": "could not",
  "won't": "will not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "mustn't": "must not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "let's": "let us",
};

// Expands every recognized contraction in the text to its full form.
// Matches are done word-by-word (case-insensitively) so "I'm", "i'm",
// and "I'M" are all handled, and capitalization of the replacement is
// preserved based on whether the original contraction started a
// sentence or was mid-sentence.
function expandContractions(text) {
  const words = text.split(" ");

  const expandedWords = words.map((word) => {
    // Separate a trailing punctuation mark (if any) so it isn't lost
    // when the contraction is swapped for a multi-word phrase.
    const trailingPunctuationMatch = word.match(/([.,!?]?)$/);
    const trailingPunctuation = trailingPunctuationMatch ? trailingPunctuationMatch[1] : "";
    const wordWithoutPunctuation = trailingPunctuation
      ? word.slice(0, -trailingPunctuation.length)
      : word;

    const lowerWord = wordWithoutPunctuation.toLowerCase();
    const expansion = CONTRACTION_EXPANSIONS[lowerWord];
    if (!expansion) return word;

    // Preserve capitalization: if the original word started with an
    // uppercase letter, capitalize the first letter of the expansion too.
    const isCapitalized = wordWithoutPunctuation[0] === wordWithoutPunctuation[0].toUpperCase();
    const finalExpansion = isCapitalized
      ? expansion[0].toUpperCase() + expansion.slice(1)
      : expansion;

    return finalExpansion + trailingPunctuation;
  });

  return expandedWords.join(" ");
}

export function sanitize(rawText) {
  let text = rawText.trim();
  text = text.replace(/\s+/g, " ");
  text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  text = expandContractions(text);
  return text;
}