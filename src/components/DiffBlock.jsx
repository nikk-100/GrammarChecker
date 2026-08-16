import { View, Text, StyleSheet } from "react-native";

export default function DiffBlock({ originalText, correctedText, isCorrect }) {
  if (isCorrect) {
    return (
      <View style={[styles.block, styles.correctBlock]}>
        <Text style={styles.correctLabel}>✓ No errors found</Text>
        <Text style={styles.sentenceText}>{originalText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.label}>Original</Text>
      <Text style={styles.originalText}>{originalText}</Text>
      <Text style={[styles.label, { marginTop: 10 }]}>Corrected</Text>
      <Text style={styles.correctedText}>{correctedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 14 },
  correctBlock: { backgroundColor: "#EBFBEE" },
  label: { fontSize: 11, fontWeight: "700", color: "#868E96", textTransform: "uppercase" },
  correctLabel: { fontSize: 13, fontWeight: "700", color: "#12B886", marginBottom: 6 },
  sentenceText: { fontSize: 15, color: "#1a1a1a" },
  originalText: { fontSize: 15, color: "#F03E3E", textDecorationLine: "line-through" },
  correctedText: { fontSize: 15, color: "#12B886", fontWeight: "600" },
});