import { createFileRoute, Link } from "@tanstack/react-router";
import { FoxLayout, cardTint } from "@/components/FoxLayout";
import { useFox } from "@/lib/foxstore";
import { learners, stories, songs, games } from "@/lib/foxdata";
import { useLangMode } from "@/lib/langstore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trang chủ — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content:
          "Truyện kể, bài hát và trò chơi song ngữ Anh – Trung cho bé và cả gia đình, học mỗi ngày 15 phút.",
      },
      { property: "og:title", content: "Trang chủ — Học Viện Cáo Nhỏ" },
      {
        property: "og:description",
        content: "Truyện kể, bài hát và trò chơi song ngữ Anh – Trung cho cả nhà.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const fox = useFox();
  const lang = useLangMode();
  const storyList = stories.filter((s) => s.lang === lang.mode);
  const songList = songs.filter((s) => s.lang === lang.mode);
  const current = learners.find((l) => l.id === fox.state.currentId);

  return (
    <FoxLayout>
      <section className="mb-8 overflow-hidden rounded-4xl border-2 border-border bg-card p-6 shadow-soft sm:p-9">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="grid size-28 shrink-0 place-items-center rounded-full bg-pastel-peach text-6xl">🦊</div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
              {current ? `Chào ${current.name}, cùng học nhé!` : "Chào mừng tới Học Viện Cáo Nhỏ!"}
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Mỗi ngày 15 phút: nghe một câu chuyện, hát một bài hát, chơi một trò chơi — bằng cả
              tiếng Anh và tiếng Trung.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Link
                to="/lesson/$id"
                params={{ id: (storyList[0] ?? stories[0]!).id }}
                className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
              >
                ▶ Học bài hôm nay
              </Link>
              <Link
                to="/profile"
                className="rounded-full border-2 border-border bg-secondary px-5 py-2.5 font-bold text-foreground transition hover:-translate-y-0.5"
              >
                Đổi người học
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="📖 Truyện kể mới" to="/truyen-ke">
        {storyList.slice(0, 3).map((s) => (
          <Link
            key={s.id}
            to="/lesson/$id"
            params={{ id: s.id }}
            className={`rounded-3xl border-2 border-border p-4 shadow-soft transition hover:-translate-y-1 ${cardTint[s.color]}`}
          >
            <div className="text-4xl">{s.emoji}</div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground">
              {s.titleEn} · {s.titleZh}
            </p>
            <p className="mt-2 text-xs font-bold text-primary">
              {s.level} · {s.minutes} phút
            </p>
          </Link>
        ))}
      </Section>

      <Section title="🎵 Bài hát vui" to="/bai-hat">
        {songList.slice(0, 3).map((s) => (
          <Link
            key={s.id}
            to="/bai-hat"
            className={`rounded-3xl border-2 border-border p-4 shadow-soft transition hover:-translate-y-1 ${cardTint[s.color]}`}
          >
            <div className="text-4xl">{s.emoji}</div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-foreground">{s.title}</h3>
            <p className="mt-1 text-xs font-bold text-primary">
              Tiếng {s.lang} · {s.level}
            </p>
          </Link>
        ))}
      </Section>

      <Section title="🎮 Trò chơi" to="/tro-choi">
        {games.slice(0, 3).map((g) => (
          <Link
            key={g.id}
            to="/tro-choi"
            className={`rounded-3xl border-2 border-border p-4 shadow-soft transition hover:-translate-y-1 ${cardTint[g.color]}`}
          >
            <div className="text-4xl">{g.emoji}</div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-foreground">{g.title}</h3>
            <p className="text-sm text-muted-foreground">{g.desc}</p>
          </Link>
        ))}
      </Section>
    </FoxLayout>
  );
}

function Section({
  title,
  to,
  children,
}: {
  title: string;
  to: "/truyen-ke" | "/bai-hat" | "/tro-choi";
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-foreground">{title}</h2>
        <Link to={to} className="text-sm font-bold text-primary hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
