import { useEffect, useState } from "react";
import { starterVocab } from "./foxdata";

export type VocabItem = { en: string; zh: string; pinyin: string; vi: string; learnerId: string; addedAt: string };
export type HistoryItem = { id: string; learnerId: string; kind: string; title: string; stars: number; at: string };

export type FoxState = {
  currentId: string | null;
  stars: Record<string, number>;
  vocab: VocabItem[];
  history: HistoryItem[];
  attendance: Record<string, string[]>; // learnerId -> ISO dates
};

const KEY = "hoc-vien-cao-nho-v1";

const initial: FoxState = {
  currentId: null,
  stars: { ty: 12, mao: 54, dau: 21, bome: 8 },
  vocab: starterVocab.map((v) => ({ ...v, learnerId: "mao", addedAt: new Date().toISOString() })),
  history: [],
  attendance: {},
};

let state: FoxState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function useFox() {
  const [, force] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load();
    setReady(true);
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    ready,
    state,
    selectLearner(id: string) {
      state = { ...state, currentId: id };
      markToday(id);
      emit();
    },
    logout() {
      state = { ...state, currentId: null };
      emit();
    },
    addStars(n: number, kind: string, title: string) {
      const id = state.currentId;
      if (!id) return;
      state = {
        ...state,
        stars: { ...state.stars, [id]: (state.stars[id] ?? 0) + n },
        history: [
          { id: `${Date.now()}`, learnerId: id, kind, title, stars: n, at: new Date().toISOString() },
          ...state.history,
        ].slice(0, 100),
      };
      emit();
    },
    addVocab(v: { en: string; zh: string; pinyin: string; vi: string }) {
      const id = state.currentId ?? "mao";
      if (state.vocab.some((x) => x.en === v.en && x.learnerId === id)) return;
      state = { ...state, vocab: [{ ...v, learnerId: id, addedAt: new Date().toISOString() }, ...state.vocab] };
      emit();
    },
    removeVocab(en: string) {
      const id = state.currentId ?? "mao";
      state = { ...state, vocab: state.vocab.filter((v) => !(v.en === en && v.learnerId === id)) };
      emit();
    },
    resetAll() {
      state = initial;
      emit();
    },
  };
}

function markToday(id: string) {
  const today = new Date().toISOString().slice(0, 10);
  const list = state.attendance[id] ?? [];
  if (!list.includes(today)) {
    state = { ...state, attendance: { ...state.attendance, [id]: [...list, today] } };
  }
}
