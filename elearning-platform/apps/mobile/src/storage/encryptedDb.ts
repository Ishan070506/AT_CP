import SQLite from "react-native-sqlcipher-storage";


SQLite.enablePromise(true);

type ProgressMutation = {
  enrollmentId: string;
  unitId: string;
  lastWatchedSecond: number;
  lastSlideIndex: number;
  completionPercent: number;
  attentionScore: number;
};

let database: SQLite.SQLiteDatabase | null = null;

export async function initEncryptedDb(passphrase: string) {
  if (database) {
    return database;
  }
  database = await SQLite.openDatabase({
    name: "elearning.db",
    key: passphrase,
    location: "default"
  });
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS course_cache (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS progress_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id TEXT NOT NULL,
      unit_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS enrollment_snapshot (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  return database;
}

export async function cacheCourses(courses: Array<{ id: string; title: string; summary: string }>) {
  if (!database) {
    throw new Error("Database not initialized");
  }
  for (const course of courses) {
    await database.executeSql(
      "REPLACE INTO course_cache (id, title, summary, payload, updated_at) VALUES (?, ?, ?, ?, datetime('now'))",
      [course.id, course.title, course.summary, JSON.stringify(course)]
    );
  }
}

export async function getCachedCourses() {
  if (!database) {
    throw new Error("Database not initialized");
  }
  const [result] = await database.executeSql("SELECT payload FROM course_cache ORDER BY updated_at DESC");
  const courses: Array<Record<string, unknown>> = [];
  for (let index = 0; index < result.rows.length; index += 1) {
    courses.push(JSON.parse(result.rows.item(index).payload));
  }
  return courses;
}

export async function enqueueProgressMutation(mutation: ProgressMutation) {
  if (!database) {
    throw new Error("Database not initialized");
  }
  await database.executeSql(
    "INSERT INTO progress_queue (enrollment_id, unit_id, payload, synced, created_at) VALUES (?, ?, ?, 0, datetime('now'))",
    [mutation.enrollmentId, mutation.unitId, JSON.stringify(mutation)]
  );
}

export async function getPendingProgressMutations() {
  if (!database) {
    throw new Error("Database not initialized");
  }
  const [result] = await database.executeSql("SELECT id, payload FROM progress_queue WHERE synced = 0 ORDER BY id ASC");
  const queue: Array<{ id: number; payload: ProgressMutation }> = [];
  for (let index = 0; index < result.rows.length; index += 1) {
    const item = result.rows.item(index);
    queue.push({ id: item.id, payload: JSON.parse(item.payload) });
  }
  return queue;
}

export async function markProgressMutationSynced(id: number) {
  if (!database) {
    throw new Error("Database not initialized");
  }
  await database.executeSql("UPDATE progress_queue SET synced = 1 WHERE id = ?", [id]);
}
