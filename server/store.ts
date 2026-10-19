import fs from "node:fs";
import path from "node:path";

/**
 * Repositorio de aprendizaje. Su forma refleja drizzle/schema.ts, de modo que una
 * implementación MySQL/TiDB puede sustituir a MemoryLearningStore sin tocar los routers.
 *
 * Implementaciones: MemoryLearningStore (JSON opcional, por defecto) y MysqlLearningStore
 * (server/db/mysql-store.ts, sólo desarrollo; se activa con LF_STORE=mysql y DATABASE_URL).
 */

export type UserRecord = {
  id: string;
  displayName: string;
  timeZone: string;
  createdAt: string;
};
export type ProfileRecord = {
  userId: string;
  nativeLanguageCode: string;
  targetLanguageCode: string;
  learningGoal: string | null;
  companionGoal: string | null;
};
export type CompletionRecord = {
  userId: string;
  lessonId: string;
  bestScore: number;
  completedAt: string;
};
export type DiagnosticRecord = {
  id: number;
  userId: string;
  targetLanguageCode: string;
  learningGoal: string;
  recommendedLevel: string;
  averageScore: number;
  skillCount: number;
  scores: Record<string, number>;
  createdAt: string;
};
export type SubmissionRecord = {
  userId: string;
  projectId: string;
  artifact: string;
  reflection: string;
  status: "draft" | "completed";
  updatedAt: string;
};

export interface LearningStore {
  createUser(user: UserRecord): Promise<void>;
  getUser(id: string): Promise<UserRecord | null>;
  getProfile(userId: string): Promise<ProfileRecord | null>;
  upsertProfile(profile: ProfileRecord): Promise<void>;
  /** Idempotente: conserva la mejor puntuación y no duplica la finalización. */
  recordCompletion(
    userId: string,
    lessonId: string,
    score: number,
    at: Date
  ): Promise<CompletionRecord>;
  listCompletions(userId: string): Promise<CompletionRecord[]>;
  /** Atómico: actualiza el perfil y registra el diagnóstico, o no cambia nada. */
  saveDiagnostic(
    profile: ProfileRecord,
    diagnostic: Omit<DiagnosticRecord, "id">
  ): Promise<DiagnosticRecord>;
  addDiagnostic(
    diagnostic: Omit<DiagnosticRecord, "id">
  ): Promise<DiagnosticRecord>;
  latestDiagnostic(userId: string): Promise<DiagnosticRecord | null>;
  upsertSubmission(submission: SubmissionRecord): Promise<SubmissionRecord>;
  listSubmissions(userId: string): Promise<SubmissionRecord[]>;
}

type Snapshot = {
  users: UserRecord[];
  profiles: ProfileRecord[];
  completions: CompletionRecord[];
  diagnostics: DiagnosticRecord[];
  submissions: SubmissionRecord[];
  nextDiagnosticId: number;
};

const emptySnapshot = (): Snapshot => ({
  users: [],
  profiles: [],
  completions: [],
  diagnostics: [],
  submissions: [],
  nextDiagnosticId: 1,
});

export class MemoryLearningStore implements LearningStore {
  private data: Snapshot;

  /** Si `filePath` se indica, el estado se carga y se guarda de forma atómica en ese JSON. */
  constructor(private readonly filePath?: string) {
    this.data =
      filePath && fs.existsSync(filePath)
        ? (JSON.parse(fs.readFileSync(filePath, "utf8")) as Snapshot)
        : emptySnapshot();
  }

  private persist(snapshot: Snapshot = this.data) {
    if (!this.filePath) return;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    try {
      fs.writeFileSync(tmp, JSON.stringify(snapshot, null, 2));
      fs.renameSync(tmp, this.filePath);
    } catch (error) {
      // Discard an incomplete temporary write without masking the original error.
      try { fs.rmSync(tmp, { force: true }); } catch { /* preserve original error */ }
      throw error;
    }
  }

  async createUser(user: UserRecord) {
    this.data.users.push(user);
    this.persist();
  }

  async getUser(id: string) {
    return this.data.users.find(user => user.id === id) ?? null;
  }

  async getProfile(userId: string) {
    return (
      this.data.profiles.find(profile => profile.userId === userId) ?? null
    );
  }

  async upsertProfile(profile: ProfileRecord) {
    const index = this.data.profiles.findIndex(
      item => item.userId === profile.userId
    );
    if (index >= 0) this.data.profiles[index] = profile;
    else this.data.profiles.push(profile);
    this.persist();
  }

  async recordCompletion(
    userId: string,
    lessonId: string,
    score: number,
    at: Date
  ) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new RangeError("completion_score_out_of_range");
    }
    if (Number.isNaN(at.getTime())) throw new RangeError("completion_date_invalid");
    const existing = this.data.completions.find(
      item => item.userId === userId && item.lessonId === lessonId
    );
    if (existing) {
      existing.bestScore = Math.max(existing.bestScore, score);
    } else {
      this.data.completions.push({
        userId,
        lessonId,
        bestScore: score,
        completedAt: at.toISOString(),
      });
    }
    this.persist();
    return this.data.completions.find(
      item => item.userId === userId && item.lessonId === lessonId
    )!;
  }

  async listCompletions(userId: string) {
    return this.data.completions.filter(item => item.userId === userId);
  }

  async saveDiagnostic(
    profile: ProfileRecord,
    diagnostic: Omit<DiagnosticRecord, "id">
  ) {
    if (diagnostic.skillCount < 3) throw new Error("skill_count_below_minimum");
    if (profile.userId !== diagnostic.userId) throw new Error("diagnostic_user_mismatch");

    // Stage both records outside active memory. Publish only after the complete
    // snapshot has been persisted: an I/O failure must not partially update state.
    const staged = structuredClone(this.data);
    const index = staged.profiles.findIndex(item => item.userId === profile.userId);
    if (index >= 0) staged.profiles[index] = profile;
    else staged.profiles.push(profile);
    const record: DiagnosticRecord = { ...diagnostic, id: staged.nextDiagnosticId++ };
    staged.diagnostics.push(record);
    this.persist(staged);
    this.data = staged;
    return record;
  }

  async addDiagnostic(diagnostic: Omit<DiagnosticRecord, "id">) {
    const record: DiagnosticRecord = {
      ...diagnostic,
      id: this.data.nextDiagnosticId++,
    };
    this.data.diagnostics.push(record);
    this.persist();
    return record;
  }

  async latestDiagnostic(userId: string) {
    const mine = this.data.diagnostics.filter(item => item.userId === userId);
    return mine.length ? mine[mine.length - 1] : null;
  }

  async upsertSubmission(submission: SubmissionRecord) {
    const index = this.data.submissions.findIndex(
      item =>
        item.userId === submission.userId &&
        item.projectId === submission.projectId
    );
    if (index >= 0) this.data.submissions[index] = submission;
    else this.data.submissions.push(submission);
    this.persist();
    return submission;
  }

  async listSubmissions(userId: string) {
    return this.data.submissions.filter(item => item.userId === userId);
  }
}
