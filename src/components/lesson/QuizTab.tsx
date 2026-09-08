import { useState } from "react";
import type { QuizItem } from "@/lib/lessondata";
import { speak } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";

export function QuizTab({ quiz, lessonTitle }: { quiz: QuizItem[]; lessonTitle: string }) {
  const fox = useFox();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-3xl border-2 border-border bg-pastel-mint p-6 text-center shadow-soft">
        <div className="text-5xl">🎉</div>
        <p className="mt-2 font-display text-2xl font-extrabold text-primary">
          Bé trả lời đúng {score}/{quiz.length} câu!
        </p>
        <button
          onClick={() => {
            setI(0);
            setScore(0);
            setPicked(null);
            setDone(false);
          }}
          className="mt-4 rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground"
        >
          🔄 Làm lại
        </button>
      </div>
    );
  }

  const q = quiz[i]!;

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const right = idx === q.answer;
    if (right) {
      setScore((s) => s + 1);
      fox.addStars(1, "Đố vui", lessonTitle);
    }
    setTimeout(() => {
      setPicked(null);
      if (i + 1 >= quiz.length) setDone(true);
      else setI(i + 1);
    }, 1100);
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-muted-foreground">
          Câu {i + 1}/{quiz.length}
        </p>
        <div className="h-3 w-40 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${(i / quiz.length) * 100}%` }} />
        </div>
      </div>

      <p className="font-display text-lg font-extrabold text-foreground">Nghe câu rồi chọn tranh đúng nhé!</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={() => speak(q.audioEn, "en-US")} className="rounded-full bg-pastel-sky px-4 py-1.5 text-sm font-bold">
          🔊 Nghe tiếng Anh
        </button>
        <button onClick={() => speak(q.audioZh, "zh-CN")} className="rounded-full bg-pastel-mint px-4 py-1.5 text-sm font-bold">
          🔊 Nghe tiếng Trung
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {q.options.map((o, idx) => {
          const state =
            picked === null ? "" : idx === q.answer ? "border-primary bg-pastel-mint" : idx === picked ? "border-destructive bg-destructive/15" : "";
          return (
            <button
              key={o.label}
              onClick={() => pick(idx)}
              className={`rounded-3xl border-4 border-border bg-background p-6 text-center shadow-soft transition hover:-translate-y-1 ${state}`}
            >
              <div className="text-6xl">{o.emoji}</div>
              <p className="mt-2 font-extrabold text-foreground">{o.label}</p>
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <p className="mt-3 text-center font-display text-lg font-extrabold text-primary">
          {picked === q.answer ? "✅ Chính xác! Giỏi quá!" : "❌ Chưa đúng, thử lại câu sau nhé!"}
        </p>
      ) : null}
    </div>
  );
}
