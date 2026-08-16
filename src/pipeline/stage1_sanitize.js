export function sanitize(rawText) {
  let text = rawText.trim();
  text = text.replace(/\s+/g, " ");
  text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  return text;
}