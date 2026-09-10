import { useRef, useState } from "react";
import { toast } from "sonner";
import { speak } from "@/lib/speak";
import { useFox } from "@/lib/foxstore";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'’“”。，！？、…]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 100;
  const m = x.length;
  const n = y.length;
  const prev = new Array(n + 1).fill(0).map((_, j) => j);
  const cur = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    for (let j = 0; j <= n; j++) prev[j] = cur[j];
  }
  const dist = prev[n];
  return Math.max(0, Math.round((1 - dist / Math.max(m, n)) * 100));
}

function scoreOf(pct: number) {
  if (pct >= 90) return { stars: 3, label: "Xuất sắc! 🎉" };
  if (pct >= 75) return { stars: 2, label: "Rất tốt!" };
  if (pct >= 50) return { stars: 1, label: "Khá lắm!" };
  return { stars: 0, label: "Cố lên, bé thử lại nhé! 💪" };
}

export function SentenceTools({
  text,
  lang,
  title,
  onDictateChange,
}: {
  text: string;
  lang: "Anh" | "Trung";
  title: string;
  onDictateChange?: (open: boolean) => void;
}) {
  const fox = useFox();
  const speechLang = lang === "Anh" ? "en-US" : "zh-CN";
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<{ pct: number; stars: number; label: string; heard: string } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [dictating, setDictating] = useState(false);
  const [typed, setTyped] = useState("");
  const [check, setCheck] = useState<null | { ok: boolean; wrong: number[] }>(null);
  const recRef = useRef<any>(null);

  function shadow() {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Trình duyệt của bé chưa hỗ trợ micro. Hãy thử Chrome nhé!");
      return;
    }
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = speechLang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      setResult(null);
      setListening(true);
      rec.onresult = (e: any) => {
        const heard = String(e.results[0][0].transcript ?? "");
        const pct = similarity(heard, text);
        const s = scoreOf(pct);
        setResult({ pct, heard, ...s });
        if (s.stars > 0) fox.addStars(s.stars, "Nói nhại", title);
        if (s.stars === 3) {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 1800);
        }
      };
      rec.onerror = () => {
        setListening(false);
        toast.error("Chưa nghe rõ, bé thử lại nhé!");
      };
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  }

  function stopShadow() {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  }

  function doCheck() {
    const target = normalize(text);
    const got = normalize(typed);
    if (target === got) {
      setCheck({ ok: true, wrong: [] });
      fox.addStars(2, "Chép chính tả", title);
      toast.success("Chính xác! +2 sao");
      return;
    }
    const tWords = target.split(" ");
    const gWords = got.split(" ");
    const wrong: number[] = [];
    gWords.forEach((w, i) => {
      if (tWords[i] !== w) wrong.push(i);
    });
    if (gWords.length < tWords.length) wrong.push(gWords.length);
    setCheck({ ok: false, wrong });
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => speak(text, speechLang)}
          className="rounded-full bg-pastel-sky px-3 py-1 text-xs font-extrabold"
        >
          🔊 Nghe câu
        </button>
        <button
          onClick={() => (listening ? stopShadow() : shadow())}
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            listening ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {listening ? "⏹ Dừng nghe" : "🎤 Nói nhại"}
        </button>
        <button
          onClick={() => {
            setDictating((d) => {
              onDictateChange?.(!d);
              return !d;
            });
            setCheck(null);
          }}
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            dictating ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
          }`}
        >
          ✍️ Chép chính tả
        </button>
      </div>

      {listening ? (
        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-pastel-mint px-3 py-2">
          <span className="flex items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-primary"
                style={{
                  height: 8 + (i % 3) * 6,
                  animation: `fox-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
                }}
              />
            ))}
          </span>
          <span className="text-xs font-extrabold text-foreground">Đang nghe bé nói...</span>
        </div>
      ) : null}

      {result ? (
        <div className="relative mt-2 rounded-2xl border-2 border-border bg-background px-3 py-2">
          <p className="text-sm font-extrabold text-foreground">
            {"⭐".repeat(result.stars) || "☆"} {result.label}{" "}
            <span className="text-muted-foreground">({result.pct}% giống)</span>
          </p>
          <p className="text-xs text-muted-foreground">Bé đã nói: “{result.heard}”</p>
          {confetti ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden text-lg">
              {["🎉", "✨", "🎊", "⭐", "🌸", "🎈"].map((c, i) => (
                <span
                  key={i}
                  className="absolute"
                  style={{ left: `${8 + i * 15}%`, animation: `fox-fall 1.6s ease-in ${i * 0.1}s forwards` }}
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {dictating ? (
        <div className="mt-2 rounded-2xl border-2 border-border bg-secondary/50 p-3">
          <p className="mb-2 text-xs font-bold text-muted-foreground">Nhớ lại và gõ đúng câu mẫu nhé!</p>
          <input
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              setCheck(null);
            }}
            placeholder="Gõ lại câu ở đây…"
            className={`w-full rounded-xl border-2 bg-card px-3 py-2 text-sm font-bold outline-none ${
              check?.ok
                ? "border-[oklch(0.65_0.16_150)]"
                : check && !check.ok
                  ? "border-destructive"
                  : "border-border"
            }`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={doCheck}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-extrabold text-primary-foreground"
            >
              Kiểm tra
            </button>
            {check?.ok ? (
              <span className="text-xs font-extrabold text-[oklch(0.5_0.14_150)]">Chính xác! +2 sao ⭐⭐</span>
            ) : check ? (
              <span className="text-xs font-bold text-muted-foreground">
                Bé sửa lại các từ tô đỏ nhé:{" "}
                {normalize(typed)
                  .split(" ")
                  .map((w, i) => (
                    <span key={i} className={check.wrong.includes(i) ? "text-destructive underline" : ""}>
                      {w}{" "}
                    </span>
                  ))}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const dictationBlurClass = "blur-[2px] opacity-70 transition";
