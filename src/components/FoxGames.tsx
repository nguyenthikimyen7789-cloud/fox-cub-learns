import { useEffect, useMemo, useState } from "react";
import { matchPairs, quizQuestions } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";

type Card = { key: string; label: string; pairId: number; kind: "en" | "vi" };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function MemoryGame() {
  const fox = useFox();
  const [deck, setDeck] = useState<Card[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  function build() {
    const pairs = matchPairs.slice(0, 6);
    const cards: Card[] = pairs.flatMap((p, i) => [
      { key: `en-${i}`, label: p.en, pairId: i, kind: "en" as const },
      { key: `vi-${i}`, label: p.vi, pairId: i, kind: "vi" as const },
    ]);
    setDeck(shuffle(cards));
    setOpen([]);
    setDone([]);
    setMoves(0);
  }

  useEffect(build, []);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((k) => deck.find((c) => c.key === k)!);
    const t = setTimeout(() => {
      if (a && b && a.pairId === b.pairId) {
        setDone((d) => {
          const next = [...d, a.pairId];
          if (next.length === 6) fox.addStars(3, "Trò chơi", "Lật thẻ Memory");
          return next;
        });
      }
      setOpen([]);
    }, 650);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
          Cặp đúng: {done.length}/6
        </span>
        <span className="text-sm font-bold text-muted-foreground">Số lượt lật: {moves}</span>
        <button onClick={build} className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">
          🔄 Chơi lại
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((c) => {
          const flipped = open.includes(c.key) || done.includes(c.pairId);
          return (
            <button
              key={c.key}
              onClick={() => {
                if (flipped || open.length === 2) return;
                setMoves((m) => m + 1);
                setOpen((o) => [...o, c.key]);
              }}
              className={`grid h-20 place-items-center rounded-2xl border-2 border-border px-2 text-center text-sm font-extrabold shadow-soft transition ${
                done.includes(c.pairId)
                  ? "bg-pastel-mint text-foreground"
                  : flipped
                    ? "bg-card text-foreground"
                    : "bg-pastel-peach text-transparent"
              }`}
            >
              {flipped ? c.label : "🦊"}
            </button>
          );
        })}
      </div>
      {done.length === 6 ? (
        <p className="mt-3 rounded-2xl bg-pastel-mint p-3 text-center font-extrabold text-foreground">
          🎉 Giỏi quá! Bé đã ghép đúng tất cả và nhận 3 ⭐
        </p>
      ) : null}
    </div>
  );
}

export function StarWordsGame() {
  const fox = useFox();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [time, setTime] = useState(45);
  const [over, setOver] = useState(false);
  const [flash, setFlash] = useState<string>("");

  const question = useMemo(() => {
    const target = matchPairs[round % matchPairs.length]!;
    const others = shuffle(matchPairs.filter((p) => p.en !== target.en)).slice(0, 3);
    return { target, ufos: shuffle([target, ...others]) };
  }, [round]);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setTime((s) => {
        if (s <= 1) {
          setOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [over]);

  useEffect(() => {
    if (over && score > 0) fox.addStars(Math.min(5, Math.ceil(score / 20)), "Trò chơi", "Vũ trụ Star Words");
  }, [over]);

  function shoot(en: string) {
    if (over) return;
    if (en === question.target.en) {
      setScore((s) => s + 10);
      setFlash("✅ Bắn trúng!");
    } else {
      setFlash("❌ Trượt rồi!");
      setLives((l) => {
        if (l <= 1) setOver(true);
        return l - 1;
      });
    }
    setRound((r) => r + 1);
    setTimeout(() => setFlash(""), 600);
  }

  function restart() {
    setRound(0);
    setScore(0);
    setLives(4);
    setTime(45);
    setOver(false);
  }

  if (over) {
    return (
      <div className="rounded-3xl border-2 border-border bg-pastel-lilac p-6 text-center shadow-soft">
        <div className="text-5xl">🚀</div>
        <h3 className="mt-2 font-display text-2xl font-extrabold text-primary">Kết thúc chuyến bay!</h3>
        <p className="mt-1 font-bold text-foreground">Điểm của bé: {score}</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground"
        >
          🔄 Bay lại
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-[oklch(0.28_0.06_275)] p-5 text-center shadow-soft">
      <div className="flex items-center justify-between text-sm font-extrabold text-white">
        <span>⏱ {time}s</span>
        <span>{"❤️".repeat(Math.max(0, lives))}</span>
        <span>⭐ {score}</span>
      </div>
      <p className="mt-4 rounded-2xl bg-white/90 px-4 py-3 font-display text-xl font-extrabold text-foreground">
        Bắn chiếc UFO mang nghĩa: “{question.target.vi}”
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {question.ufos.map((u) => (
          <button
            key={u.en}
            onClick={() => shoot(u.en)}
            className="rounded-3xl bg-pastel-sky px-3 py-5 font-display text-lg font-extrabold text-foreground shadow-soft transition hover:-translate-y-1"
          >
            🛸 {u.en}
          </button>
        ))}
      </div>
      <p className="mt-3 h-5 font-bold text-white">{flash}</p>
    </div>
  );
}

export function PhonicsQuiz() {
  const fox = useFox();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = quizQuestions[i]!;

  if (i >= quizQuestions.length) {
    return (
      <div className="rounded-3xl border-2 border-border bg-pastel-mint p-6 text-center shadow-soft">
        <p className="font-display text-2xl font-extrabold text-primary">
          🎉 Đúng {score}/{quizQuestions.length} câu!
        </p>
        <button
          onClick={() => {
            setI(0);
            setScore(0);
            setPicked(null);
          }}
          className="mt-3 rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground"
        >
          🔄 Làm lại
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
      <p className="text-sm font-bold text-muted-foreground">
        Câu {i + 1}/{quizQuestions.length}
      </p>
      <h3 className="mt-1 font-display text-xl font-extrabold text-foreground">{q.q}</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {q.options.map((o, idx) => (
          <button
            key={o}
            onClick={() => {
              if (picked !== null) return;
              setPicked(idx);
              if (idx === q.answer) {
                setScore((s) => s + 1);
                fox.addStars(1, "Đố vui", "Phonics & Pinyin");
              }
              setTimeout(() => {
                setPicked(null);
                setI((n) => n + 1);
              }, 900);
            }}
            className={`rounded-2xl border-2 border-border px-4 py-3 font-extrabold shadow-soft transition ${
              picked === null
                ? "bg-pastel-sky"
                : idx === q.answer
                  ? "bg-pastel-mint"
                  : idx === picked
                    ? "bg-destructive/20"
                    : "bg-card"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
