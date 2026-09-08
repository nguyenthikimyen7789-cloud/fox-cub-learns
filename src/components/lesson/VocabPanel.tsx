import { useEffect, useRef, useState } from "react";
import type { LessonVocab } from "@/lib/lessondata";
import { speak, stopSpeaking } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";

type Toggles = {
  han: boolean;
  pinyin: boolean;
  vi: boolean;
  example: boolean;
  blank: boolean;
  image: boolean;
};

export function VocabPanel({ vocab, asModal, onClose }: { vocab: LessonVocab[]; asModal?: boolean; onClose?: () => void }) {
  const fox = useFox();
  const [t, setT] = useState<Toggles>({ han: true, pinyin: true, vi: true, example: true, blank: false, image: true });
  const [gap, setGap] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    let i = 0;
    const step = () => {
      if (i >= vocab.length) {
        setPlaying(false);
        setActive(-1);
        return;
      }
      const v = vocab[i]!;
      setActive(i);
      speak(v.en, "en-US");
      setTimeout(() => speak(v.zh, "zh-CN"), gap * 500);
      i += 1;
      timer.current = setTimeout(step, gap * 1000 + 700);
    };
    step();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      stopSpeaking();
    };
  }, [playing, gap]);

  const body = (
    <div className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(
          [
            ["han", "Chữ Hán"],
            ["pinyin", "Pinyin"],
            ["vi", "Nghĩa TV"],
            ["example", "Ví dụ"],
            ["blank", "Blank"],
            ["image", "Ảnh"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setT((p) => ({ ...p, [k]: !p[k] }))}
            className={`rounded-full border-2 border-border px-3 py-1 text-xs font-extrabold transition ${
              t[k] ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t[k] ? "👁 " : "🚫 "}
            {label}
          </button>
        ))}
        {onClose ? (
          <button onClick={onClose} className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-extrabold">
            ✕ Đóng
          </button>
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground"
        >
          {playing ? "⏹ Dừng" : "▶ Play All"}
        </button>
        <span className="text-xs font-bold text-muted-foreground">Nghỉ giữa các từ:</span>
        {[1, 2, 3].map((g) => (
          <button
            key={g}
            onClick={() => setGap(g)}
            className={`rounded-full border-2 border-border px-3 py-1 text-xs font-extrabold ${
              gap === g ? "bg-accent text-accent-foreground" : "bg-card"
            }`}
          >
            {g}s
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {vocab.map((v, i) => {
          const exampleEn = t.blank ? v.exampleEn.replace(new RegExp(v.en, "gi"), "______") : v.exampleEn;
          const exampleZh = t.blank ? v.exampleZh.replace(v.zh, "______") : v.exampleZh;
          return (
            <div
              key={v.en}
              className={`rounded-3xl border-2 p-4 shadow-soft transition ${
                active === i ? "border-primary bg-pastel-peach" : "border-border bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                {t.image ? <span className="text-4xl">{v.emoji}</span> : null}
                <div className="min-w-0">
                  <p className="font-display text-xl font-extrabold text-primary">{v.en}</p>
                  {t.han ? <p className="text-lg font-bold text-foreground">{v.zh}</p> : null}
                  {t.pinyin ? <p className="text-sm text-muted-foreground">{v.pinyin}</p> : null}
                  {t.vi ? <p className="text-sm font-bold text-foreground/80">{v.vi}</p> : null}
                  {t.example ? (
                    <div className="mt-2 rounded-2xl bg-secondary p-2 text-sm">
                      <p className="text-foreground">{exampleEn}</p>
                      <p className="text-muted-foreground">{exampleZh}</p>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => speak(v.en, "en-US")} className="rounded-full bg-pastel-sky px-3 py-1 text-xs font-bold">
                  🔊 Anh
                </button>
                <button onClick={() => speak(v.zh, "zh-CN")} className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold">
                  🔊 Trung
                </button>
                <button
                  onClick={() => fox.addVocab({ en: v.en, zh: v.zh, pinyin: v.pinyin, vi: v.vi })}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground"
                >
                  ⭐ Lưu từ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!asModal) return body;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/40 p-4">
      <div className="mx-auto max-w-3xl">{body}</div>
    </div>
  );
}
