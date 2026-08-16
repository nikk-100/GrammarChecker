// A starter dictionary of common English words.
// This is intentionally small for now — expand it over time by adding
// more words as you test more sentences.
const COMMON_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "an", "in", "that", "have",
  "i", "it", "for", "not", "on", "with", "he", "as", "you", "do",
  "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "will", "my", "one", "all", "would", "there", "their",
  "what", "so", "up", "out", "if", "about", "who", "get", "which", "go",
  "me", "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "is", "are", "was", "were",
  "been", "being", "am", "apple", "orange", "banana", "dog", "cat",
  "run", "runs", "running", "went", "goes", "going", "eat", "eats",
  "eating", "read", "reads", "reading", "write", "writes", "writing",
]);

// Levenshtein distance: counts the minimum single-character edits
// (insertions, deletions, substitutions) needed to turn wordA into wordB.
function levenshteinDistance(wordA, wordB) {
  const lengthA = wordA.length;
  const lengthB = wordB.length;
  const distanceMatrix = Array.from({ length: lengthA + 1 }, () =>
    new Array(lengthB + 1).fill(0)
  );

  for (let i = 0; i <= lengthA; i++) distanceMatrix[i][0] = i;
  for (let j = 0; j <= lengthB; j++) distanceMatrix[0][j] = j;

  for (let i = 1; i <= lengthA; i++) {
    for (let j = 1; j <= lengthB; j++) {
      const cost = wordA[i - 1] === wordB[j - 1] ? 0 : 1;
      distanceMatrix[i][j] = Math.min(
        distanceMatrix[i - 1][j] + 1,       // deletion
        distanceMatrix[i][j - 1] + 1,       // insertion
        distanceMatrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return distanceMatrix[lengthA][lengthB];
}

// Finds the closest dictionary word to the given word, if one exists
// within MAX_DISTANCE edits.
const MAX_DISTANCE = 2;

// Counts how many letters two words share at the start.
// Used to break ties when two dictionary words are equally close.
function commonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function findClosestWord(word) {
  let closestWord = null;
  let closestDistance = Infinity;
  let closestPrefixLength = -1;

  for (const dictionaryWord of COMMON_WORDS) {
    const distance = levenshteinDistance(word, dictionaryWord);
    const prefixLength = commonPrefixLength(word, dictionaryWord);

    const isCloserMatch = distance < closestDistance;
    const isTieButBetterPrefix =
      distance === closestDistance && prefixLength > closestPrefixLength;

    if (isCloserMatch || isTieButBetterPrefix) {
      closestDistance = distance;
      closestPrefixLength = prefixLength;
      closestWord = dictionaryWord;
    }
  }

  return closestDistance <= MAX_DISTANCE ? closestWord : null;
}
export function checkSpelling(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  for (const rawWord of words) {
    const lowerWord = rawWord.toLowerCase();
    if (lowerWord.length === 0) continue;
    if (COMMON_WORDS.has(lowerWord)) continue;

    const suggestion = findClosestWord(lowerWord);
    if (suggestion) {
      // Preserve original capitalization style in the suggestion
      const isCapitalized = rawWord[0] === rawWord[0].toUpperCase();
      const correctedWord = isCapitalized
        ? suggestion[0].toUpperCase() + suggestion.slice(1)
        : suggestion;

      violations.push({
        stage: "Rule Matching",
        actionTaken: `Suggested spelling correction for "${rawWord}"`,
        grammarReferenceRule: "Dictionary Lookup: Edit-Distance Spell Check",
        originalSegment: rawWord,
        correctedSegment: correctedWord,
      });
    }
  }

  return violations.length > 0 ? violations : null;
}