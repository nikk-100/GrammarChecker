import { View, Text, StyleSheet } from "react-native";
import { getPosColor } from "../constants/posColors";

export default function POSChip({ word, tag }) {
  const chipColor = getPosColor(tag);

  return (
    <View style={[styles.chip, { borderColor: chipColor }]}>
      <Text style={styles.word}>{word}</Text>
      <Text style={[styles.tag, { color: chipColor }]}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  word: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  tag: { fontSize: 10, fontWeight: "700", marginTop: 2, letterSpacing: 0.5 },
});