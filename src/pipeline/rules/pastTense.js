// Maps common incorrect "regularized" past tense forms (where a learner
// mistakenly adds -ed to an irregular verb) to the correct irregular
// past tense form.
// Reference: Wren & Martin, Ch. 24 — Tenses (Irregular Verbs).
export const IRREGULAR_PAST_TENSE_CORRECTIONS = {
  goed: "went",
  runned: "ran",
  eated: "ate",
  buyed: "bought",
  catched: "caught",
  teached: "taught",
  thinked: "thought",
  bringed: "brought",
  feeled: "felt",
  finded: "found",
  writed: "wrote",
  speaked: "spoke",
  drived: "drove",
  singed: "sang",
  sitted: "sat",
  standed: "stood",
  sleeped: "slept",
  waked: "woke",
  gived: "gave",
  taked: "took",
  maked: "made",
  seed: "saw",
  comed: "came",
  knowed: "knew",
  getted: "got",
  sayed: "said",
  telled: "told",
  selled: "sold",
  readed: "read",
  doed: "did",
  haved: "had",
  breaked: "broke",
  choosed: "chose",
  falled: "fell",
  flyed: "flew",
  forgetted: "forgot",
  growed: "grew",
  hided: "hid",
  holded: "held",
  keeped: "kept",
  leaved: "left",
  loosed: "lost",
  meeted: "met",
  payed: "paid",
  putted: "put",
  rided: "rode",
  ringed: "rang",
  rised: "rose",
  shaked: "shook",
  swimmed: "swam",
  throwed: "threw",
  weared: "wore",
  winned: "won",
};

export function checkPastTense(sanitizedText) {
  const words = sanitizedText.replace(/[.,!?]/g, "").split(" ");
  const violations = [];

  for (const rawWord of words) {
    const lowerWord = rawWord.toLowerCase();
    const correctForm = IRREGULAR_PAST_TENSE_CORRECTIONS[lowerWord];
    if (!correctForm) continue;

    // Preserve original capitalization style in the suggestion
    const isCapitalized = rawWord[0] === rawWord[0].toUpperCase();
    const correctedWord = isCapitalized
      ? correctForm[0].toUpperCase() + correctForm.slice(1)
      : correctForm;

    violations.push({
      stage: "Rule Matching",
      actionTaken: `Corrected irregular past tense for "${rawWord}"`,
      grammarReferenceRule: "Wren & Martin Ch. 24: Tenses — Irregular Verbs",
      originalSegment: rawWord,
      correctedSegment: correctedWord,
    });
  }

  return violations.length > 0 ? violations : null;
}