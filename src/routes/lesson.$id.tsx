import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FoxLayout } from "@/components/FoxLayout";
import { getLesson, lessons, SECONDS_PER_LINE } from "@/lib/lessondata";
import { VocabPanel } from "@/components/lesson/VocabPanel";
import { QuizTab } from "@/components/lesson/QuizTab";
import { WorksheetTab } from "@/components/lesson/WorksheetTab";
import { DialogueTab } from "@/components/lesson/DialogueTab";
import { MemoryGame, StarWordsGame } from "@/components/FoxGames";
import { openPrintableBook } from "@/lib/printable";
import { speak, stopSpeaking } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";

export const Route = createFileRoute("/lesson/$id")({
  loader: ({ params }) => {
    const lesson = getLesson(params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Không tìm thấy bài học" }, { name: "robots", content: "noindex" }] };
    }
    const l = loaderData.lesson;
    const title = `${l.title} — Bài học song ngữ | Học Viện Cáo Nhỏ`;
    const desc = `Xem bài học ${l.title} (${l.titleEn} · ${l.titleZh}) với phụ đề song tầng, từ vựng, đố vui, phiếu bài tập và trò chơi.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: LessonPage,
});

const tabs = [
  { id: "loi-thoai", label: "📄 Lời thoại & Luyện nói" },
  { id: "tu-vung", label: "📕 Từ vựng" },
  { id: "do-vui", label: "✏️ Đố vui" },
  { id: "bai-tap", label: "✍️ Phiếu bài tập" },
  { id: "tro-choi", label: "🎮 Trò chơi" },
] as const;

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const navigate = useNavigate();
  const fox = useFox();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const total = lesson.lines.length;
  const [playing, setPlaying] = useState(false);
  const [clock, setClock] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [subs, setSubs] = useState(true);
  const [ended, setEnded] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("loi-thoai");
  const [game, setGame] = useState<"memory" | "star">("memory");
  const [audioOn, setAudioOn] = useState(false);
  const [autoNext, setAutoNext] = useState(false);

  const line = Math.min(total - 1, Math.floor(clock / SECONDS_PER_LINE));
  const current = lesson.lines[line]!;

  useEffect(() => {
    setClock(0);
    setEnded(false);
    setPlaying(false);
  }, [lesson.id]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setClock((c) => {
        const next = c + 0.2 * speed;
        if (next >= total * SECONDS_PER_LINE) {
          setPlaying(false);
          setEnded(true);
          fox.addStars(3, "Bài học", lesson.title);
          return total * SECONDS_PER_LINE;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(t);
  }, [playing, speed, total, lesson.id]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing, speed]);

  useEffect(() => {
    if (!ended || !autoNext || !lesson.next) return;
    const t = setTimeout(() => navigate({ to: "/lesson/$id", params: { id: lesson.next! } }), 3000);
    return () => clearTimeout(t);
  }, [ended, autoNext]);

  function jump(i: number) {
    setClock(i * SECONDS_PER_LINE);
    setEnded(false);
  }

  function toggleAudio() {
    if (audioOn) {
      stopSpeaking();
      setAudioOn(false);
      return;
    }
    setAudioOn(true);
    lesson.lines.forEach((l, i) => setTimeout(() => speak(l.en, "en-US"), i * 3000));
    setTimeout(() => setAudioOn(false), lesson.lines.length * 3000);
  }

  const windowStart = Math.max(0, Math.min(line - 2, total - 5));
  const windowNums = Array.from({ length: Math.min(5, total) }, (_, k) => windowStart + k);

  return (
    <FoxLayout>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
            {lesson.emoji} {lesson.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lesson.titleEn} · {lesson.titleZh} — {lesson.level}
          </p>
        </div>
        <Link to="/truyen-ke" className="rounded-full border-2 border-border bg-card px-4 py-1.5 text-sm font-bold">
          ← Về thư viện truyện
        </Link>
      </div>

      {/* Smart Video Player */}
      <div className="overflow-hidden rounded-4xl border-2 border-border bg-card shadow-soft">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={lesson.video}
            className="size-full object-cover"
            loop
            muted
            playsInline
            onClick={() => setPlaying((p) => !p)}
          />

          {subs ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 px-4 text-center">
              <p className="mx-auto max-w-3xl rounded-t-2xl bg-black/55 px-3 py-1 text-sm font-bold text-white sm:text-base">
                {current.pinyin}
              </p>
              <p className="mx-auto max-w-3xl rounded-b-2xl bg-black/70 px-3 py-1.5 font-display text-base font-extrabold text-white sm:text-xl">
                {current.zh} · {current.en}
              </p>
            </div>
          ) : null}

          <button
            onClick={() => setVocabOpen(true)}
            title="Mở nhanh từ vựng"
            className="absolute right-3 top-3 grid size-12 place-items-center rounded-xl bg-primary font-display text-2xl font-extrabold text-primary-foreground shadow-soft"
          >
            词
          </button>

          <button
            onClick={() => setSubs((s) => !s)}
            className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-extrabold text-white"
          >
            {subs ? "💬 Tắt phụ đề" : "💬 Bật phụ đề"}
          </button>

          {!playing && !ended ? (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 grid place-items-center bg-black/25 text-6xl"
            >
              <span className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground">▶</span>
            </button>
          ) : null}

          {ended ? (
            <div className="absolute inset-0 grid place-items-center bg-primary/90 p-4 text-center">
              <div>
                <p className="text-5xl">🎉🦊</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-primary-foreground">
                  Hoan hô! Bé đã xem hết bài học và nhận 3 ⭐
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      setClock(0);
                      setEnded(false);
                      setPlaying(true);
                    }}
                    className="rounded-full bg-card px-5 py-2 font-bold text-primary"
                  >
                    🔄 Phát lại
                  </button>
                  {lesson.next ? (
                    <Link
                      to="/lesson/$id"
                      params={{ id: lesson.next }}
                      className="rounded-full bg-accent px-5 py-2 font-bold text-accent-foreground"
                    >
                      ⏭ Tập tiếp theo
                    </Link>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {[
                    { icon: "📄", label: "Lời thoại", go: "loi-thoai" },
                    { icon: "📕", label: "Từ vựng", go: "tu-vung" },
                    { icon: "✏️", label: "Đố vui", go: "do-vui" },
                    { icon: "✍️", label: "Bài tập", go: "bai-tap" },
                    { icon: "🎮", label: "Trò chơi", go: "tro-choi" },
                  ].map((b) => (
                    <button
                      key={b.go}
                      onClick={() => {
                        setTab(b.go as (typeof tabs)[number]["id"]);
                        setEnded(false);
                      }}
                      title={b.label}
                      className="grid size-14 place-items-center rounded-2xl bg-card text-2xl shadow-soft transition hover:-translate-y-1"
                    >
                      {b.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Dãy điều hướng câu */}
        <div className="flex items-center justify-center gap-2 border-t-2 border-border bg-secondary px-3 py-3">
          <button
            onClick={() => jump(Math.max(0, line - 1))}
            className="rounded-xl bg-card px-3 py-2 font-extrabold shadow-soft"
          >
            ◀◀
          </button>
          {windowNums.map((n) => (
            <button
              key={n}
              onClick={() => jump(n)}
              className={`size-11 rounded-xl border-4 font-extrabold shadow-soft transition ${
                n === line
                  ? "border-[oklch(0.62_0.14_205)] bg-card text-primary"
                  : "border-transparent bg-card text-foreground"
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            onClick={() => jump(Math.min(total - 1, line + 1))}
            className="rounded-xl bg-card px-3 py-2 font-extrabold shadow-soft"
          >
            ▶▶
          </button>
        </div>
      </div>

      {/* Tầng 1: công cụ */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-3xl border-2 border-border bg-card p-3 shadow-soft">
        <span className="text-xs font-extrabold text-muted-foreground">Tốc độ:</span>
        {[0.5, 0.75, 1].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded-full border-2 border-border px-3 py-1 text-sm font-extrabold ${
              speed === s ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            {s}x
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        <button
          onClick={toggleAudio}
          className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${
            audioOn ? "bg-destructive text-destructive-foreground" : "bg-pastel-sky text-foreground"
          }`}
        >
          {audioOn ? "⏹ Đang nghe MP3…" : "🎧 Nghe MP3 (kể trước giờ ngủ)"}
        </button>
        <button
          onClick={() => openPrintableBook(lesson, "a4")}
          className="rounded-full bg-pastel-mint px-4 py-1.5 text-sm font-extrabold"
        >
          🖨️ In truyện A4 tô màu
        </button>
        <button
          onClick={() => openPrintableBook(lesson, "mini")}
          className="rounded-full bg-pastel-lilac px-4 py-1.5 text-sm font-extrabold"
        >
          📓 Sách mini
        </button>
        <label className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-extrabold">
          <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} className="size-4" />
          Tự động chuyển bài
        </label>
        {lesson.next ? (
          <Link
            to="/lesson/$id"
            params={{ id: lesson.next }}
            className="ml-auto rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold text-primary-foreground"
          >
            ⏭ Tập tiếp theo
          </Link>
        ) : null}
      </div>

      {/* Tầng 2: 5 tab tương tác */}
      <div className="mt-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border-2 border-border px-4 py-2 text-sm font-extrabold shadow-soft transition ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "loi-thoai" ? <DialogueTab lesson={lesson} activeLine={line} onJump={jump} /> : null}
        {tab === "tu-vung" ? <VocabPanel vocab={lesson.vocab} /> : null}
        {tab === "do-vui" ? <QuizTab quiz={lesson.quiz} lessonTitle={lesson.title} /> : null}
        {tab === "bai-tap" ? <WorksheetTab lesson={lesson} /> : null}
        {tab === "tro-choi" ? (
          <div>
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setGame("memory")}
                className={`rounded-full border-2 border-border px-4 py-1.5 text-sm font-extrabold ${
                  game === "memory" ? "bg-accent text-accent-foreground" : "bg-card"
                }`}
              >
                🧩 Lật thẻ Memory
              </button>
              <button
                onClick={() => setGame("star")}
                className={`rounded-full border-2 border-border px-4 py-1.5 text-sm font-extrabold ${
                  game === "star" ? "bg-accent text-accent-foreground" : "bg-card"
                }`}
              >
                🚀 Vũ trụ Star Words
              </button>
            </div>
            {game === "memory" ? <MemoryGame /> : <StarWordsGame />}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {lessons
          .filter((l) => l.id !== lesson.id)
          .map((l) => (
            <Link
              key={l.id}
              to="/lesson/$id"
              params={{ id: l.id }}
              className="rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold shadow-soft"
            >
              {l.emoji} {l.title}
            </Link>
          ))}
      </div>

      {vocabOpen ? <VocabPanel vocab={lesson.vocab} asModal onClose={() => setVocabOpen(false)} /> : null}
    </FoxLayout>
  );
}
