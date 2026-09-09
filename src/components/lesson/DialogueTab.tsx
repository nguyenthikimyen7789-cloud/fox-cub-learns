import { useState } from "react";
import type { Lesson } from "@/lib/lessondata";
import { speak } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";
import { useLangMode } from "@/lib/langstore";
import { WordText } from "./WordText";


type Mode = "goc" | "dich" | "tat";

export function DialogueTab({
  lesson,
  activeLine,
  onJump,
}: {
  lesson: Lesson;
  activeLine: number;
  onJump: (i: number) => void;
}) {
  const fox = useFox();
  const lang = useLangMode();
  const [mode, setMode] = useState<Mode>("dich");

  const [recording, setRecording] = useState<number | null>(null);
  const [recorded, setRecorded] = useState<number[]>([]);

  function record(i: number) {
    setRecording(i);
    setTimeout(() => {
      setRecording(null);
      setRecorded((r) => (r.includes(i) ? r : [...r, i]));
      fox.addStars(1, "Luyện nói", lesson.title);
    }, 2500);
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            ["goc", "Chỉ tiếng gốc"],
            ["dich", "Kèm dịch"],
            ["tat", "Tắt chữ"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={`rounded-full border-2 border-border px-4 py-1.5 text-sm font-extrabold ${
              mode === k ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ol className="space-y-2">
        {lesson.lines.map((l, i) => (
          <li
            key={i}
            className={`rounded-2xl border-2 p-3 transition ${
              activeLine === i ? "border-[oklch(0.6_0.13_200)] bg-pastel-sky" : "border-border bg-background"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onJump(i)}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground"
              >
                {i + 1}
              </button>
              <div className="min-w-0 flex-1">
                {mode === "tat" ? (
                  <p className="text-sm font-bold text-muted-foreground">🙈 Chữ đang tắt — hãy nghe và nói theo.</p>
                ) : (
                  <>
                    <p className="font-bold text-foreground">{l.en}</p>
                    <p className="font-bold text-foreground/80">
                      {l.zh} <span className="text-sm text-muted-foreground">({l.pinyin})</span>
                    </p>
                    {mode === "dich" ? <p className="text-sm text-muted-foreground">{l.vi}</p> : null}
                  </>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => speak(l.en, "en-US")} className="rounded-full bg-pastel-sky px-3 py-1 text-xs font-bold">
                    🔊 Anh
                  </button>
                  <button onClick={() => speak(l.zh, "zh-CN")} className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold">
                    🔊 Trung
                  </button>
                  <button
                    onClick={() => record(i)}
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      recording === i
                        ? "bg-destructive text-destructive-foreground"
                        : recorded.includes(i)
                          ? "bg-pastel-mint text-foreground"
                          : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {recording === i ? "🔴 Đang thu…" : recorded.includes(i) ? "✅ Đã nhại" : "🎤 Nhại câu"}
                  </button>
                  <button
                    onClick={() => {
                      const w = lesson.vocab[i % lesson.vocab.length]!;
                      fox.addVocab({ en: w.en, zh: w.zh, pinyin: w.pinyin, vi: w.vi });
                    }}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground"
                  >
                    ⭐ Lưu từ
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
