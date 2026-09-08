import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FoxLayout, PageTitle } from "@/components/FoxLayout";
import { MemoryGame, PhonicsQuiz, StarWordsGame } from "@/components/FoxGames";

export const Route = createFileRoute("/tro-choi")({
  head: () => ({
    meta: [
      { title: "Trò chơi học ngoại ngữ — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Lật thẻ Memory, đố vui Phonics và game Vũ trụ Star Words giúp bé nhớ từ song ngữ.",
      },
      { property: "og:title", content: "Trò chơi học ngoại ngữ — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Chơi mà học: Memory, Phonics và Star Words." },
    ],
  }),
  component: GamesPage,
});

const tabs = [
  { id: "memory", label: "🧩 Lật thẻ Memory" },
  { id: "star", label: "🚀 Vũ trụ Star Words" },
  { id: "quiz", label: "🎯 Đố vui Phonics" },
] as const;

function GamesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("memory");
  return (
    <FoxLayout>
      <PageTitle emoji="🎮" title="Trò chơi" sub="Chơi vui để nhớ từ lâu hơn — mỗi lần thắng được thêm sao." />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border-2 border-border px-4 py-2 text-sm font-bold shadow-soft transition ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "memory" ? <MemoryGame /> : tab === "star" ? <StarWordsGame /> : <PhonicsQuiz />}
    </FoxLayout>
  );
}
