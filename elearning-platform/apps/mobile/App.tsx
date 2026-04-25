import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { CourseCatalogScreen } from "./src/features/catalog/CourseCatalogScreen";
import { MasterFaceCaptureScreen } from "./src/features/profile/MasterFaceCaptureScreen";
import { LearningSessionScreen } from "./src/features/session/LearningSessionScreen";
import { fetchCourseCatalog } from "./src/services/api";
import { flushProgressQueue } from "./src/services/sync";
import { cacheCourses, getCachedCourses, initEncryptedDb } from "./src/storage/encryptedDb";
import { theme } from "./src/theme";


const tenantId = "demo-tenant";
const accessToken = "replace-with-jwt";
const dbPassphrase = "replace-with-mdm-provisioned-aes256-key";

type Screen = "catalog" | "session" | "capture";

export default function App() {
  const [screen, setScreen] = useState<Screen>("catalog");
  const [courses, setCourses] = useState<Array<{ id: string; title: string; summary: string }>>([]);

  useEffect(() => {
    async function bootstrap() {
      await initEncryptedDb(dbPassphrase);
      try {
        const liveCourses = await fetchCourseCatalog(tenantId);
        await cacheCourses(liveCourses);
        setCourses(liveCourses);
      } catch {
        const cachedCourses = await getCachedCourses();
        setCourses(cachedCourses as Array<{ id: string; title: string; summary: string }>);
      }
      await flushProgressQueue(tenantId, accessToken);
    }

    void bootstrap();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>EL</Text>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Enterprise Learning Mobile</Text>
            <Text style={styles.headerSubtitle}>Encrypted offline access with integrity checkpoints</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <Pressable style={styles.tab} onPress={() => setScreen("catalog")}>
            <Text style={styles.tabLabel}>Catalog</Text>
          </Pressable>
          <Pressable style={styles.tab} onPress={() => setScreen("session")}>
            <Text style={styles.tabLabel}>Session</Text>
          </Pressable>
          <Pressable style={styles.tab} onPress={() => setScreen("capture")}>
            <Text style={styles.tabLabel}>Master face</Text>
          </Pressable>
        </View>

        {screen === "catalog" ? <CourseCatalogScreen courses={courses} onOpenCourse={() => setScreen("session")} /> : null}
        {screen === "session" ? <LearningSessionScreen onBack={() => setScreen("catalog")} /> : null}
        {screen === "capture" ? <MasterFaceCaptureScreen tenantId={tenantId} accessToken={accessToken} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  container: {
    padding: 20,
    gap: 18
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  brand: {
    width: 48,
    height: 48,
    borderRadius: 18,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    color: "white",
    backgroundColor: theme.colors.teal,
    fontWeight: "800",
    lineHeight: 48
  },
  headerCopy: {
    gap: 4
  },
  headerTitle: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: "800"
  },
  headerSubtitle: {
    color: theme.colors.muted
  },
  tabRow: {
    flexDirection: "row",
    gap: 10
  },
  tab: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  tabLabel: {
    color: theme.colors.ink,
    fontWeight: "700"
  }
});
