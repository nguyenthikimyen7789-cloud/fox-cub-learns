import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FoxLayout } from "@/components/FoxLayout";
import { Button } from "@/components/ui/button";
import { getLessonDetail } from "@/lib/lesson-detail.functions";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/lessons/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết bài học — Học Viện Cáo Nhỏ" },
      { name: "description", content: "Bài đọc, từ vựng, trắc nghiệm và trò chơi ghép từ dành cho bé." },
      { property: "og:title", content: "Chi tiết bài học — Học Viện Cáo Nhỏ" },
      { property: "og:description", content: "Học ngoại ngữ vui nhộn qua bài đọc, từ vựng, câu hỏi và trò chơi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonDetailPage,
});

type LessonDetail = NonNullable<Awaited<ReturnType<typeof getLessonDetail>>>;
type Vocab = LessonDetail["lesson_vocabularies"][number];
type Quiz = LessonDetail["lesson_quizzes"][number];
type Game = LessonDetail["lesson_games"][number];
type MatchPair = { id: string; word: string; meaning: string };

function LessonDetailPage() {
  const { id } = Route.useParams();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getLessonDetail({ data: { lessonId: id } })
      .then((result) => {
        if (!active) return;
        setLesson(result);
        setError(result ? "" : "Không tìm thấy bài học này.");
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Không tải được bài học.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <FoxLayout>
        <div className="grid min-h-80 place-items-center text-center">
          <div><div className="animate-bounce text-6xl">🦊</div><p className="mt-3 font-bold text-muted-foreground">Cáo Nhỏ đang mở bài học...</p></div>
        </div>
      </FoxLayout>
    );
  }

  if (error || !lesson) {
    return (
      <FoxLayout>
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-border bg-card p-8 text-center shadow-soft">
          <div className="text-6xl">🗺️</div>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-primary">Chưa tìm thấy bài học</h1>
          <p className="mt-2 text-muted-foreground">{error || "Bài học này chưa sẵn sàng."}</p>
          <Button asChild className="mt-5 rounded-2xl"><Link to="/admin">Về trang quản trị</Link></Button>
        </div>
      </FoxLayout>
    );
  }

  const isChinese = lesson.language === "chinese";
  const reading = lesson.lesson_readings[0];
  return (
    <FoxLayout>
      <article className="space-y-7">
        <header className="relative overflow-hidden rounded-3xl border-2 border-border bg-pastel-peach px-5 py-7 shadow-soft sm:px-8">
          <div className="absolute right-5 top-3 text-7xl opacity-20" aria-hidden="true">{isChinese ? "🐼" : "🦊"}</div>
          <Link to="/admin" className="relative text-sm font-bold text-muted-foreground hover:text-foreground">← Danh sách bài học</Link>
          <h1 className="relative mt-3 max-w-3xl font-display text-3xl font-extrabold text-primary sm:text-4xl">{lesson.title}</h1>
          <div className="relative mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold text-primary-foreground">{lesson.level ?? "Chưa xếp cấp"}</span>
            <span className="rounded-full border-2 border-border bg-card px-4 py-1 text-sm font-extrabold text-foreground">{isChinese ? "🇨🇳 Tiếng Trung" : "🇬🇧 Tiếng Anh"}</span>
            <span className="rounded-full border-2 border-border bg-card px-4 py-1 text-sm font-bold text-muted-foreground">{lesson.status === "published" ? "Đã xuất bản" : "Bản nháp"}</span>
          </div>
          {lesson.reasoning ? <p className="relative mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{lesson.reasoning}</p> : null}
        </header>

        <ReadingSection content={reading?.content ?? ""} pinyin={reading?.pinyin_content ?? ""} isChinese={isChinese} />
        <VocabularySection vocabulary={lesson.lesson_vocabularies} />
        <QuizSection quiz={lesson.lesson_quizzes} />
        <MatchingGame games={lesson.lesson_games} vocabulary={lesson.lesson_vocabularies} />
      </article>
    </FoxLayout>
  );
}

function SectionHeading({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return <div><h2 className="font-display text-2xl font-extrabold text-foreground">{emoji} {title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>;
}

function ReadingSection({ content, pinyin, isChinese }: { content: string; pinyin: string; isChinese: boolean }) {
  const [showPinyin, setShowPinyin] = useState(true);
  return (
    <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading emoji="📖" title="Bài đọc" subtitle="Đọc chậm từng câu và chú ý cách phát âm nhé." />
        {isChinese ? <Button type="button" variant={showPinyin ? "default" : "outline"} onClick={() => setShowPinyin((value) => !value)} className="rounded-2xl">{showPinyin ? "Tắt Pinyin" : "Bật Pinyin"}</Button> : null}
      </div>
      <div className="mt-5 rounded-2xl bg-secondary p-5 sm:p-7">
        {isChinese && showPinyin && pinyin ? <p className="mb-3 whitespace-pre-line text-base font-bold leading-8 text-primary">{pinyin}</p> : null}
        <p className="whitespace-pre-line font-display text-xl font-bold leading-9 text-foreground">{content || "Bài đọc đang được cập nhật."}</p>
      </div>
    </section>
  );
}

function VocabularySection({ vocabulary }: { vocabulary: Vocab[] }) {
  return (
    <section>
      <SectionHeading emoji="📚" title="Từ vựng" subtitle={`${vocabulary.length} từ quan trọng trong bài học.`} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vocabulary.map((item, index) => (
          <div key={item.id} className={`rounded-3xl border-2 border-border p-5 shadow-soft ${index % 3 === 0 ? "bg-pastel-mint" : index % 3 === 1 ? "bg-pastel-sky" : "bg-pastel-lilac"}`}>
            <div className="flex items-start justify-between gap-2"><h3 className="font-display text-2xl font-extrabold text-primary">{item.word}</h3>{item.word_type ? <span className="rounded-full bg-card/80 px-2 py-1 text-xs font-bold text-muted-foreground">{item.word_type}</span> : null}</div>
            {item.pronunciation ? <p className="mt-1 font-bold text-muted-foreground">{item.pronunciation}</p> : null}
            <p className="mt-3 font-extrabold text-foreground">{item.meaning || "Chưa có nghĩa"}</p>
            {item.example ? <div className="mt-4 border-t-2 border-border/60 pt-3"><p className="text-sm font-bold text-foreground">“{item.example}”</p>{item.example_meaning ? <p className="mt-1 text-xs text-muted-foreground">{item.example_meaning}</p> : null}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function toOptions(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function QuizSection({ quiz }: { quiz: Quiz[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  return (
    <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft sm:p-7">
      <SectionHeading emoji="✏️" title="Trắc nghiệm" subtitle="Chọn một đáp án để xem kết quả và lời giải ngay." />
      <div className="mt-5 space-y-5">
        {quiz.map((item, questionIndex) => {
          const selected = answers[item.id];
          const options = toOptions(item.options);
          const correct = selected === item.correct_answer;
          return (
            <div key={item.id} className="rounded-2xl border-2 border-border bg-background p-4 sm:p-5">
              <p className="font-display text-lg font-extrabold text-foreground"><span className="mr-2 text-primary">Câu {questionIndex + 1}.</span>{item.question}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {options.map((option, optionIndex) => {
                  const isPicked = selected === option;
                  const isAnswer = option === item.correct_answer;
                  const state = selected ? (isAnswer ? "border-primary bg-pastel-mint" : isPicked ? "border-destructive bg-destructive/15" : "border-border bg-card opacity-60") : "border-border bg-card hover:border-primary";
                  return <Button key={`${item.id}-${option}`} type="button" variant="outline" disabled={Boolean(selected)} onClick={() => setAnswers((old) => ({ ...old, [item.id]: option }))} className={`h-auto min-h-12 justify-start whitespace-normal rounded-2xl border-2 px-4 py-3 text-left ${state}`}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-extrabold">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span></Button>;
                })}
              </div>
              {selected ? <div className={`mt-4 rounded-2xl p-3 text-sm ${correct ? "bg-pastel-mint" : "bg-destructive/15"}`}><p className="font-extrabold text-foreground">{correct ? "✅ Chính xác! Giỏi lắm!" : `❌ Chưa đúng. Đáp án là: ${item.correct_answer ?? "—"}`}</p>{item.explanation ? <p className="mt-1 text-muted-foreground">{item.explanation}</p> : null}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function readGameItems(game: Game | undefined): string[] {
  const data = game?.game_data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];
  const items = data.items;
  return Array.isArray(items) ? items.filter((item): item is string => typeof item === "string") : [];
}

function gameDescription(game: Game | undefined): string {
  const data = game?.game_data;
  return data && typeof data === "object" && !Array.isArray(data) && typeof data.description === "string" ? data.description : "Ghép mỗi từ với đúng nghĩa tiếng Việt của từ đó.";
}

function makePairs(game: Game | undefined, vocabulary: Vocab[]): MatchPair[] {
  const items = readGameItems(game);
  const splitPairs = items.map((item, index) => {
    const parts = item.split(/\s*(?:=|:|—|–|\|)\s*/);
    return parts.length >= 2 ? { id: `game-${index}`, word: parts[0] ?? "", meaning: parts.slice(1).join(" — ") } : null;
  }).filter((item): item is MatchPair => Boolean(item?.word && item.meaning));
  if (splitPairs.length >= 2) return splitPairs.slice(0, 6);
  const fromVocab = vocabulary.filter((item) => item.word && item.meaning).slice(0, 6).map((item) => ({ id: item.id, word: item.word, meaning: item.meaning ?? "" }));
  return fromVocab.length >= 2 ? fromVocab : items.slice(0, 6).map((item, index) => ({ id: `item-${index}`, word: item, meaning: `Từ số ${index + 1}` }));
}

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function MatchingGame({ games, vocabulary }: { games: Game[]; vocabulary: Vocab[] }) {
  const matchingGame = games.find((game) => game.game_type.toLowerCase().includes("match")) ?? games[0];
  const pairs = useMemo(() => makePairs(matchingGame, vocabulary), [matchingGame, vocabulary]);
  const [words, setWords] = useState(() => shuffled(pairs));
  const [meanings, setMeanings] = useState(() => shuffled(pairs));
  const [wordId, setWordId] = useState<string | null>(null);
  const [meaningId, setMeaningId] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistake, setMistake] = useState(false);

  useEffect(() => {
    setWords(shuffled(pairs)); setMeanings(shuffled(pairs)); setWordId(null); setMeaningId(null); setMatched([]); setMistake(false);
  }, [pairs]);

  useEffect(() => {
    if (!wordId || !meaningId) return;
    if (wordId === meaningId) { setMatched((old) => [...old, wordId]); setWordId(null); setMeaningId(null); setMistake(false); }
    else { setMistake(true); const timer = window.setTimeout(() => { setWordId(null); setMeaningId(null); setMistake(false); }, 650); return () => window.clearTimeout(timer); }
  }, [wordId, meaningId]);

  function restart() { setWords(shuffled(pairs)); setMeanings(shuffled(pairs)); setWordId(null); setMeaningId(null); setMatched([]); setMistake(false); }

  return (
    <section className="rounded-3xl border-2 border-border bg-pastel-sky p-5 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><SectionHeading emoji="🎮" title="Ghép từ" subtitle={gameDescription(matchingGame)} /><div className="rounded-full bg-card px-4 py-2 text-sm font-extrabold text-primary">{matched.length}/{pairs.length} cặp</div></div>
      {pairs.length < 2 ? <p className="mt-5 rounded-2xl bg-card p-4 text-muted-foreground">Trò chơi đang chờ thêm dữ liệu từ vựng.</p> : <>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-card"><div className="h-full bg-primary transition-all" style={{ width: `${(matched.length / pairs.length) * 100}%` }} /></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5">
          <div className="space-y-3">{words.map((pair) => <Button key={`word-${pair.id}`} type="button" variant="outline" disabled={matched.includes(pair.id)} onClick={() => setWordId(pair.id)} className={`h-auto min-h-14 w-full whitespace-normal rounded-2xl border-2 px-3 py-3 text-base font-extrabold ${matched.includes(pair.id) ? "border-primary bg-pastel-mint opacity-50" : wordId === pair.id ? mistake ? "border-destructive bg-destructive/15" : "border-primary bg-accent" : "bg-card"}`}>{pair.word}</Button>)}</div>
          <div className="space-y-3">{meanings.map((pair) => <Button key={`meaning-${pair.id}`} type="button" variant="outline" disabled={matched.includes(pair.id)} onClick={() => setMeaningId(pair.id)} className={`h-auto min-h-14 w-full whitespace-normal rounded-2xl border-2 px-3 py-3 text-sm font-bold ${matched.includes(pair.id) ? "border-primary bg-pastel-mint opacity-50" : meaningId === pair.id ? mistake ? "border-destructive bg-destructive/15" : "border-primary bg-accent" : "bg-card"}`}>{pair.meaning}</Button>)}</div>
        </div>
        {matched.length === pairs.length ? <div className="mt-5 rounded-2xl bg-pastel-mint p-5 text-center"><div className="text-5xl">🎉</div><p className="mt-2 font-display text-xl font-extrabold text-primary">Bé đã ghép đúng tất cả!</p><Button type="button" onClick={restart} className="mt-3 rounded-2xl">🔄 Chơi lại</Button></div> : mistake ? <p className="mt-4 text-center font-bold text-destructive">Chưa đúng cặp rồi, thử lại nhé!</p> : <p className="mt-4 text-center text-sm font-bold text-muted-foreground">Chọn một thẻ ở mỗi cột để ghép cặp.</p>}
      </>}
    </section>
  );
}