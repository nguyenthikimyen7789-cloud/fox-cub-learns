import { createFileRoute } from "@tanstack/react-router";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { pinyinGroups, pinyinTones } from "@/lib/foxdata";
import { speak } from "@/lib/speak";

export const Route = createFileRoute("/pinyin")({
  head: () => ({
    meta: [
      { title: "Bảng Pinyin — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Bảng Pinyin cho bé: thanh mẫu, vận mẫu và bốn thanh điệu kèm ví dụ dễ nhớ.",
      },
      { property: "og:title", content: "Bảng Pinyin — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Thanh mẫu, vận mẫu và bốn thanh điệu tiếng Trung." },
    ],
  }),
  component: PinyinPage,
});

function PinyinPage() {
  return (
    <FoxLayout>
      <PageTitle emoji="🀄" title="Bảng Pinyin" sub="Chạm để nghe cách đọc từng âm tiếng Trung." />
      {pinyinGroups.map((g) => (
        <section key={g.group} className="mb-6">
          <h2 className="mb-2 font-display text-xl font-extrabold text-foreground">{g.group}</h2>
          <div className="flex flex-wrap gap-2">
            {g.items.map((it) => (
              <button
                key={it}
                onClick={() => speak(it, "zh-CN")}
                className="min-w-16 rounded-2xl border-2 border-border bg-pastel-mint px-4 py-3 font-display text-xl font-extrabold text-foreground shadow-soft transition hover:-translate-y-1"
              >
                {it}
              </button>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-2 font-display text-xl font-extrabold text-foreground">Bốn thanh điệu</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pinyinTones.map((t) => (
            <button
              key={t.tone}
              onClick={() => speak(t.example.split(" ")[1] ?? t.example, "zh-CN")}
              className="rounded-3xl border-2 border-border bg-pastel-lilac p-4 text-center shadow-soft transition hover:-translate-y-1"
            >
              <p className="font-display text-2xl font-extrabold text-primary">{t.tone}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{t.example}</p>
              <p className="text-sm text-muted-foreground">{t.vi}</p>
              <p className="mt-1 text-xs font-bold text-foreground/70">{t.note}</p>
            </button>
          ))}
        </div>
      </section>
    </FoxLayout>
  );
}
