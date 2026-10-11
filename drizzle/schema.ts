import {
  bigint,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Esquema MySQL/TiDB de LinguaForge (Drizzle).
 *
 * Principios:
 * - Sin datos personales obligatorios: el identificador es un UUID de sesión local.
 * - Un único registro por (usuario, lección) y (usuario, proyecto): las escrituras son idempotentes.
 * - Las marcas de tiempo se guardan en UTC; la racha se calcula con la zona horaria del usuario.
 */

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  displayName: varchar("display_name", { length: 80 })
    .notNull()
    .default("Estudiante"),
  timeZone: varchar("time_zone", { length: 64 })
    .notNull()
    .default("Europe/Madrid"),
  createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
});

export const learnerProfiles = mysqlTable("learner_profiles", {
  userId: varchar("user_id", { length: 36 }).primaryKey(),
  nativeLanguageCode: varchar("native_language_code", { length: 12 })
    .notNull()
    .default("es"),
  targetLanguageCode: varchar("target_language_code", { length: 12 })
    .notNull()
    .default("en"),
  learningGoal: varchar("learning_goal", { length: 40 }),
  companionGoal: varchar("companion_goal", { length: 80 }),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .notNull()
    .defaultNow()
    .onUpdateNow(),
});

export const diagnostics = mysqlTable("diagnostics", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  targetLanguageCode: varchar("target_language_code", { length: 12 }).notNull(),
  learningGoal: varchar("learning_goal", { length: 40 }).notNull(),
  recommendedLevel: varchar("recommended_level", { length: 4 }).notNull(),
  averageScore: int("average_score").notNull(),
  skillCount: int("skill_count").notNull(),
  scoresJson: json("scores_json").notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
});

export const lessonCompletions = mysqlTable(
  "lesson_completions",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
    lessonId: varchar("lesson_id", { length: 80 }).notNull(),
    bestScore: int("best_score").notNull(),
    completedAt: timestamp("completed_at", { fsp: 3 }).notNull().defaultNow(),
  },
  table => [primaryKey({ columns: [table.userId, table.lessonId] })]
);

export const projectSubmissions = mysqlTable(
  "project_submissions",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
    projectId: varchar("project_id", { length: 80 }).notNull(),
    artifact: text("artifact").notNull(),
    reflection: text("reflection").notNull(),
    status: mysqlEnum("status", ["draft", "completed"]).notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  table => [primaryKey({ columns: [table.userId, table.projectId] })]
);
