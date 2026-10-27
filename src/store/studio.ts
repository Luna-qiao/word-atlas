import { useSyncExternalStore } from "react";
import type { TaskKind } from "../data/writing";

export interface Essay {
  /** One draft per prompt. */
  id: string;
  task: TaskKind;
  promptText: string;
  text: string;
  created: number;
  updated: number;
}

export interface StudioState {
  essays: Essay[];
}

const KEY = "word-atlas:studio";
const MAX = 100;

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

function validEssay(v: unknown): v is Essay {
  return (
    isObj(v) &&
    typeof v.id === "string" &&
    (v.task === "task1" || v.task === "task2") &&
    typeof v.promptText === "string" &&
    typeof v.text === "string" &&
    typeof v.created === "number" &&
    typeof v.updated === "number"
  );
}

function read(): StudioState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { essays: [] };
    const v: unknown = JSON.parse(raw);
    if (!isObj(v) || !Array.isArray(v.essays)) return { essays: [] };
    return { essays: v.essays.filter(validEssay).slice(0, MAX) };
  } catch {
    return { essays: [] };
  }
}

let state: StudioState = typeof window === "undefined" ? { essays: [] } : read();
const listeners = new Set<() => void>();
let timer: number | undefined;

function emit() {
  listeners.forEach((l) => l());
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — drafts stay in memory for this session */
  }
}

function schedule() {
  window.clearTimeout(timer);
  timer = window.setTimeout(save, 400);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", save);
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      const v: unknown = JSON.parse(e.newValue);
      if (isObj(v) && Array.isArray(v.essays)) {
        state = { essays: v.essays.filter(validEssay).slice(0, MAX) };
        emit();
      }
    } catch {
      /* ignore malformed writes from other tabs */
    }
  });
}

export const studio = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  put(essay: Omit<Essay, "created" | "updated">) {
    const now = Date.now();
    const found = state.essays.find((e) => e.id === essay.id);
    const next: Essay = found ? { ...found, ...essay, updated: now } : { ...essay, created: now, updated: now };
    state = { essays: [next, ...state.essays.filter((e) => e.id !== essay.id)].slice(0, MAX) };
    emit();
    schedule();
  },
  patch(id: string, patch: Partial<Pick<Essay, "text" | "promptText">>) {
    const found = state.essays.find((e) => e.id === id);
    if (!found) return;
    state = { essays: state.essays.map((e) => (e.id === id ? { ...e, ...patch, updated: Date.now() } : e)) };
    emit();
    schedule();
  },
  remove(id: string) {
    state = { essays: state.essays.filter((e) => e.id !== id) };
    emit();
    schedule();
  },
};

export function useStudio<T>(select: (s: StudioState) => T): T {
  return useSyncExternalStore(studio.subscribe, () => select(state), () => select(state));
}
