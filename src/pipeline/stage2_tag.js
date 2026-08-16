import nlp from "compromise";
import { mapToChipTag } from "../services/posTagMap";

export function tagWords(sanitizedText) {
  const doc = nlp(sanitizedText);
  const terms = doc.json()[0]?.terms || [];

  return terms.map((term) => ({
    word: term.text,
    tag: mapToChipTag(term.tags || []),
  }));
}