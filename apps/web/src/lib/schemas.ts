import { z } from "zod";
import { LOCALES } from "@/content/types";

/** Contratos de entrada de la API. Son la fuente de verdad para CONTRATO_API.md. */

export const localeSchema = z.enum(LOCALES);

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const tutorChatRequestSchema = z.object({
  lessonId: z.string().min(1).max(64),
  messages: z.array(chatMessageSchema).min(1).max(20),
  chatLocale: localeSchema.default("es"),
  theoryLocale: localeSchema.default("es"),
  codeLocale: localeSchema.default("es"),
  code: z.string().max(20000).optional(),
  hintsShown: z.number().int().min(0).max(10).default(0),
});
export type TutorChatRequest = z.infer<typeof tutorChatRequestSchema>;

export const reviewRequestSchema = z.object({
  code: z.string().max(20000),
  locale: localeSchema.default("es"),
});

export const voiceTokenRequestSchema = z.object({
  lessonId: z.string().min(1).max(64),
  locale: localeSchema.default("es"),
});

export const runResultSchema = z.object({
  lessonId: z.string().min(1).max(64),
  passed: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
});
