import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenCard } from "../../components/ScreenCard";
import { enqueueProgressMutation } from "../../storage/encryptedDb";
import { theme } from "../../theme";


export function LearningSessionScreen({ onBack }: { onBack: () => void }) {
  async function saveOfflineCheckpoint() {
    await enqueueProgressMutation({
      enrollmentId: "enrollment-1",
      unitId: "unit-1",
      lastWatchedSecond: 512,
      lastSlideIndex: 0,
      completionPercent: 44,
      attentionScore: 0.82
    });
  }

  return (
    <View style={styles.layout}>
      <ScreenCard>
        <Text style={styles.eyebrow}>Learning session</Text>
        <Text style={styles.title}>Video progress persists locally before sync.</Text>
        <Text style={styles.copy}>
          Random face verification prompts and attention events can be generated on-device, queued, and synced without losing audit continuity.
        </Text>
        <Pressable style={styles.button} onPress={saveOfflineCheckpoint}>
          <Text style={styles.buttonText}>Save offline progress</Text>
        </Pressable>
      </ScreenCard>
      <ScreenCard>
        <Text style={styles.eyebrow}>Integrity status</Text>
        <Text style={styles.metric}>91%</Text>
        <Text style={styles.copy}>Face match healthy, single face detected, low-bandwidth mode active.</Text>
      </ScreenCard>
      <Pressable onPress={onBack}>
        <Text style={styles.backLink}>Back to catalog</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: 16
  },
  eyebrow: {
    color: theme.colors.teal,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.ink,
    fontSize: 26,
    fontWeight: "800"
  },
  copy: {
    color: theme.colors.muted,
    lineHeight: 22
  },
  metric: {
    color: theme.colors.ink,
    fontSize: 44,
    fontWeight: "800"
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.amber,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonText: {
    color: "white",
    fontWeight: "700"
  },
  backLink: {
    color: theme.colors.teal,
    fontWeight: "700"
  }
});
