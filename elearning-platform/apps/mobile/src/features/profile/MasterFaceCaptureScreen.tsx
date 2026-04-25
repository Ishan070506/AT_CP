import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenCard } from "../../components/ScreenCard";
import { uploadMasterFace } from "../../services/api";
import { theme } from "../../theme";


export function MasterFaceCaptureScreen({
  tenantId,
  accessToken
}: {
  tenantId: string;
  accessToken: string;
}) {
  async function submitFaceTemplate() {
    await uploadMasterFace(tenantId, accessToken, {
      imageKey: "tenant/master-faces/user-1.jpg",
      embedding: Array.from({ length: 32 }, (_, index) => Number((0.01 * (index + 1)).toFixed(2))),
      captureDevice: "react-native"
    });
  }

  return (
    <View style={styles.layout}>
      <ScreenCard>
        <Text style={styles.eyebrow}>First login capture</Text>
        <Text style={styles.title}>Store the learner’s master face reference.</Text>
        <Text style={styles.copy}>
          This screen is the handoff point for a production camera + face embedding SDK. Once an embedding is produced, it posts to the Django monitoring service.
        </Text>
        <Pressable style={styles.button} onPress={submitFaceTemplate}>
          <Text style={styles.buttonText}>Submit sample face template</Text>
        </Pressable>
      </ScreenCard>
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
  button: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonText: {
    color: "white",
    fontWeight: "700"
  }
});
