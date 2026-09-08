import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FoxLayout } from "@/components/FoxLayout";
import { learners } from "@/lib/foxdata";
import { useFox } from "@/lib/foxstore";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Chọn người học — Học Viện Cáo Nhỏ" },
      {
        name: "description",
        content: "Hôm nay ai cùng học với Cáo Nhỏ? Chọn Bé Tý, Bé Mão, Bé Dậu hoặc khu Bố & Mẹ.",
      },
      { property: "og:title", content: "Chọn người học — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Hôm nay ai cùng học với Cáo Nhỏ?" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const fox = useFox();
  const navigate = useNavigate();
  const [pinFor, setPinFor] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function choose(id: string) {
    const l = learners.find((x) => x.id === id)!;
    if (l.pin) {
      setPinFor(id);
      setPin("");
      setError("");
      return;
    }
    fox.selectLearner(id);
    navigate({ to: "/" });
  }

  function submitPin() {
    const l = learners.find((x) => x.id === pinFor)!;
    if (pin === l.pin) {
      fox.selectLearner(l.id);
      setPinFor(null);
      navigate({ to: "/pro-zone" });
    } else {
      setError("Mã PIN chưa đúng, thử lại nhé!");
    }
  }

  return (
    <FoxLayout>
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
          Hôm nay ai cùng học với Cáo Nhỏ? 🦊
        </h1>
        <p className="mt-2 text-muted-foreground">Chạm vào ảnh của mình để bắt đầu buổi học.</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {learners.map((l) => {
          const stars = fox.state.stars[l.id] ?? 0;
          return (
            <button
              key={l.id}
              onClick={() => choose(l.id)}
              className={`rounded-4xl border-2 border-border p-6 text-center shadow-soft transition hover:-translate-y-1 ${
                l.pro ? "bg-secondary" : "bg-card"
              }`}
            >
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-pastel-peach text-5xl">
                {l.emoji}
              </div>
              <h2 className="mt-3 font-display text-xl font-extrabold text-foreground">{l.name}</h2>
              <p className="text-sm font-bold text-primary">{l.level}</p>
              <p className="mt-2 min-h-10 text-sm text-muted-foreground">{l.desc}</p>
              <p className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
                ⭐ {stars}
              </p>
              {l.pro ? (
                <p className="mt-2 text-xs font-bold text-muted-foreground">Cần mã PIN để vào</p>
              ) : (
                <p className="mt-2 text-xs font-bold text-muted-foreground">Vào thẳng, không cần PIN</p>
              )}
            </button>
          );
        })}
      </div>

      {pinFor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 text-center shadow-soft">
            <div className="text-5xl">🔒</div>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-primary">Pro Zone của Bố & Mẹ</h2>
            <p className="mt-1 text-sm text-muted-foreground">Nhập mã PIN 4 số để vào khu luyện nói.</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => e.key === "Enter" && submitPin()}
              inputMode="numeric"
              placeholder="••••"
              className="mt-4 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none focus:border-primary"
            />
            {error ? <p className="mt-2 text-sm font-bold text-destructive">{error}</p> : null}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPinFor(null)}
                className="flex-1 rounded-2xl border-2 border-border bg-secondary px-4 py-2.5 font-bold"
              >
                Quay lại
              </button>
              <button
                onClick={submitPin}
                className="flex-1 rounded-2xl bg-primary px-4 py-2.5 font-bold text-primary-foreground"
              >
                Vào học
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </FoxLayout>
  );
}
