import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FoxLayout, PageTitle, cardTint } from "@/components/FoxLayout";
import { songs } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";
import { useLangMode } from "@/lib/langstore";

export const Route = createFileRoute("/bai-hat")({
  head: () => ({
    meta: [
      { title: "Bài hát song ngữ — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Hát cùng Cáo Nhỏ: bài hát tiếng Anh và tiếng Trung có lời dịch tiếng Việt.",
      },
      { property: "og:title", content: "Bài hát song ngữ — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Bài hát Anh – Trung có lời dịch tiếng Việt." },
    ],
  }),
  component: SongsPage,
});

function SongsPage() {
  const fox = useFox();
  const lang = useLangMode();
  const [open, setOpen] = useState<string | null>(songs[0]!.id);
  const list = songs.filter((s) => s.lang === lang.mode);

  return (
    <FoxLayout>
      <PageTitle emoji="🎵" title="Bài hát" sub={`Bài hát tiếng ${lang.mode} — hát theo để nhớ từ nhanh hơn.`} />
            <div className="grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <div
            key={s.id}
            className={`rounded-3xl border-2 border-border p-5 shadow-soft ${cardTint[s.color]}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{s.emoji}</span>
              <div>
                <h2 className="font-display text-lg font-extrabold text-foreground">{s.title}</h2>
                <p className="text-xs font-bold text-primary">
                  Tiếng {s.lang} · {s.level}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setOpen(open === s.id ? null : s.id)}
                className="rounded-full bg-card px-4 py-1.5 text-sm font-bold text-foreground"
              >
                {open === s.id ? "Ẩn lời" : "Xem lời"}
              </button>
              <button
                onClick={() => fox.addStars(1, "Bài hát", s.title)}
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground"
              >
                🎤 Hát xong +1 ⭐
              </button>
            </div>
            {open === s.id ? (
              <ul className="mt-3 space-y-2 rounded-2xl bg-card/80 p-3">
                {s.lyrics.map((l, i) => (
                  <li key={i}>
                    <p className="font-bold text-foreground">{l.line}</p>
                    <p className="text-sm text-muted-foreground">{l.vi}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </FoxLayout>
  );
}
