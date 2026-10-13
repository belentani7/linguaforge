import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, LESSONS } from "@/content/curriculum";
import { LessonWorkspace } from "@/components/workspace/LessonWorkspace";

type Params = { params: Promise<{ lessonId: string }> };

/** Pre-renderiza solo las lecciones publicadas. Las demás devuelven 404. */
export function generateStaticParams() {
  return LESSONS.filter((l) => l.status === "publicada").map((l) => ({ lessonId: l.id }));
}


export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) return { title: "No encontrada" };
  return {
    title: lesson.title.es,
    description: lesson.summary.es,
    alternates: { canonical: `/cursos/${lesson.id}` },
    openGraph: { title: lesson.title.es, description: lesson.summary.es, type: "article" },
  };
}

export default async function LessonPage({ params }: Params) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson || lesson.status !== "publicada") notFound();
  return <LessonWorkspace lesson={lesson} />;
}
