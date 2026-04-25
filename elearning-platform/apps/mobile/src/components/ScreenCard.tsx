import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "../theme";


export function ScreenCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12
  }
});
