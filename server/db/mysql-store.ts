import { and, eq, sql } from "drizzle-orm";
import type {
  LearningStore,
  CompletionRecord,
  DiagnosticRecord,
  ProfileRecord,
  SubmissionRecord,
  UserRecord,
} from "../store";
import * as schema from "../../drizzle/schema";
import type { Db } from "./client";

const {
  users,
  learnerProfiles,
  diagnostics,
  lessonCompletions,
  projectSubmissions,
} = schema;

/**
 * Repositorio MySQL/MariaDB (desarrollo). La lógica de negocio vive en los routers;
 * aquí sólo hay acceso a datos. Cada método es idempotente cuando el contrato lo exige.
 */
export class MysqlLearningStore implements LearningStore {
  constructor(private readonly db: Db) {}

  async createUser(user: UserRecord) {
    await this.db.insert(users).values({
      id: user.id,
      displayName: user.displayName,
      timeZone: user.timeZone,
      createdAt: new Date(user.createdAt),
    });
  }

  async getUser(id: string): Promise<UserRecord | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row
      ? {
          id: row.id,
          displayName: row.displayName,
          timeZone: row.timeZone,
          createdAt: row.createdAt.toISOString(),
        }
      : null;
  }

  async getProfile(userId: string): Promise<ProfileRecord | null> {
    const [row] = await this.db
      .select()
      .from(learnerProfiles)
      .where(eq(learnerProfiles.userId, userId))
      .limit(1);
    return row ? toProfile(row) : null;
  }

  async upsertProfile(profile: ProfileRecord) {
    await this.db
      .insert(learnerProfiles)
      .values(profile)
      .onDuplicateKeyUpdate({
        set: {
          nativeLanguageCode: profile.nativeLanguageCode,
          targetLanguageCode: profile.targetLanguageCode,
          learningGoal: profile.learningGoal,
          companionGoal: profile.companionGoal,
        },
      });
  }

  async saveDiagnostic(
    profile: ProfileRecord,
    diagnostic: Omit<DiagnosticRecord, "id">
  ): Promise<DiagnosticRecord> {
    // Transacción: si el INSERT del diagnóstico falla (p. ej. CHECK), el perfil NO cambia.
    return this.db.transaction(async tx => {
      const repo = new MysqlLearningStore(tx as unknown as Db);
      await repo.upsertProfile(profile);
      return repo.addDiagnostic(diagnostic);
    });
  }

  async recordCompletion(
    userId: string,
    lessonId: string,
    score: number,
    at: Date
  ): Promise<CompletionRecord> {
    await this.db
      .insert(lessonCompletions)
      .values({ userId, lessonId, bestScore: score, completedAt: at })
      .onDuplicateKeyUpdate({
        // Conserva la mejor puntuación; la fecha de la primera finalización no se pisa.
        set: {
          bestScore: sql`GREATEST(${lessonCompletions.bestScore}, ${score})`,
        },
      });
    const [row] = await this.db
      .select()
      .from(lessonCompletions)
      .where(
        and(
          eq(lessonCompletions.userId, userId),
          eq(lessonCompletions.lessonId, lessonId)
        )
      )
      .limit(1);
    return toCompletion(row);
  }

  async listCompletions(userId: string): Promise<CompletionRecord[]> {
    const rows = await this.db
      .select()
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, userId));
    return rows.map(toCompletion);
  }

  async addDiagnostic(
    diagnostic: Omit<DiagnosticRecord, "id">
  ): Promise<DiagnosticRecord> {
    const result = await this.db.insert(diagnostics).values({
      userId: diagnostic.userId,
      targetLanguageCode: diagnostic.targetLanguageCode,
      learningGoal: diagnostic.learningGoal,
      recommendedLevel: diagnostic.recommendedLevel,
      averageScore: diagnostic.averageScore,
      skillCount: diagnostic.skillCount,
      scoresJson: diagnostic.scores,
      createdAt: new Date(diagnostic.createdAt),
    });
    const id = Number(result[0].insertId);
    return { ...diagnostic, id };
  }

  async latestDiagnostic(userId: string): Promise<DiagnosticRecord | null> {
    const [row] = await this.db
      .select()
      .from(diagnostics)
      .where(eq(diagnostics.userId, userId))
      .orderBy(sql`${diagnostics.createdAt} DESC, ${diagnostics.id} DESC`)
      .limit(1);
    return row ? toDiagnostic(row) : null;
  }

  async upsertSubmission(
    submission: SubmissionRecord
  ): Promise<SubmissionRecord> {
    await this.db
      .insert(projectSubmissions)
      .values({
        userId: submission.userId,
        projectId: submission.projectId,
        artifact: submission.artifact,
        reflection: submission.reflection,
        status: submission.status,
      })
      .onDuplicateKeyUpdate({
        set: {
          artifact: submission.artifact,
          reflection: submission.reflection,
          status: submission.status,
        },
      });
    const [row] = await this.db
      .select()
      .from(projectSubmissions)
      .where(
        and(
          eq(projectSubmissions.userId, submission.userId),
          eq(projectSubmissions.projectId, submission.projectId)
        )
      )
      .limit(1);
    return toSubmission(row);
  }

  async listSubmissions(userId: string): Promise<SubmissionRecord[]> {
    const rows = await this.db
      .select()
      .from(projectSubmissions)
      .where(eq(projectSubmissions.userId, userId));
    return rows.map(toSubmission);
  }
}

type ProfileRow = typeof learnerProfiles.$inferSelect;
type CompletionRow = typeof lessonCompletions.$inferSelect;
type DiagnosticRow = typeof diagnostics.$inferSelect;
type SubmissionRow = typeof projectSubmissions.$inferSelect;

const toProfile = (row: ProfileRow): ProfileRecord => ({
  userId: row.userId,
  nativeLanguageCode: row.nativeLanguageCode,
  targetLanguageCode: row.targetLanguageCode,
  learningGoal: row.learningGoal,
  companionGoal: row.companionGoal,
});
const toCompletion = (row: CompletionRow): CompletionRecord => ({
  userId: row.userId,
  lessonId: row.lessonId,
  bestScore: row.bestScore,
  completedAt: row.completedAt.toISOString(),
});
const toDiagnostic = (row: DiagnosticRow): DiagnosticRecord => ({
  id: row.id,
  userId: row.userId,
  targetLanguageCode: row.targetLanguageCode,
  learningGoal: row.learningGoal,
  recommendedLevel: row.recommendedLevel,
  averageScore: row.averageScore,
  skillCount: row.skillCount,
  scores: row.scoresJson as Record<string, number>,
  createdAt: row.createdAt.toISOString(),
});
const toSubmission = (row: SubmissionRow): SubmissionRecord => ({
  userId: row.userId,
  projectId: row.projectId,
  artifact: row.artifact,
  reflection: row.reflection,
  status: row.status,
  updatedAt: row.updatedAt.toISOString(),
});
