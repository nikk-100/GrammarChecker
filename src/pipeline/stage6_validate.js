import nlp from "compromise";

// Performs a final, whole-sentence structural check on the fully
// corrected text — after every individual rule has already run. This
// does NOT re-check individual word-level issues (spelling, articles,
// etc.) since those are already handled earlier in the pipeline. It only
// asks: does this assembled sentence hold together as a complete,
// grammatically well-formed unit?
//
// Scope: structural completeness only (subject present, verb present,
// capitalized, properly punctuated). This does not judge whether the
// sentence makes logical/semantic sense — that's beyond what a
// rule-based, non-parsing pipeline can reliably do.
// Reference: Wren & Martin — Sentence Structure: Subject and Predicate.
export function validateSentence(correctedText) {
  const trimmedText = correctedText.trim();
  const doc = nlp(trimmedText);

  const hasSubject = doc.match("#Noun|#Pronoun").found;
  const hasVerb = doc.verbs().length > 0;
  const startsWithCapital = /^[A-Z]/.test(trimmedText);
  const endsWithTerminalPunctuation = /[.!?]$/.test(trimmedText);

  const issues = [];
  if (!hasSubject) issues.push("no clear subject (noun or pronoun) found");
  if (!hasVerb) issues.push("no main verb found");
  if (!startsWithCapital) issues.push("sentence does not start with a capital letter");
  if (!endsWithTerminalPunctuation) issues.push("sentence does not end with terminal punctuation");

  const isComplete = issues.length === 0;

return {
    stage: "Whole-Sentence Validation",
    actionTaken: isComplete
      ? "Sentence is structurally complete as a whole"
      : `Sentence may be incomplete: ${issues.join("; ")}`,
    grammarReferenceRule: "Wren & Martin — Sentence Structure: Subject and Predicate",
    originalSegment: trimmedText,
    correctedSegment: trimmedText,
    isComplete,
  };
}