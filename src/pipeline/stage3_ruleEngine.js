import { checkSpelling } from "./rules/spelling";
import { checkCapitalization } from "./rules/capitalization";
import { checkTerminalPunctuation } from "./rules/terminalPunctuation";
import { checkArticleUsage } from "./rules/articleUsage";
import { checkDoubleNegative } from "./rules/doubleNegative";
import { checkSubjectVerbAgreement } from "./rules/SubjectVerbAgreement";
import { checkPresentContinuous } from "./rules/presentContinuous";
import { checkPastTense } from "./rules/pastTense";
import { checkPronounCase } from "./rules/pronounCase";
import { checkPrepositionUsage } from "./rules/prepositionUsage";
import { checkActiveToPassive } from "./rules/activeToPassive";

const RULES = [
  checkSpelling,
  checkPastTense,
  checkPronounCase,
  checkSubjectVerbAgreement,
  checkPresentContinuous,
  checkPrepositionUsage,
  checkActiveToPassive,
  checkCapitalization,
  checkArticleUsage,
  checkDoubleNegative,
  checkTerminalPunctuation,
];

export function runRules(sanitizedText, taggedWords) {
  const violations = [];

  for (const ruleFn of RULES) {
    const result = ruleFn(sanitizedText, taggedWords);
    if (!result) continue;

    // Some rules (like spelling and subjectVerbAgreement) can return
    // multiple violations as an array. Others still return a single
    // violation object. Handle both shapes until every rule has been
    // converted to the array style.
    if (Array.isArray(result)) {
      violations.push(...result);
    } else {
      violations.push(result);
    }
  }

  return violations;
}