import { createFileRoute } from "@tanstack/react-router";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { learners } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";
import { speak } from "@/lib/speak";

export const Route = createFileRoute("/so-tu-vung")({
  head: () => ({
    meta: [
      { title: "Sổ từ vựng — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Sổ từ vựng cá nhân lưu ngay trên máy: từ tiếng Anh, chữ Hán, pinyin và nghĩa tiếng Việt.",
      },
      { property: "og:title", content: "Sổ từ vựng — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Những từ bé đã lưu trong quá trình học." },
    ],
  }),
  component: VocabPage,
});

function VocabPage() {
  const fox = useFox();
  const current = learners.find((l) => l.id === fox.state.currentId);
  const list = fox.state.vocab.filter((v) => v.learnerId === (current?.id ?? "mao"));

  return (
    <FoxLayout>
      <PageTitle
        emoji="📕"
        title="Sổ từ vựng"
        sub={`Những từ ${current ? current.name : "bé"} đã bấm ⭐ lưu lại trong lúc học.`}
      />
      {list.length === 0 ? (
        <p className="rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          Chưa có từ nào. Hãy vào một bài học và bấm ⭐ ở câu bé thích nhé!
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <div key={v.en} className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-xl font-extrabold text-primary">{v.en}</p>
                  <p className="text-lg font-bold text-foreground">
                    {v.zh} <span className="text-sm text-muted-foreground">{v.pinyin}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{v.vi}</p>
                </div>
                <button
                  onClick={() => fox.removeVocab(v.en)}
                  className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground"
                >
                  Xoá
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => speak(v.en, "en-US")}
                  className="rounded-full bg-pastel-sky px-3 py-1 text-sm font-bold"
                >
                  🔊 Anh
                </button>
                <button
                  onClick={() => speak(v.zh, "zh-CN")}
                  className="rounded-full bg-pastel-mint px-3 py-1 text-sm font-bold"
                >
                  🔊 Trung
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </FoxLayout>
  );
}
