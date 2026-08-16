import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { analyzeSentence } from "../src/services/grammarEngine";
import InputBar from "../src/components/InputBar";
import POSChip from "../src/components/POSChip";
import RuleCard from "../src/components/RuleCard";
import DiffBlock from "../src/components/DiffBlock";

export default function HomeScreen() {
  const [result, setResult] = useState(null);

  function handleAnalyze(text) {
    const analysis = analyzeSentence(text);
    setResult(analysis);
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {result && (
          <>
            <DiffBlock
              originalText={result.originalText}
              correctedText={result.correctedText}
              isCorrect={result.isCorrect}
            />

            <View style={styles.chipRow}>
              {result.partOfSpeechBreakdown.map((item, index) => (
                <POSChip key={index} word={item.word} tag={item.tag} />
              ))}
            </View>

            {result.pipelineSteps.map((step, index) => (
              <RuleCard key={index} step={step} />
            ))}
          </>
        )}
      </ScrollView>
      <InputBar onSubmit={handleAnalyze} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f3f5" },
  scroll: { flex: 1 },
  scrollContent: { padding: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 14 },
});