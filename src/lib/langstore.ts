import { useEffect, useState } from "react";

export type LangMode = "Anh" | "Trung";

const KEY = "hoc-vien-cao-nho-lang";
let mode: LangMode = "Anh";
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const raw = window.localStorage.getItem(KEY);
  if (raw === "Anh" || raw === "Trung") mode = raw;
}

export function useLangMode() {
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
    mode,
    setMode(next: LangMode) {
      mode = next;
      if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
      listeners.forEach((l) => l());
    },
  };
}
