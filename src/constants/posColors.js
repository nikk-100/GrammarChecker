export const POS_COLORS = {
  NOUN: "#4C6EF5",
  VERB: "#F03E3E",
  ADJ: "#F59F00",
  ADV: "#7048E8",
  PRON: "#12B886",
  PREP: "#E64980",
  CONJ: "#495057",
  DET: "#1098AD",
  INTERJ: "#F76707",
  DEFAULT: "#868E96",
};

export function getPosColor(tag) {
  return POS_COLORS[tag] || POS_COLORS.DEFAULT;
}