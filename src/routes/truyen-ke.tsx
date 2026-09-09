import { createFileRoute, Link } from "@tanstack/react-router";
import { FoxLayout, PageTitle, cardTint } from "@/components/FoxLayout";
import { stories } from "@/lib/foxdata";
import { useLangMode } from "@/lib/langstore";

export const Route = createFileRoute("/truyen-ke")({
  head: () => ({
    meta: [
      { title: "Truyện kể song ngữ — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Kho truyện kể tiếng Anh và tiếng Trung có phụ đề, chia theo ba cấp độ cho bé.",
      },
      { property: "og:title", content: "Truyện kể song ngữ — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Kho truyện kể Anh – Trung có phụ đề cho bé." },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const lang = useLangMode();
  const list = stories.filter((s) => s.lang === lang.mode);
  return (
    <FoxLayout>
      <PageTitle emoji="📖" title="Truyện kể" sub={`Truyện tiếng ${lang.mode} — chọn một câu chuyện để nghe và đọc theo.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <Link
            key={s.id}
            to="/lesson/$id"
            params={{ id: s.id }}
            className={`rounded-3xl border-2 border-border p-5 shadow-soft transition hover:-translate-y-1 ${cardTint[s.color]}`}
          >
            <div className="text-5xl">{s.emoji}</div>
            <h2 className="mt-2 font-display text-xl font-extrabold text-foreground">{s.title}</h2>
            <p className="text-sm text-muted-foreground">
              {s.titleEn} · {s.titleZh}
            </p>
            <p className="mt-2 text-sm text-foreground/80">{s.summary}</p>
            <p className="mt-3 text-xs font-bold text-primary">
              {s.level} · {s.minutes} phút · {s.lines.length} câu
            </p>
          </Link>
        ))}
      </div>
    </FoxLayout>
  );
}
