import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { shadowingSets } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";
import { speak } from "@/lib/speak";

export const Route = createFileRoute("/pro-zone")({
  head: () => ({
    meta: [
      { title: "Pro Zone của Bố & Mẹ — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Khu luyện nói Shadowing cho người lớn: mẫu câu đời sống và công việc Anh – Trung.",
      },
      { property: "og:title", content: "Pro Zone của Bố & Mẹ" },
      { property: "og:description", content: "Luyện nói Shadowing đời sống và công việc." },
    ],
  }),
  component: ProZone,
});

function ProZone() {
  const fox = useFox();
  const [set, setSet] = useState(shadowingSets[0]!.id);
  const [recording, setRecording] = useState<string | null>(null);
  const active = shadowingSets.find((s) => s.id === set)!;

  if (fox.ready && fox.state.currentId !== "bome") {
    return (
      <FoxLayout>
        <div className="rounded-3xl border-2 border-border bg-card p-8 text-center shadow-soft">
          <div className="text-5xl">🔒</div>
          <p className="mt-2 font-display text-xl font-extrabold text-primary">Khu vực này dành cho Bố & Mẹ</p>
          <p className="mt-1 text-muted-foreground">Hãy chọn hồ sơ Bố & Mẹ và nhập mã PIN để vào.</p>
        </div>
      </FoxLayout>
    );
  }

  return (
    <FoxLayout>
      <PageTitle emoji="🎙️" title="Pro Zone — Luyện nói Shadowing" sub="Nghe mẫu, nói nhại lại và tự chấm điểm." />
      <div className="mb-4 flex gap-2">
        {shadowingSets.map((s) => (
          <button
            key={s.id}
            onClick={() => setSet(s.id)}
            className={`rounded-full border-2 border-border px-4 py-2 font-bold shadow-soft ${
              set === s.id ? "bg-primary text-primary-foreground" : "bg-card"
            }`}
          >
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {active.lines.map((l) => (
          <div key={l.en} className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
            <p className="font-display text-lg font-extrabold text-foreground">{l.en}</p>
            <p className="text-base font-bold text-foreground/80">{l.zh}</p>
            <p className="text-sm text-muted-foreground">{l.vi}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => speak(l.en, "en-US")} className="rounded-full bg-pastel-sky px-3 py-1.5 text-sm font-bold">
                🔊 Nghe tiếng Anh
              </button>
              <button onClick={() => speak(l.zh, "zh-CN")} className="rounded-full bg-pastel-mint px-3 py-1.5 text-sm font-bold">
                🔊 Nghe tiếng Trung
              </button>
              <button
                onClick={() => {
                  setRecording(l.en);
                  setTimeout(() => {
                    setRecording(null);
                    fox.addStars(1, "Shadowing", l.en);
                  }, 2500);
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  recording === l.en ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {recording === l.en ? "🔴 Đang thu âm…" : "🎤 Nói nhại lại"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </FoxLayout>
  );
}
