import { View, Text, StyleSheet } from "react-native";

const STAGE_COLORS = {
  Sanitization: "#1098AD",
  "Tokenization & POS Tagging": "#4C6EF5",
  "Rule Matching": "#F03E3E",
  Correction: "#12B886",
  Assembly: "#7048E8",
};

export default function RuleCard({ step }) {
  const accentColor = STAGE_COLORS[step.stage] || "#868E96";
  const noChange = step.actionTaken === "No change needed";

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <Text style={[styles.stageLabel, { color: accentColor }]}>{step.stage}</Text>
      <Text style={styles.actionTaken}>{step.actionTaken}</Text>

      {!noChange && step.grammarReferenceRule ? (
        <>
          <Text style={styles.ruleRef}>{step.grammarReferenceRule}</Text>
          <View style={styles.segmentRow}>
            <View style={styles.segmentBlock}>
              <Text style={styles.segmentLabel}>Original</Text>
              <Text style={styles.originalSegment}>{step.originalSegment}</Text>
            </View>
            <View style={styles.segmentBlock}>
              <Text style={styles.segmentLabel}>Corrected</Text>
              <Text style={styles.correctedSegment}>{step.correctedSegment}</Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  stageLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  actionTaken: { fontSize: 14, color: "#1a1a1a", marginBottom: 6 },
  ruleRef: { fontSize: 12, fontStyle: "italic", color: "#495057", marginBottom: 8 },
  segmentRow: { flexDirection: "row", gap: 10 },
  segmentBlock: { flex: 1 },
  segmentLabel: { fontSize: 10, fontWeight: "700", color: "#868E96", marginBottom: 2 },
  originalSegment: { fontSize: 13, color: "#F03E3E", textDecorationLine: "line-through" },
  correctedSegment: { fontSize: 13, color: "#12B886", fontWeight: "600" },
});