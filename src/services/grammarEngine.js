import { sanitize } from "../pipeline/stage1_sanitize";
import { tagWords } from "../pipeline/stage2_tag";
import { runRules } from "../pipeline/stage3_ruleEngine";
import { assembleCorrectedText } from "../pipeline/stage5_assemble";
import { validateSentence } from "../pipeline/stage6_validate";

export function analyzeSentence(inputText) {
  const sanitizedText = sanitize(inputText);
  const taggedWords = tagWords(sanitizedText);
  const violations = runRules(sanitizedText, taggedWords);
  const correctedText = assembleCorrectedText(sanitizedText, violations);
  const validationResult = validateSentence(correctedText);

  const pipelineSteps = [
    {
      stage: "Sanitization",
      actionTaken: sanitizedText === inputText ? "No change needed" : "Cleaned whitespace/punctuation",
      grammarReferenceRule: "",
      originalSegment: inputText,
      correctedSegment: sanitizedText,
    },
    {
      stage: "Tokenization & POS Tagging",
      actionTaken: `Tagged ${taggedWords.length} tokens`,
      grammarReferenceRule: "",
      originalSegment: "",
      correctedSegment: "",
    },
    ...violations,
    {
      stage: "Assembly",
      actionTaken: violations.length > 0 ? "Merged all corrections into final text" : "No change needed",
      grammarReferenceRule: "",
      originalSegment: sanitizedText,
      correctedSegment: correctedText,
    },
    validationResult,
  ];

  return {
    originalText: inputText,
    sanitizedText,
    partOfSpeechBreakdown: taggedWords,
    correctedText,
    isCorrect: violations.length === 0 && validationResult.isComplete,
    pipelineSteps,
  };
}