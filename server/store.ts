import fs from "node:fs";
import path from "node:path";

/**
 * Repositorio de aprendizaje. Su forma refleja drizzle/schema.ts, de modo que una
 * implementación MySQL/TiDB puede sustituir a MemoryLearningStore sin tocar los routers.
 *
 * Estado actual: MemoryLearningStore, con persistencia JSON opcional para desarrollo local.
 * La implementación MySQL aún NO existe (ver docs/ y el informe de la auditoría).
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

  private persist() {
    if (!this.filePath) return;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.filePath);
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
