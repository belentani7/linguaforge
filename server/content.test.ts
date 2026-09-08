import { describe, expect, it } from "vitest";
import { detectLanguageSignal, lookupLocalGlossary, recommendResources, searchResources } from "../shared/content";
import { CURRICULUM_LESSONS } from "../shared/institution";
import { SUPPORTED_INTERFACE_LOCALES, resolveLocale, translate } from "../shared/i18n";

describe("content infrastructure", () => {
  it("searches curated resources by a meaningful term", () => {
    const matches = searchResources("verificación IA");
    expect(matches.some((resource) => resource.id === "guide-prompt-context")).toBe(true);
  });

  it("derives recommendations locally without repeating saved resources", () => {
    const recommended = recommendResources(["guide-prompt-context"], ["guide-safe-passwords"]);
    expect(recommended).toHaveLength(3);
    expect(recommended.some((resource) => resource.id === "guide-prompt-context")).toBe(false);
    expect(recommended.some((resource) => resource.id === "guide-safe-passwords")).toBe(false);
  });

  it("compares a bounded local LinguaForge glossary without simulating a general translator", () => {
    const entry = lookupLocalGlossary("source", "en");
    expect(entry?.translations.es).toBe("fuente");
    expect(lookupLocalGlossary("a phrase absent from the glossary", "en")).toBeUndefined();
  });

  it("keeps local language signals explicitly heuristic", () => {
    const result = detectLanguageSignal("مرحبا كيف حالك");
    expect(result.language).toContain("Árabe");
    expect(result.confidence).toBe("media");
  });

  it("normalizes locale variants and falls back safely", () => {
    expect(resolveLocale("pt-BR")).toBe("pt");
    expect(resolveLocale("zz-XX")).toBe("es");
    expect(translate("en-US", "nav.labs")).toBe("Labs");
  });

  it("exposes the full 39-language interface catalog without claiming all translations", () => {
    expect(SUPPORTED_INTERFACE_LOCALES).toHaveLength(39);
    expect(SUPPORTED_INTERFACE_LOCALES.some((locale) => locale.code === "ar" && locale.translationAvailable === false)).toBe(true);
  });

  it("offers real, brief activity contexts for the voluntary voice-practice entry", () => {
    const oralActivities = CURRICULUM_LESSONS.filter((lesson) => ["dialogue", "practice", "reflection"].includes(lesson.activity));
    expect(oralActivities.length).toBeGreaterThanOrEqual(4);
    oralActivities.forEach((lesson) => {
      expect(lesson.prompt.length).toBeGreaterThan(20);
      expect(lesson.expected.length).toBeGreaterThan(15);
    });
  });
});
