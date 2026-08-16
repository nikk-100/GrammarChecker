import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function InputBar({ onSubmit }) {
  const [inputText, setInputText] = useState("");

  function handleSubmit() {
    if (inputText.trim().length === 0) return;
    onSubmit(inputText.trim());
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a sentence to analyze..."
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e9ecef" },
  input: { borderWidth: 1, borderColor: "#dee2e6", borderRadius: 8, padding: 10, fontSize: 15, minHeight: 44, marginBottom: 8 },
  button: { backgroundColor: "#4C6EF5", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});