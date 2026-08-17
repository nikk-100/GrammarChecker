import { IRREGULAR_PAST_SIMPLE_TO_BASE } from "./irregularPastForms";

// A small lookup of subject pronouns to their grammatical person/number,
// used to decide which verb form is correct for a given subject.
// Reference: Wren & Martin, Ch. 27 — The Verb: Person and Number.
const PRONOUN_PERSON_NUMBER = {
  i: { person: 1, number: "singular" },
  we: { person: 1, number: "plural" },
  you: { person: 2, number: "singular" },
  he: { person: 3, number: "singular" },
  she: { person: 3, number: "singular" },
  it: { person: 3, number: "singular" },
  they: { person: 3, number: "plural" },
};

// Irregular "be" verb forms, keyed by "person-number".
const BE_FORMS = {
  "1-singular": "am",
  "1-plural": "are",
  "2-singular": "are",
  "3-singular": "is",
  "3-plural": "are",
};

// Irregular "have" verb forms, keyed by "person-number".
const HAVE_FORMS = {
  "1-singular": "have",
  "1-plural": "have",
  "2-singular": "have",
  "3-singular": "has",
  "3-plural": "have",
};

const BE_WORD_SET = new Set(["am", "is", "are"]);
const HAVE_WORD_SET = new Set(["have", "has"]);

// Adds the correct third-person-singular present tense ending to a base
// verb, following standard English spelling rules.
function conjugateThirdPersonSingular(baseVerb) {
  const endsInConsonantY = /[^aeiou]y$/i.test(baseVerb);
  const endsInSibilant = /(s|sh|ch|x|z|o)$/i.test(baseVerb);

  if (endsInConsonantY) return baseVerb.slice(0, -1) + "ies";
  if (endsInSibilant) return baseVerb + "es";
  return baseVerb + "s";
}

// Strips a third-person-singular ending off a verb to recover its base
// form, so "goes" and "go" can be compared against each other.
function toBaseForm(verb) {
  const lowerVerb = verb.toLowerCase();
  if (lowerVerb.endsWith("ies")) return lowerVerb.slice(0, -3) + "y";
  if (/(sses|shes|ches|xes|zes|oes)$/.test(lowerVerb)) return lowerVerb.slice(0, -2);
  if (lowerVerb.endsWith("s") && !lowerVerb.endsWith("ss")) return lowerVerb.slice(0, -1);
  return lowerVerb;
}

export function checkSubjectVerbAgreement(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  for (let i = 0; i < words.length - 1; i++) {
    const subjectWord = words[i].toLowerCase();
    const subjectInfo = PRONOUN_PERSON_NUMBER[subjectWord];
    if (!subjectInfo) continue;

    const verbWord = words[i + 1];
    const lowerVerb = verbWord.toLowerCase();
    const key = `${subjectInfo.person}-${subjectInfo.number}`;

    if (IRREGULAR_PAST_SIMPLE_TO_BASE[lowerVerb]) continue; // already-correct past tense, not a present-tense agreement issue

    // Case 1: "be" verb (am/is/are)
    if (BE_WORD_SET.has(lowerVerb)) {
      const expectedForm = BE_FORMS[key];
      if (lowerVerb !== expectedForm) {
        violations.push({
          stage: "Rule Matching",
          actionTaken: `Corrected verb agreement for subject "${words[i]}"`,
          grammarReferenceRule: "Wren & Martin Ch. 27: The Verb — Person and Number",
          originalSegment: `${words[i]} ${verbWord}`,
          correctedSegment: `${words[i]} ${expectedForm}`,
        });
      }
      continue;
    }

    // Case 2: "have" verb (has/have)
    if (HAVE_WORD_SET.has(lowerVerb)) {
      const expectedForm = HAVE_FORMS[key];
      if (lowerVerb !== expectedForm) {
        violations.push({
          stage: "Rule Matching",
          actionTaken: `Corrected verb agreement for subject "${words[i]}"`,
          grammarReferenceRule: "Wren & Martin Ch. 27: The Verb — Person and Number",
          originalSegment: `${words[i]} ${verbWord}`,
          correctedSegment: `${words[i]} ${expectedForm}`,
        });
      }
      continue;
    }

    // Case 3: regular verbs in simple present tense only. If the verb
    // isn't in its plain base form or its third-person-singular form,
    // it's probably past tense or continuous tense — skip it, since that
    // needs the Tenses rule, not agreement checking.
    const baseForm = toBaseForm(lowerVerb);
    const conjugatedForm = conjugateThirdPersonSingular(baseForm);
    const isSimplePresentForm = lowerVerb === baseForm || lowerVerb === conjugatedForm;
    if (!isSimplePresentForm) continue;

    const expectedForm = key === "3-singular" ? conjugatedForm : baseForm;
    if (lowerVerb !== expectedForm) {
      violations.push({
        stage: "Rule Matching",
        actionTaken: `Corrected verb agreement for subject "${words[i]}"`,
        grammarReferenceRule: "Wren & Martin Ch. 27: The Verb — Person and Number",
        originalSegment: `${words[i]} ${verbWord}`,
        correctedSegment: `${words[i]} ${expectedForm}`,
      });
    }
  }

  return violations.length > 0 ? violations : null;
}