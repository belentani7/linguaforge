"use client";

import { create } from "zustand";

export type VoiceMode = "realtime" | "browser";
export type VoiceStatus = "idle" | "connecting" | "listening" | "speaking" | "error";

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Estado efímero del tutor: chat, voz y pistas mostradas. No se persiste. */
interface IaState {
  turns: ChatTurn[];
  streaming: boolean;
  voiceStatus: VoiceStatus;
  voiceMode: VoiceMode;
  lastVoiceText: string;
  hintsShown: number;
  addTurn: (turn: ChatTurn) => void;
  appendToLast: (delta: string) => void;
  setStreaming: (v: boolean) => void;
  setVoiceStatus: (s: VoiceStatus) => void;
  setVoiceMode: (m: VoiceMode) => void;
  setLastVoiceText: (t: string) => void;
  incrementHints: () => void;
  clearChat: (welcome?: ChatTurn) => void;
}

export const useIaStore = create<IaState>()((set) => ({
  turns: [],
  streaming: false,
  voiceStatus: "idle",
  voiceMode: "browser",
  lastVoiceText: "",
  hintsShown: 0,
  addTurn: (turn) => set((s) => ({ turns: [...s.turns, turn] })),
  appendToLast: (delta) =>
    set((s) => {
      const turns = [...s.turns];
      const last = turns[turns.length - 1];
      if (last && last.role === "assistant") {
        turns[turns.length - 1] = { ...last, content: last.content + delta };
      }
      return { turns };
    }),
  setStreaming: (streaming) => set({ streaming }),
  setVoiceStatus: (voiceStatus) => set({ voiceStatus }),
  setVoiceMode: (voiceMode) => set({ voiceMode }),
  setLastVoiceText: (lastVoiceText) => set({ lastVoiceText }),
  incrementHints: () => set((s) => ({ hintsShown: s.hintsShown + 1 })),
  clearChat: (welcome) => set({ turns: welcome ? [welcome] : [], hintsShown: 0 }),
}));
