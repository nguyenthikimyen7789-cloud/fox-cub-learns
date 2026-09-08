import { createFileRoute } from "@tanstack/react-router";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { learners } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";

export const Route = createFileRoute("/diem-danh")({
  head: () => ({
    meta: [
      { title: "Điểm danh học tập — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Theo dõi chuỗi ngày học liên tiếp của từng thành viên trong gia đình.",
      },
      { property: "og:title", content: "Điểm danh học tập — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Chuỗi ngày học liên tiếp của cả nhà." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const fox = useFox();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });

  return (
    <FoxLayout>
      <PageTitle emoji="📅" title="Điểm danh" sub="Mỗi ngày mở bài học là một ngôi sao được đánh dấu." />
      <div className="space-y-4">
        {learners.map((l) => {
          const marks = fox.state.attendance[l.id] ?? [];
          return (
            <div key={l.id} className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{l.emoji}</span>
                <span className="font-display text-lg font-extrabold text-foreground">{l.name}</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-accent-foreground">
                  {marks.length} ngày
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {days.map((d) => {
                  const iso = d.toISOString().slice(0, 10);
                  const on = marks.includes(iso);
                  return (
                    <div
                      key={iso}
                      title={iso}
                      className={`grid size-10 place-items-center rounded-xl border-2 border-border text-sm font-extrabold ${
                        on ? "bg-pastel-mint" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {on ? "⭐" : d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </FoxLayout>
  );
}
