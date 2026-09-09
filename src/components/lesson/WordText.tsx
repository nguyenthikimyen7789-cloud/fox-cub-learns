import { useState } from "react";
import { toast } from "sonner";
import { speak } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";
import type { LessonVocab } from "@/lib/lessondata";

function tokenize(text: string, lang: "Anh" | "Trung"): string[] {
  if (lang === "Anh") return text.split(/\s+/).filter(Boolean);
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (Seg) {
    const seg = new Seg("zh-CN", { granularity: "word" });
    return Array.from(seg.segment(text), (s) => s.segment).filter((s) => s.trim().length > 0);
  }
  return Array.from(text).filter((c) => c.trim().length > 0);
}

const clean = (w: string) => w.replace(/[.,!?;:"'“”‘’。！？，、…]/g, "").toLowerCase();

export function WordText({
  text,
  lang,
  vocab,
  className,
}: {
  text: string;
  lang: "Anh" | "Trung";
  vocab: LessonVocab[];
  className?: string;
}) {
  const fox = useFox();
  const [open, setOpen] = useState<number | null>(null);
  const tokens = tokenize(text, lang);

  function lookup(token: string): LessonVocab | undefined {
    const t = clean(token);
    return vocab.find((v) => (lang === "Anh" ? clean(v.en) === t : v.zh === t.replace(/\s/g, "") || t.includes(v.zh)));
  }

  return (
    <span className={`relative inline-flex flex-wrap items-center gap-x-1 gap-y-1 ${className ?? ""}`}>
      {tokens.map((tk, i) => {
        const hit = lookup(tk);
        const phon = lang === "Trung" ? (hit?.pinyin ?? "") : (hit?.en ? `/${clean(hit.en)}/` : "");
        return (
          <span key={`${tk}-${i}`} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                setOpen(open === i ? null : i);
                speak(clean(tk) || tk, lang === "Anh" ? "en-US" : "zh-CN");
              }}
              className="rounded-lg px-1 py-0.5 transition hover:bg-accent/60 hover:text-accent-foreground"
            >
              {tk}
            </button>
            {open === i ? (
              <span
                className="absolute left-1/2 top-full z-40 mt-1 w-52 -translate-x-1/2 rounded-2xl border-2 border-border bg-card p-3 text-left shadow-soft"
                onMouseLeave={() => setOpen(null)}
              >
                <span className="block font-display text-lg font-extrabold text-primary">{tk}</span>
                <span className="block text-xs font-bold text-muted-foreground">
                  {phon || (lang === "Anh" ? "Chạm loa để nghe" : "—")}
                </span>
                <span className="mt-1 block text-sm font-bold text-foreground">
                  {hit ? `${hit.emoji} ${hit.vi}` : "Chưa có nghĩa — hãy nghe phát âm nhé!"}
                </span>
                <span className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => speak(clean(tk) || tk, lang === "Anh" ? "en-US" : "zh-CN")}
                    className="rounded-full bg-pastel-sky px-3 py-1 text-xs font-extrabold text-foreground"
                  >
                    🔊
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fox.addVocab({
                        en: hit?.en ?? (lang === "Anh" ? clean(tk) : tk),
                        zh: hit?.zh ?? (lang === "Trung" ? tk : ""),
                        pinyin: hit?.pinyin ?? "",
                        vi: hit?.vi ?? "",
                      });
                      toast.success("Đã lưu từ vựng!");
                      setOpen(null);
                    }}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground"
                  >
                    ⭐ Lưu từ
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground"
                  >
                    ✕
                  </button>
                </span>
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
