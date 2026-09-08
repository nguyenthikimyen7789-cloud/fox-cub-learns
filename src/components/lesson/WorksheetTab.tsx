import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/lessondata";
import { useFox } from "@/lib/foxstore";

export function WorksheetTab({ lesson }: { lesson: Lesson }) {
  const fox = useFox();
  const { pairs, blanks } = lesson.worksheet;
  const [dragged, setDragged] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const shuffledWords = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [lesson.id]);
  const allMatched = Object.keys(matched).length === pairs.length;
  const blanksRight = blanks.filter((b, i) => (answers[i] ?? "").trim().toLowerCase() === b.answer.toLowerCase()).length;

  function drop(emoji: string, word: string) {
    if (!dragged) return;
    if (dragged === word) {
      setMatched((m) => {
        const next = { ...m, [emoji]: word };
        if (Object.keys(next).length === pairs.length) fox.addStars(2, "Phiếu bài tập", lesson.title);
        return next;
      });
    }
    setDragged(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg font-extrabold text-foreground">1. Kéo từ thả vào đúng hình</h3>
        <p className="text-sm text-muted-foreground">Bé có thể kéo thả hoặc chạm chọn từ rồi chạm vào hình.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {shuffledWords.map((p) => {
            const used = Object.values(matched).includes(p.word);
            return (
              <button
                key={p.word}
                draggable={!used}
                onDragStart={() => setDragged(p.word)}
                onClick={() => setDragged(p.word)}
                disabled={used}
                className={`rounded-2xl border-2 border-border px-4 py-2 font-extrabold shadow-soft transition ${
                  used ? "bg-secondary text-muted-foreground line-through" : dragged === p.word ? "bg-primary text-primary-foreground" : "bg-pastel-sky"
                }`}
              >
                {p.word}
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {pairs.map((p) => (
            <div
              key={p.emoji}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(p.emoji, p.word)}
              onClick={() => drop(p.emoji, p.word)}
              className={`grid place-items-center rounded-3xl border-4 border-dashed p-4 text-center transition ${
                matched[p.emoji] ? "border-primary bg-pastel-mint" : "border-border bg-background"
              }`}
            >
              <span className="text-5xl">{p.emoji}</span>
              <span className="mt-1 text-xs font-bold text-muted-foreground">{p.vi}</span>
              <span className="mt-1 font-extrabold text-primary">{matched[p.emoji] ?? "____"}</span>
            </div>
          ))}
        </div>
        {allMatched ? (
          <p className="mt-3 rounded-2xl bg-pastel-mint p-3 text-center font-extrabold">🎉 Hoàn thành! Bé nhận 2 ⭐</p>
        ) : null}
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg font-extrabold text-foreground">2. Điền từ còn thiếu</h3>
        <div className="mt-3 space-y-3">
          {blanks.map((b, i) => {
            const ok = (answers[i] ?? "").trim().toLowerCase() === b.answer.toLowerCase();
            return (
              <div key={b.sentence} className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{b.sentence}</span>
                <input
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  placeholder="viết vào đây"
                  className={`rounded-xl border-2 px-3 py-1.5 font-bold outline-none ${
                    checked ? (ok ? "border-primary bg-pastel-mint" : "border-destructive") : "border-border bg-background"
                  }`}
                />
                {checked ? <span>{ok ? "✅" : `❌ (${b.answer})`}</span> : null}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            setChecked(true);
            if (blanksRight === blanks.length) fox.addStars(2, "Phiếu bài tập", lesson.title);
          }}
          className="mt-4 rounded-2xl bg-primary px-5 py-2 font-bold text-primary-foreground"
        >
          Kiểm tra bài làm
        </button>
        {checked ? (
          <p className="mt-3 font-extrabold text-primary">
            Bé đúng {blanksRight}/{blanks.length} câu.{" "}
            {blanksRight === blanks.length ? "Tuyệt vời, +2 ⭐!" : "Sửa lại rồi kiểm tra tiếp nhé!"}
          </p>
        ) : null}
      </div>
    </div>
  );
}
