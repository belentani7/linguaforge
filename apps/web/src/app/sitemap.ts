import type { MetadataRoute } from "next";
import { LESSONS } from "@/content/curriculum";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lessons = LESSONS.filter((l) => l.status === "publicada").map((l) => ({
    url: `${base}/cursos/${l.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/cursos`, changeFrequency: "weekly", priority: 0.9 },
    ...lessons,
  ];
}
