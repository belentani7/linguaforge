"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const XP_PER_LESSON = 50;

/**
 * Progreso local del alumno (sin cuenta). Se persiste en localStorage.
 * La sincronización con servidor se añadiría detrás de esta misma interfaz.
 */
interface ProgressState {
  completed: string[];
  xp: number;
  streakDays: number;
  lastActiveDay: string | null;
  completeLesson: (lessonId: string, day?: string) => boolean;
  touchDay: (day?: string) => void;
  reset: () => void;
}

export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function previousDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return dayKey(d);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      xp: 0,
      streakDays: 0,
      lastActiveDay: null,
      completeLesson: (lessonId, day = dayKey()) => {
        const state = get();
        if (state.completed.includes(lessonId)) return false;
        set({ completed: [...state.completed, lessonId], xp: state.xp + XP_PER_LESSON });
        get().touchDay(day);
        return true;
      },
      touchDay: (day = dayKey()) => {
        const { lastActiveDay, streakDays } = get();
        if (lastActiveDay === day) return;
        const streak = lastActiveDay === previousDay(day) ? streakDays + 1 : 1;
        set({ lastActiveDay: day, streakDays: streak });
      },
      reset: () => set({ completed: [], xp: 0, streakDays: 0, lastActiveDay: null }),
    }),
    { name: "linguaforge:progress", version: 1 },
  ),
);
