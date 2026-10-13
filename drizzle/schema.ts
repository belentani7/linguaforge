import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  foreignKey,
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
 * - Integridad referencial: todo registro de aprendizaje depende de un usuario y se borra en cascada.
 * - Un único registro por (usuario, lección) y (usuario, proyecto): las escrituras son idempotentes.
 * - Restricciones de dominio (puntuaciones 0–100, código de idioma acotado) en la propia base.
 * - Marcas de tiempo en UTC; la racha se calcula con la zona horaria del usuario.
 */

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    displayName: varchar("display_name", { length: 80 })
      .notNull()
      .default("Estudiante"),
    timeZone: varchar("time_zone", { length: 64 })
      .notNull()
      .default("Europe/Madrid"),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
  },
  table => [
    check("users_time_zone_not_empty", sql`char_length(${table.timeZone}) > 0`),
  ]
);

export const learnerProfiles = mysqlTable(
  "learner_profiles",
  {
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
  },
  table => [
    foreignKey({
      name: "learner_profiles_user_fk",
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ]
);

export const diagnostics = mysqlTable(
  "diagnostics",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    targetLanguageCode: varchar("target_language_code", {
      length: 12,
    }).notNull(),
    learningGoal: varchar("learning_goal", { length: 40 }).notNull(),
    recommendedLevel: varchar("recommended_level", { length: 4 }).notNull(),
    averageScore: int("average_score").notNull(),
    skillCount: int("skill_count").notNull(),
    scoresJson: json("scores_json").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
  },
  table => [
    foreignKey({
      name: "diagnostics_user_fk",
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
    check(
      "diagnostics_average_range",
      sql`${table.averageScore} BETWEEN 0 AND 100`
    ),
    check("diagnostics_skill_count_positive", sql`${table.skillCount} >= 3`),
  ]
);

export const lessonCompletions = mysqlTable(
  "lesson_completions",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
    lessonId: varchar("lesson_id", { length: 80 }).notNull(),
    bestScore: int("best_score").notNull(),
    completedAt: timestamp("completed_at", { fsp: 3 }).notNull().defaultNow(),
  },
  table => [
    primaryKey({ columns: [table.userId, table.lessonId] }),
    foreignKey({
      name: "lesson_completions_user_fk",
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
    check(
      "lesson_completions_score_range",
      sql`${table.bestScore} BETWEEN 0 AND 100`
    ),
  ]
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
  table => [
    primaryKey({ columns: [table.userId, table.projectId] }),
    foreignKey({
      name: "project_submissions_user_fk",
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ]
);
