import { fileURLToPath } from "node:url";
import path from "node:path";
import { createDb } from "./client";
import { MysqlLearningStore } from "./mysql-store";
import { CURRICULUM_LESSONS } from "../../shared/institution";
import { LEARNING_PROJECTS } from "../../shared/content";

/**
 * Datos FICTICIOS para desarrollo. No contienen información personal real.
 * Los identificadores son deterministas, así que el seed es idempotente.
 */
type SeedLearner = {
  id: string;
  displayName: string;
  goal: string;
  scores: readonly number[];
  score: number;
};

export const SEED_LEARNERS: readonly SeedLearner[] = [
  {
    id: "seed-learner-001",
    displayName: "Alumna sintética A",
    goal: "everyday",
    scores: [72, 65, 80, 58],
    score: 88,
  },
  {
    id: "seed-learner-002",
    displayName: "Alumno sintético B",
    goal: "technology",
    scores: [45, 50, 52],
    score: 61,
  },
  {
    id: "seed-learner-003",
    displayName: "Alumna sintética C",
    goal: "coding",
    scores: [90, 85, 88, 92, 79],
    score: 97,
  },
];

export async function runSeed(url?: string) {
  const { db, pool, target } = createDb(url);
  const store = new MysqlLearningStore(db);
  const createdAt = new Date("2026-01-15T09:00:00.000Z");
  let inserted = 0;
  try {
    for (let index = 0; index < SEED_LEARNERS.length; index += 1) {
      const learner = SEED_LEARNERS[index];
      if (await store.getUser(learner.id)) continue;
      inserted += 1;
      await store.createUser({
        id: learner.id,
        displayName: learner.displayName,
        timeZone: "Europe/Madrid",
        createdAt: createdAt.toISOString(),
      });
      const skills: Record<string, number> = {};
      learner.scores.forEach((value, i) => {
        skills[`skill-${i + 1}`] = value;
      });
      const total = learner.scores.reduce((sum, value) => sum + value, 0);
      const average = Math.round(total / learner.scores.length);
      await store.saveDiagnostic(
        {
          userId: learner.id,
          nativeLanguageCode: "es",
          targetLanguageCode: "en",
          learningGoal: learner.goal,
          companionGoal: null,
        },
        {
          userId: learner.id,
          targetLanguageCode: "en",
          learningGoal: learner.goal,
          recommendedLevel: average >= 75 ? "B1" : average >= 55 ? "A2" : "A1",
          averageScore: average,
          skillCount: learner.scores.length,
          scores: skills,
          createdAt: createdAt.toISOString(),
        }
      );
      const lessons = CURRICULUM_LESSONS.slice(0, index + 2);
      for (const lesson of lessons)
        await store.recordCompletion(
          learner.id,
          lesson.id,
          learner.score,
          new Date(createdAt.getTime() + 86_400_000)
        );
      const project = LEARNING_PROJECTS[index % LEARNING_PROJECTS.length];
      await store.upsertSubmission({
        userId: learner.id,
        projectId: project.id,
        artifact: `Borrador ficticio para ${project.id}`,
        reflection: "Reflexión ficticia de desarrollo.",
        status: "draft",
        updatedAt: createdAt.toISOString(),
      });
    }
    return { database: target.database, inserted };
  } finally {
    await pool.end();
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  runSeed()
    .then(r =>
      console.log(
        `[db:seed] "${r.database}": ${r.inserted} alumnos ficticios nuevos.`
      )
    )
    .catch(error => {
      console.error(
        `[db:seed] ${error instanceof Error ? error.message : error}`
      );
      process.exit(1);
    });
}
