import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BentoSection, LevelPath } from "@/components/home/HomeSections";
import { LEVELS, LESSONS } from "@/content/curriculum";

export const metadata: Metadata = {
  title: "De cero a experto en agentes de IA",
  description: "Plan de estudios en cuatro niveles con tutor de IA y voz en castellano, portugués de Brasil y catalán.",
  alternates: { canonical: "/" },
};

/** Datos estructurados (schema.org) para buscadores y asistentes. */
function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "LinguaForge: agentes de IA de cero a experto",
    description: "Cuatro niveles: fundamentos web para IA, prompts, arquitectura de agentes y producción.",
    provider: { "@type": "Organization", name: "LinguaForge", url: "https://github.com/belentani7/linguaforge" },
    inLanguage: ["es", "pt-BR", "ca"],
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
    numberOfCredits: LEVELS.length,
    numberOfLessons: LESSONS.length,
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <BentoSection />
      <LevelPath />
    </>
  );
}
