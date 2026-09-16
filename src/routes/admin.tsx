import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { submitAndProcessLesson } from "@/lib/process-lesson.functions";
import { listInputs, listLessons, setLessonStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Bảng điều khiển biên soạn — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content:
          "Nhập link hoặc văn bản, để trợ lý tự soạn bài học song ngữ Anh – Trung rồi xuất bản cho cả nhà.",
      },
      { property: "og:title", content: "Bảng điều khiển biên soạn — Học Viện Cáo Nhỏ" },
      {
        property: "og:description",
        content: "Tạo bài học tự động và xuất bản chỉ với một nút bấm.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

type SourceKey = "youtube" | "tiktok" | "text" | "audio" | "drive";

const sources: Array<{ key: SourceKey; label: string; emoji: string; needsLink: boolean }> = [
  { key: "youtube", label: "YouTube", emoji: "▶️", needsLink: true },
  { key: "tiktok", label: "TikTok", emoji: "🎬", needsLink: true },
  { key: "text", label: "Văn bản", emoji: "📝", needsLink: false },
  { key: "audio", label: "Âm thanh", emoji: "🎧", needsLink: true },
  { key: "drive", label: "Google Drive", emoji: "📁", needsLink: true },
];

type InputRow = Awaited<ReturnType<typeof listInputs>>[number];
type LessonRow = Awaited<ReturnType<typeof listLessons>>[number];

const statusLabel: Record<string, string> = {
  pending: "Đang chờ",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
  failed: "Thất bại",
};

const statusTint: Record<string, string> = {
  pending: "bg-pastel-sky",
  processing: "bg-pastel-lilac",
  completed: "bg-pastel-mint",
  failed: "bg-destructive/15",
};

function AdminDashboard() {
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [pinErr, setPinErr] = useState("");

  const [source, setSource] = useState<SourceKey>("youtube");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [inputs, setInputs] = useState<InputRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(false);

  const current = sources.find((s) => s.key === source)!;

  async function refresh() {
    setLoading(true);
    try {
      const [i, l] = await Promise.all([listInputs(), listLessons()]);
      setInputs(i);
      setLessons(l);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tải được dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ok) void refresh();
  }, [ok]);

  async function onFile(file: File) {
    if (file.size > 400_000) {
      toast.error("Tệp quá lớn, hãy chọn tệp văn bản nhỏ hơn 400KB.");
      return;
    }
    const content = await file.text();
    setText(content);
    setSource("text");
    toast.success("Đã đọc nội dung tệp.");
  }

  async function onSubmit() {
    const hasLink = link.trim().length > 0;
    const hasText = text.trim().length > 0;
    if (!hasLink && !hasText) {
      toast.error("Hãy dán link hoặc nhập nội dung trước nhé.");
      return;
    }
    setBusy(true);
    try {
      const sourceType =
        source === "drive" ? (hasText ? "text" : "audio") : source;
      const res = await submitAndProcessLesson({
        data: {
          sourceType: sourceType as "youtube" | "tiktok" | "audio" | "image" | "text",
          sourceUrl: hasLink ? link.trim() : null,
          rawContent: hasText ? text.trim() : null,
        },
      });
      toast.success(`Đã tạo bài học: ${res.title}`);
      setLink("");
      setText("");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tạo bài học thất bại.");
    } finally {
      setBusy(false);
    }
  }

  async function publish(lessonId: string, status: "draft" | "published") {
    try {
      await setLessonStatus({ data: { lessonId, status } });
      toast.success(status === "published" ? "Đã xuất bản!" : "Đã chuyển về nháp.");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không đổi được trạng thái.");
    }
  }

  if (!ok) {
    return (
      <FoxLayout>
        <div className="mx-auto max-w-sm rounded-4xl border-2 border-border bg-card p-6 text-center shadow-soft">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-primary">
            Bảng điều khiển biên soạn
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Nhập mã PIN của phụ huynh.</p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) =>
              e.key === "Enter" && (pin === "1234" ? setOk(true) : setPinErr("Mã PIN chưa đúng."))
            }
            inputMode="numeric"
            placeholder="••••"
            className="mt-4 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none focus:border-primary"
          />
          {pinErr ? <p className="mt-2 text-sm font-bold text-destructive">{pinErr}</p> : null}
          <button
            onClick={() => (pin === "1234" ? setOk(true) : setPinErr("Mã PIN chưa đúng."))}
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
      <PageTitle
        emoji="🪄"
        title="Tạo bài học tự động"
        sub="Dán link hoặc nội dung, Cáo Nhỏ sẽ soạn bài học hoàn chỉnh cho bé."
      />

      <section className="rounded-4xl border-2 border-border bg-card p-5 shadow-soft">
        <p className="mb-2 font-bold text-foreground">1. Chọn nguồn</p>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button
              key={s.key}
              onClick={() => setSource(s.key)}
              className={`rounded-2xl border-2 px-4 py-2 font-bold transition ${
                source === s.key
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-5 font-bold text-foreground">2. Dán link hoặc nhập nội dung</p>
        {current.needsLink ? (
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        ) : null}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Dán transcript, lời bài hát hoặc đoạn văn ở đây..."
          className="mt-3 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 outline-none focus:border-primary"
        />

        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground">
          📎 Tải tệp văn bản (.txt)
          <input
            type="file"
            accept=".txt,.srt,.vtt,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </label>

        <button
          onClick={() => void onSubmit()}
          disabled={busy}
          className="mt-5 w-full rounded-2xl bg-primary px-4 py-3 font-display text-lg font-extrabold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Đang soạn bài, chờ chút nhé..." : "✨ Tạo Bài Học Tự Động"}
        </button>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold text-foreground">Hàng chờ xử lý</h2>
        <button
          onClick={() => void refresh()}
          className="rounded-full border-2 border-border px-3 py-1 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          {loading ? "Đang tải..." : "🔄 Làm mới"}
        </button>
      </div>

      <div className="mt-2 grid gap-2">
        {inputs.length === 0 ? (
          <p className="rounded-3xl border-2 border-border bg-card p-4 text-muted-foreground">
            Chưa có dữ liệu nào được gửi.
          </p>
        ) : (
          inputs.map((i) => (
            <div
              key={i.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-3xl border-2 border-border p-3 ${
                statusTint[i.status] ?? "bg-card"
              }`}
            >
              <span className="font-bold text-foreground">
                {i.source_type} ·{" "}
                <span className="font-normal text-muted-foreground">
                  {(i.source_url ?? i.raw_content ?? "").slice(0, 70) || "—"}
                </span>
              </span>
              <span className="rounded-full bg-card px-3 py-1 text-sm font-extrabold text-foreground">
                {statusLabel[i.status] ?? i.status}
              </span>
            </div>
          ))
        )}
      </div>

      <h2 className="mt-6 font-display text-xl font-extrabold text-foreground">
        Bài học đã tạo
      </h2>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {lessons.length === 0 ? (
          <p className="rounded-3xl border-2 border-border bg-card p-4 text-muted-foreground">
            Chưa có bài học nào.
          </p>
        ) : (
          lessons.map((l) => (
            <div key={l.id} className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-lg font-extrabold text-foreground">{l.title}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold ${
                    l.status === "published"
                      ? "bg-pastel-mint text-foreground"
                      : "bg-pastel-peach text-foreground"
                  }`}
                >
                  {l.status === "published" ? "Đã xuất bản" : "Nháp"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {l.language === "chinese" ? "🇨🇳 Tiếng Trung" : "🇬🇧 Tiếng Anh"} · {l.level ?? "—"}
              </p>
              {l.reasoning ? (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{l.reasoning}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/lesson/$id"
                  params={{ id: l.id }}
                  className="rounded-2xl border-2 border-border px-3 py-1.5 text-sm font-bold text-foreground"
                >
                  👀 Xem trước
                </Link>
                <button
                  onClick={() => void publish(l.id, l.status === "published" ? "draft" : "published")}
                  className="rounded-2xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground"
                >
                  {l.status === "published" ? "↩️ Về nháp" : "🚀 Xuất bản"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </FoxLayout>
  );
}
