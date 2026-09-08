import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { learners, stories, songs, games } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";

export const Route = createFileRoute("/quan-tri")({
  head: () => ({
    meta: [
      { title: "Phòng quản trị — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Khu vực dành cho phụ huynh: xem tiến độ, số sao và lịch sử học của từng bé.",
      },
      { property: "og:title", content: "Phòng quản trị — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Theo dõi tiến độ học tập của cả nhà." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const fox = useFox();
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  if (!ok) {
    return (
      <FoxLayout>
        <div className="mx-auto max-w-sm rounded-4xl border-2 border-border bg-card p-6 text-center shadow-soft">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-primary">Phòng quản trị</h1>
          <p className="mt-1 text-sm text-muted-foreground">Nhập mã PIN của phụ huynh.</p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => e.key === "Enter" && (pin === "1234" ? setOk(true) : setErr("Mã PIN chưa đúng."))}
            inputMode="numeric"
            placeholder="••••"
            className="mt-4 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none focus:border-primary"
          />
          {err ? <p className="mt-2 text-sm font-bold text-destructive">{err}</p> : null}
          <button
            onClick={() => (pin === "1234" ? setOk(true) : setErr("Mã PIN chưa đúng."))}
            className="mt-4 w-full rounded-2xl bg-primary px-4 py-2.5 font-bold text-primary-foreground"
          >
            Mở khoá
          </button>
        </div>
      </FoxLayout>
    );
  }

  return (
    <FoxLayout>
      <PageTitle emoji="🛠️" title="Phòng quản trị" sub="Tiến độ học tập của cả nhà, lưu ngay trên máy này." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Truyện kể" value={stories.length} emoji="📖" />
        <Stat label="Bài hát" value={songs.length} emoji="🎵" />
        <Stat label="Trò chơi" value={games.length} emoji="🎮" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {learners.map((l) => (
          <div key={l.id} className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
            <p className="text-3xl">{l.emoji}</p>
            <p className="font-display text-lg font-extrabold text-foreground">{l.name}</p>
            <p className="text-sm text-muted-foreground">{l.level}</p>
            <p className="mt-2 font-extrabold text-primary">⭐ {fox.state.stars[l.id] ?? 0} sao</p>
            <p className="text-sm text-muted-foreground">
              {(fox.state.attendance[l.id] ?? []).length} ngày điểm danh ·{" "}
              {fox.state.vocab.filter((v) => v.learnerId === l.id).length} từ đã lưu
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 font-display text-xl font-extrabold text-foreground">Lịch sử học gần đây</h2>
      <div className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
        {fox.state.history.length === 0 ? (
          <p className="text-muted-foreground">Chưa có hoạt động nào được ghi lại.</p>
        ) : (
          <ul className="divide-y divide-border">
            {fox.state.history.slice(0, 20).map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="font-bold text-foreground">
                  {learners.find((l) => l.id === h.learnerId)?.emoji} {h.kind} · {h.title}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  +{h.stars} ⭐ · {new Date(h.at).toLocaleString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => {
          if (confirm("Xoá toàn bộ dữ liệu học tập trên máy này?")) fox.resetAll();
        }}
        className="mt-6 rounded-2xl border-2 border-destructive px-4 py-2 font-bold text-destructive"
      >
        Xoá toàn bộ dữ liệu
      </button>
    </FoxLayout>
  );
}

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="rounded-3xl border-2 border-border bg-pastel-sky p-4 shadow-soft">
      <p className="text-3xl">{emoji}</p>
      <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label} trong thư viện</p>
    </div>
  );
}
