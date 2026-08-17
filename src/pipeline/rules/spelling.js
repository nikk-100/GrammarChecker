import { IRREGULAR_PAST_TENSE_CORRECTIONS } from "./pastTense";
import { IRREGULAR_PAST_SIMPLE_TO_BASE } from "./irregularPastForms";

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
  "see", "sees", "seeing", "saw", "seen",

  // School, home, and everyday nouns
  "school", "class", "teacher", "student", "book", "books", "pen",
  "pencil", "paper", "desk", "chair", "room", "house", "home", "door",
  "window", "table", "bed", "kitchen", "garden", "park", "ground",
  "street", "road", "city", "town", "country", "friend", "friends",
  "family", "mother", "father", "brother", "sister", "child", "children",
  "man", "men", "woman", "women", "boy", "boys", "girl", "girls",
  "water", "food", "milk", "tea", "coffee", "bread", "rice", "fruit",
  "car", "bus", "train", "bike", "phone", "computer", "game", "games",
  "money", "cash", "coin", "coins", "price", "cost",
  "ball", "team", "match", "music", "song", "movie", "story", "letter",
  "word", "words", "sentence", "language", "english", "math", "maths", "science",

  // Common verbs (base, third-person-singular, past, and -ing forms)
  "play", "plays", "played", "playing",
  "walk", "walks", "walked", "walking",
  "talk", "talks", "talked", "talking",
  "study", "studies", "studied", "studying",
  "watch", "watches", "watched", "watching",
  "listen", "listens", "listened", "listening",
  "speak", "speaks", "spoke", "speaking",
  "learn", "learns", "learned", "learning",
  "teach", "teaches", "taught", "teaching",
  "help", "helps", "helped", "helping",
  "want", "wants", "wanted", "wanting",
  "need", "needs", "needed", "needing",
  "like", "likes", "liked", "liking",
  "love", "loves", "loved", "loving",
  "live", "lives", "lived", "living",
  "work", "works", "worked", "working",
  "start", "starts", "started", "starting",
  "stop", "stops", "stopped", "stopping",
  "open", "opens", "opened", "opening",
  "close", "closes", "closed", "closing",
  "jump", "jumps", "jumped", "jumping",
  "sing", "sings", "sang", "singing",
  "dance", "dances", "danced", "dancing",
  "cook", "cooks", "cooked", "cooking",
  "clean", "cleans", "cleaned", "cleaning",
  "drive", "drives", "drove", "driving",
  "buy", "buys", "bought", "buying",
  "sell", "sells", "sold", "selling",
  "bring", "brings", "brought", "bringing",
  "sleep", "sleeps", "slept", "sleeping",
  "wake", "wakes", "woke", "waking",
  "sit", "sits", "sat", "sitting",
  "stand", "stands", "stood", "standing",
  "smile", "smiles", "smiled", "smiling",
  "laugh", "laughs", "laughed", "laughing",
  "cry", "cries", "cried", "crying",
  "ask", "asks", "asked", "asking",
  "answer", "answers", "answered", "answering",
  "call", "calls", "called", "calling",
  "tell", "tells", "told", "telling",
  "find", "finds", "found", "finding",
  "feel", "feels", "felt", "feeling",
  "seem", "seems", "seemed", "seeming",
  "try", "tries", "tried", "trying",

  // Common adjectives and descriptive words
  "happy", "sad", "angry", "tired", "hungry", "thirsty", "busy", "free",
  "big", "small", "tall", "short", "long", "old", "young", "new",
  "hot", "cold", "warm", "cool", "fast", "slow", "easy", "hard",
  "bright", "dark", "loud", "quiet", "clean", "dirty", "rich", "poor",
  "strong", "weak", "beautiful", "nice", "kind", "smart", "funny",

  // Common connectors and question words
  "here", "where", "why", "because", "before", "after", "during",
  "always", "never", "sometimes", "often", "usually", "today",
  "yesterday", "tomorrow", "morning", "evening", "night", "week",
  "month", "today's",
]);

// Common English contractions. These are skipped entirely by spelling
// checks since they legitimately contain an apostrophe and shouldn't be
// treated as misspelled words.
const COMMON_CONTRACTIONS = new Set([
  "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
  "i've", "you've", "we've", "they've",
  "i'll", "you'll", "he'll", "she'll", "we'll", "they'll",
  "i'd", "you'd", "he'd", "she'd", "we'd", "they'd",
  "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't",
  "can't", "couldn't", "won't", "wouldn't", "shouldn't", "mustn't",
  "haven't", "hasn't", "hadn't", "let's", "that's", "there's", "who's",
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
    if (IRREGULAR_PAST_TENSE_CORRECTIONS[lowerWord]) continue; // handled by pastTense rule, not spelling
    if (COMMON_CONTRACTIONS.has(lowerWord)) continue; // valid contraction, not a typo
    if (IRREGULAR_PAST_SIMPLE_TO_BASE[lowerWord]) continue; // valid irregular past tense, not a typo

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