import { PAST_PARTICIPLES } from "./pastParticiples";
import { IRREGULAR_PAST_SIMPLE_TO_BASE } from "./irregularPastForms";

// Converts simple active-voice Subject-Verb-Object sentences into
// passive voice. Reference: Wren & Martin, Ch. 22 — Active and Passive Voice.
//
// Scope: this rule ONLY handles the plain pattern
//   [Subject] [verb-s/verb] [Determiner?] [Object noun]
// It deliberately stays silent on anything more complex (adjectives,
// prepositional phrases, multiple clauses, questions) since guessing
// wrong there would produce a broken sentence, not a corrected one.

const SUBJECT_PRONOUN_TO_OBJECT = {
  i: "me",
  he: "him",
  she: "her",
  we: "us",
  they: "them",
  you: "you",
  it: "it",
};

const THIRD_PERSON_SINGULAR_PRONOUNS = new Set(["he", "she", "it"]);
const PLURAL_SUBJECT_PRONOUNS = new Set(["they", "we", "you"]);

// Converts a verb to its base form for participle lookup. Checks the
// irregular past-simple dictionary first (e.g. "wrote" -> "write"),
// then falls back to stripping a regular third-person-singular "-s"
// ending (e.g. "eats" -> "eat").
function toBaseVerb(verb) {
  const lowerVerb = verb.toLowerCase();
  if (IRREGULAR_PAST_SIMPLE_TO_BASE[lowerVerb]) return IRREGULAR_PAST_SIMPLE_TO_BASE[lowerVerb];
  if (lowerVerb.endsWith("ies")) return lowerVerb.slice(0, -3) + "y";
  if (/(sses|shes|ches|xes|zes|oes)$/.test(lowerVerb)) return lowerVerb.slice(0, -2);
  if (lowerVerb.endsWith("s") && !lowerVerb.endsWith("ss")) return lowerVerb.slice(0, -1);
  return lowerVerb;
}

export function checkActiveToPassive(sanitizedText, taggedWords) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");

  // Only handle the simplest shape: exactly 3 or 4 words, matching
  // [Subject] [Verb] [Object] or [Subject] [Verb] [Determiner] [Object].
  if (words.length !== 3 && words.length !== 4) return null;

  const subjectWord = words[0];
  const verbWord = words[1];
  const hasDeterminer = words.length === 4;
  const determinerWord = hasDeterminer ? words[2] : null;
  const objectWord = hasDeterminer ? words[3] : words[2];

  // Require the tagged parts of speech to actually look like noun-verb-noun,
  // using compromise's tags where available, so we don't misfire on
  // sentences that only coincidentally have 3-4 words.
  if (!taggedWords || taggedWords.length !== words.length) return null;
  const subjectTag = taggedWords[0]?.tag;
  const verbTag = taggedWords[1]?.tag;
  const objectTag = taggedWords[taggedWords.length - 1]?.tag;
  if (verbTag !== "VERB") return null;
  if (subjectTag !== "NOUN" && subjectTag !== "PRON") return null;
  if (objectTag !== "NOUN" && objectTag !== "PRON") return null;

  const lowerSubject = subjectWord.toLowerCase();
  const baseVerb = toBaseVerb(verbWord);
  const participle = PAST_PARTICIPLES[baseVerb];
  if (!participle) return null; // unknown verb, stay silent rather than guess

  // Decide "is" vs "are" for the passive auxiliary based on subject number.
  // Decide "is" vs "are" for the passive auxiliary based on subject
  // number. Known pronouns are checked explicitly first, since the POS
  // tag alone can't tell us singular vs plural (both "he" and "they" can
  // be tagged the same way depending on the tagger). For a generic noun
  // subject (not a recognized pronoun), fall back to a simple heuristic:
  // regular plural nouns end in "s" (e.g. "dogs"), so guess plural in
  // that case and singular otherwise.
  let isThirdPersonSingularSubject;
  if (THIRD_PERSON_SINGULAR_PRONOUNS.has(lowerSubject)) {
    isThirdPersonSingularSubject = true;
  } else if (PLURAL_SUBJECT_PRONOUNS.has(lowerSubject)) {
    isThirdPersonSingularSubject = false;
  } else {
    isThirdPersonSingularSubject = !lowerSubject.endsWith("s");
  }
  const auxiliaryVerb = isThirdPersonSingularSubject ? "is" : "are";

  // Convert the subject into the object-case pronoun for the "by" phrase
  // (e.g. "he" -> "him"). If it's not a known pronoun, assume it's a
  // proper noun/common noun and keep it as-is.
  const bySubject = SUBJECT_PRONOUN_TO_OBJECT[lowerSubject] || subjectWord;

  const capitalizedObject = objectWord[0].toUpperCase() + objectWord.slice(1);
  const objectPhrase = hasDeterminer ? `${determinerWord} ${capitalizedObject}` : capitalizedObject;

  const originalSentence = words.join(" ");
  const rawPassiveSentence = `${objectPhrase} ${auxiliaryVerb} ${participle} by ${bySubject}`;
  const passiveSentence = rawPassiveSentence[0].toUpperCase() + rawPassiveSentence.slice(1);

  return {
    stage: "Rule Matching",
    actionTaken: "Converted active voice sentence to passive voice",
    grammarReferenceRule: "Wren & Martin Ch. 22: Active and Passive Voice",
    originalSegment: originalSentence,
    correctedSegment: passiveSentence,
  };
}