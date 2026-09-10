import { useState } from "react";
import { toast } from "sonner";
import type { Lesson } from "@/lib/lessondata";
import { speak } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";
import { useLangMode } from "@/lib/langstore";
import { WordText } from "./WordText";
import { SentenceTools } from "./SentenceTools";


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

  const [dictateLine, setDictateLine] = useState<number | null>(null);

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
                <div className={dictateLine === i ? "blur-[2px] opacity-60 transition" : "transition"}>
                  {mode === "tat" ? (
                    <p className="text-sm font-bold text-muted-foreground">🙈 Chữ đang tắt — hãy nghe và nói theo.</p>
                  ) : lang.mode === "Anh" ? (
                    <>
                      <p className="font-bold text-foreground">
                        <WordText text={l.en} lang="Anh" vocab={lesson.vocab} />
                      </p>
                      {mode === "dich" ? <p className="mt-1 text-sm text-muted-foreground">{l.vi}</p> : null}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-primary">{l.pinyin}</p>
                      <p className="font-bold text-foreground">
                        <WordText text={l.zh} lang="Trung" vocab={lesson.vocab} />
                      </p>
                      {mode === "dich" ? <p className="mt-1 text-sm text-muted-foreground">{l.vi}</p> : null}
                    </>
                  )}
                </div>

                <SentenceTools
                  text={lang.mode === "Anh" ? l.en : l.zh}
                  lang={lang.mode === "Anh" ? "Anh" : "Trung"}
                  title={lesson.title}
                  onDictateChange={(open) => setDictateLine(open ? i : null)}
                />

                <button
                  onClick={() => {
                    const w = lesson.vocab[i % lesson.vocab.length]!;
                    fox.addVocab({ en: w.en, zh: w.zh, pinyin: w.pinyin, vi: w.vi });
                    toast.success("Đã lưu từ vựng!");
                  }}
                  className="mt-2 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground"
                >
                  ⭐ Lưu từ
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
