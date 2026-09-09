import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useFox } from "@/lib/foxstore";
import { learners } from "@/lib/foxdata";
import { useLangMode } from "@/lib/langstore";

const mainTabs = [
  { to: "/truyen-ke", label: "Truyện kể", emoji: "📖" },
  { to: "/bai-hat", label: "Bài hát", emoji: "🎵" },
  { to: "/tro-choi", label: "Trò chơi", emoji: "🎮" },
] as const;

const subLinks = [
  { to: "/phonics", label: "Bảng Phonics", only: "Anh" },
  { to: "/pinyin", label: "Bảng Pinyin", only: "Trung" },
  { to: "/so-tu-vung", label: "Sổ từ vựng", only: null },
  { to: "/diem-danh", label: "Điểm danh", only: null },
  { to: "/quan-tri", label: "Phòng quản trị 🔒", only: null },
] as const;

export function FoxLayout({ children }: { children: ReactNode }) {
  const fox = useFox();
  const lang = useLangMode();
  const navigate = useNavigate();
  const current = learners.find((l) => l.id === fox.state.currentId);
  const stars = current ? (fox.state.stars[current.id] ?? 0) : 0;
  const visibleSubLinks = subLinks.filter((s) => !s.only || s.only === lang.mode);


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b-2 border-border/70 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-xl shadow-soft">🦊</span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold text-primary">Học Viện Cáo Nhỏ</span>
              <span className="block text-xs text-muted-foreground">Song ngữ Anh – Trung cho cả nhà</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border-2 border-border bg-secondary p-1">
              {(["Anh", "Trung"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => lang.setMode(m)}
                  className={`rounded-full px-3 py-1 text-xs font-extrabold transition ${
                    lang.mode === m
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "Anh" ? "🇬🇧" : "🇨🇳"}
                  <span className="ml-1 hidden sm:inline">Tiếng {m}</span>
                </button>
              ))}
            </div>
          </div>


          {fox.ready && current ? (
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="flex items-center gap-2 rounded-full border-2 border-border bg-secondary px-3 py-1.5 transition hover:scale-[1.03]"
            >
              <span className="grid size-8 place-items-center rounded-full bg-card text-lg">{current.emoji}</span>
              <span className="hidden text-sm font-bold text-foreground sm:block">{current.name}</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-sm font-extrabold text-accent-foreground">
                ⭐ {stars}
              </span>
            </button>
          ) : (
            <Link
              to="/profile"
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft"
            >
              Chọn người học
            </Link>
          )}
        </div>

        <nav className="mx-auto max-w-6xl px-4 pb-3">
          <div className="flex gap-2">
            {mainTabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeProps={{ className: "!bg-primary !text-primary-foreground" }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-3 font-display text-base font-extrabold text-foreground shadow-soft transition hover:-translate-y-0.5"
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {visibleSubLinks.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                activeProps={{ className: "!bg-accent !text-accent-foreground" }}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground transition hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mt-10 border-t-2 border-border/70 bg-card py-6 text-center text-sm text-muted-foreground">
        🦊 Học Viện Cáo Nhỏ · Học cùng cả nhà mỗi ngày 15 phút
      </footer>
    </div>
  );
}

export function PageTitle({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-3xl font-extrabold text-primary">
        {emoji} {title}
      </h1>
      {sub ? <p className="mt-1 text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export const cardTint: Record<string, string> = {
  peach: "bg-pastel-peach",
  mint: "bg-pastel-mint",
  sky: "bg-pastel-sky",
  lilac: "bg-pastel-lilac",
};
