import { describe, expect, it } from "vitest";
import { LEARNING_PROJECTS } from "../shared/content";
import { LANGUAGE_CATALOG, CEFR_LEVELS, CURRICULUM_LESSONS, INSTITUTION_FACULTIES, LEARNING_GOALS, recommendInstitutionalPath } from "../shared/institution";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: { clearCookie: () => undefined },
} as unknown as TrpcContext;

describe("dominio institucional de aprendizaje", () => {
  it("mantiene exactamente 39 idiomas de estudio únicos, incluidos árabe y urdu RTL", () => {
    expect(LANGUAGE_CATALOG).toHaveLength(39);
    expect(new Set(LANGUAGE_CATALOG.map((language) => language.code)).size).toBe(39);
    expect(LANGUAGE_CATALOG.find((language) => language.code === "ar")?.direction).toBe("rtl");
    expect(LANGUAGE_CATALOG.find((language) => language.code === "ur")?.direction).toBe("rtl");
  });

  it("mantiene los seis niveles CEFR ordenados de A1 a C2", () => {
    expect(CEFR_LEVELS.map((level) => level.code)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
  });

  it("asigna al menos una lección verificable a cada ruta institucional", () => {
    const goalsWithLessons = new Set(CURRICULUM_LESSONS.map((lesson) => lesson.goalId));
    LEARNING_GOALS.forEach((goal) => expect(goalsWithLessons.has(goal.id)).toBe(true));
    CURRICULUM_LESSONS.forEach((lesson) => {
      expect(lesson.objective.length).toBeGreaterThan(15);
      expect(lesson.expected.length).toBeGreaterThan(10);
    });
  });

  it("conserva seis facultades integradas y una recomendación complementaria determinista", () => {
    expect(INSTITUTION_FACULTIES).toHaveLength(6);
    const recommendation = recommendInstitutionalPath({ communication: 70, digital: 25, creation: 65, critical: 55, pathway: 40 });
    expect(recommendation.primaryGoal).toBe("digital-citizenship");
    expect(recommendation.companionGoal).toBe("professional-pathways");
  });

  it("asigna a cada facultad un desafío con entregables y criterios de revisión propios", () => {
    LEARNING_GOALS.forEach((goal) => {
      const project = LEARNING_PROJECTS.find((item) => item.goalId === goal.id);
      expect(project?.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(project?.criteria.length).toBeGreaterThanOrEqual(3);
      expect(project?.brief.length).toBeGreaterThan(40);
    });
  });

  it("publica el catálogo y permite filtrar lecciones sin autenticación", async () => {
    const caller = appRouter.createCaller(publicContext);
    const [languages, lessons] = await Promise.all([
      caller.institution.languages(),
      caller.institution.lessons({ goal: "coding", level: "A1" }),
    ]);
    expect(languages).toHaveLength(39);
    expect(lessons).toHaveLength(1);
    expect(lessons[0]).toMatchObject({ goalId: "coding", level: "A1" });
  });
});
