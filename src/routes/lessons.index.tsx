import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FoxLayout } from "@/components/FoxLayout";
import { Button } from "@/components/ui/button";
import { listPublishedLessons } from "@/lib/lesson-detail.functions";

export const Route = createFileRoute("/lessons/")({
  head: () => ({
    meta: [
      { title: "Thư viện bài học — Học Viện Cáo Nhỏ" },
      { name: "description", content: "Danh sách bài học Anh – Trung đã xuất bản với bài đọc, từ vựng, trắc nghiệm và trò chơi." },
      { property: "og:title", content: "Thư viện bài học — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Chọn một bài học song ngữ để cùng Cáo Nhỏ đọc, học từ và chơi trò ghép từ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonsIndexPage,
});

type Lesson = Awaited<ReturnType<typeof listPublishedLessons>>[number];

function LessonsIndexPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listPublishedLessons()
      .then((rows) => {
        if (active) setLessons(rows);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Không tải được danh sách bài học.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <FoxLayout>
      <header className="mb-6 rounded-3xl border-2 border-border bg-pastel-peach px-5 py-7 shadow-soft sm:px-8">
        <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">📚 Thư viện bài học</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Những bài học Cáo Nhỏ đã soạn xong: có bài đọc, từ vựng, câu đố, phiếu bài tập và trò chơi ghép từ.
        </p>
      </header>

      {loading ? (
        <div className="grid min-h-60 place-items-center text-center">
          <div>
            <div className="animate-bounce text-6xl">🦊</div>
            <p className="mt-3 font-bold text-muted-foreground">Đang mở thư viện...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border-2 border-border bg-card p-8 text-center shadow-soft">
          <p className="font-bold text-muted-foreground">{error}</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="rounded-3xl border-2 border-border bg-card p-8 text-center shadow-soft">
          <div className="text-6xl">🌱</div>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-primary">Chưa có bài học nào được xuất bản</h2>
          <p className="mt-2 text-muted-foreground">Bố mẹ hãy vào phòng quản trị để tạo và xuất bản bài học nhé.</p>
          <Button asChild className="mt-5 rounded-2xl">
            <Link to="/admin">Vào phòng quản trị</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              to="/lessons/$id"
              params={{ id: lesson.id }}
              className={`rounded-3xl border-2 border-border p-5 shadow-soft transition hover:-translate-y-1 ${
                index % 3 === 0 ? "bg-pastel-mint" : index % 3 === 1 ? "bg-pastel-sky" : "bg-pastel-lilac"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl">{lesson.language === "chinese" ? "🐼" : "🦊"}</span>
                <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-extrabold text-muted-foreground">
                  {lesson.level ?? "Chưa xếp cấp"}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-extrabold text-primary">{lesson.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{lesson.reasoning ?? "Bài học song ngữ vui nhộn."}</p>
              <p className="mt-4 text-sm font-extrabold text-foreground">
                {lesson.language === "chinese" ? "🇨🇳 Tiếng Trung" : "🇬🇧 Tiếng Anh"} · Bắt đầu học →
              </p>
            </Link>
          ))}
        </div>
      )}
    </FoxLayout>
  );
}
