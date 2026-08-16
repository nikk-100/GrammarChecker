const TAG_PRIORITY = [
  "Verb",
  "Noun",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Preposition",
  "Conjunction",
  "Determiner",
  "Interjection",
];

const TAG_TO_CHIP = {
  Verb: "VERB",
  Noun: "NOUN",
  Adjective: "ADJ",
  Adverb: "ADV",
  Pronoun: "PRON",
  Preposition: "PREP",
  Conjunction: "CONJ",
  Determiner: "DET",
  Interjection: "INTERJ",
};

export function mapToChipTag(compromiseTags) {
  const matchedTag = TAG_PRIORITY.find((tag) => compromiseTags.includes(tag));
  return matchedTag ? TAG_TO_CHIP[matchedTag] : "DEFAULT";
}