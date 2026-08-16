import { checkSpelling } from "./rules/spelling";
import { checkCapitalization } from "./rules/capitalization";
import { checkTerminalPunctuation } from "./rules/terminalPunctuation";
import { checkArticleUsage } from "./rules/articleUsage";
import { checkDoubleNegative } from "./rules/doubleNegative";

const RULES = [
  checkSpelling,
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

    // Some rules (like spelling) can return multiple violations as an array.
    // Others still return a single violation object. Handle both shapes
    // until every rule has been converted to the array style.
    if (Array.isArray(result)) {
      violations.push(...result);
    } else {
      violations.push(result);
    }
  }

  return violations;
}