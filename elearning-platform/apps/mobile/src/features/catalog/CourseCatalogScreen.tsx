import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenCard } from "../../components/ScreenCard";
import { theme } from "../../theme";


type Course = {
  id: string;
  title: string;
  summary: string;
};

export function CourseCatalogScreen({
  courses,
  onOpenCourse
}: {
  courses: Course[];
  onOpenCourse: (courseId: string) => void;
}) {
  return (
    <FlatList<Course>
      data={courses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Offline-first catalog</Text>
          <Text style={styles.title}>Cached courses stay available on poor connections.</Text>
        </View>
      }
      renderItem={({ item }: { item: Course }) => (
        <ScreenCard>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <Pressable style={styles.button} onPress={() => onOpenCourse(item.id)}>
            <Text style={styles.buttonText}>Open learning session</Text>
          </Pressable>
        </ScreenCard>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
    paddingBottom: 24
  },
  header: {
    gap: 10,
    marginBottom: 8
  },
  eyebrow: {
    color: theme.colors.teal,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.ink
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.ink
  },
  summary: {
    color: theme.colors.muted,
    lineHeight: 22
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.ink,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  buttonText: {
    color: "white",
    fontWeight: "700"
  }
});
