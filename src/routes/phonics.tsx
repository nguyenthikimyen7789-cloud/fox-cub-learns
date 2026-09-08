import { createFileRoute } from "@tanstack/react-router";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { phonicsGroups } from "@/lib/foxdata";
import { speak } from "@/lib/speak";

export const Route = createFileRoute("/phonics")({
  head: () => ({
    meta: [
      { title: "Bảng Phonics — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Bảng Phonics chuẩn Oxford: âm đơn, âm ghép và nguyên âm dài kèm ví dụ tiếng Việt.",
      },
      { property: "og:title", content: "Bảng Phonics — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Âm đơn, âm ghép và nguyên âm dài kèm ví dụ." },
    ],
  }),
  component: PhonicsPage,
});

function PhonicsPage() {
  return (
    <FoxLayout>
      <PageTitle emoji="🔤" title="Bảng Phonics" sub="Chạm vào mỗi ô để nghe Cáo Nhỏ đọc mẫu." />
      {phonicsGroups.map((g) => (
        <section key={g.group} className="mb-6">
          <h2 className="mb-2 font-display text-xl font-extrabold text-foreground">{g.group}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {g.items.map((it) => (
              <button
                key={it.word}
                onClick={() => speak(it.word, "en-US")}
                className="rounded-3xl border-2 border-border bg-pastel-peach p-4 text-center shadow-soft transition hover:-translate-y-1"
              >
                <div className="text-4xl">{it.emoji}</div>
                <p className="mt-1 font-display text-2xl font-extrabold text-primary">{it.sound}</p>
                <p className="font-bold text-foreground">{it.word}</p>
                <p className="text-xs text-muted-foreground">{it.vi}</p>
              </button>
            ))}
          </div>
        </section>
      ))}
    </FoxLayout>
  );
}
