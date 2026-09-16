// Server-only: biên soạn bài học từ dữ liệu thô trong bảng `inputs`.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const AI_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

const SYSTEM_PROMPT = `Bạn là chuyên gia biên soạn giáo trình song ngữ Anh - Trung cho trẻ em và gia đình Việt Nam,
theo chuẩn Little Fox và Oxford Phonics. Từ nội dung thô người dùng cung cấp (transcript, văn bản, hoặc mô tả URL),
hãy biên soạn MỘT bài học hoàn chỉnh.

Quy tắc:
- Mọi phần giải thích, nghĩa từ, câu hỏi hướng dẫn phải bằng TIẾNG VIỆT.
- Nếu ngôn ngữ học là tiếng Trung: reading_text là chữ Hán giản thể, pinyin_text là pinyin có dấu thanh tương ứng từng dòng.
- Nếu ngôn ngữ học là tiếng Anh: reading_text là tiếng Anh, pinyin_text để chuỗi rỗng.
- level: dùng A1-C2 cho tiếng Anh, HSK 1-6 cho tiếng Trung.
- reasoning: giải thích ngắn gọn bằng tiếng Việt vì sao chọn cấp độ và cách khai thác bài học.
- vocabulary: 8-12 từ. quiz: 5 câu, mỗi câu 4 lựa chọn, correct_answer phải trùng đúng một phần tử trong options.
- worksheet: 5 câu bài tập điền khuyết hoặc nối từ. game_ideas: 2-3 ý tưởng trò chơi (memory, star_words, matching...).`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "language",
    "level",
    "reasoning",
    "reading_text",
    "pinyin_text",
    "vocabulary",
    "quiz",
    "worksheet",
    "game_ideas",
  ],
  properties: {
    title: { type: "string" },
    language: { type: "string", enum: ["english", "chinese"] },
    level: { type: "string" },
    reasoning: { type: "string" },
    reading_text: { type: "string" },
    pinyin_text: { type: "string" },
    vocabulary: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "word",
          "pronunciation",
          "word_type",
          "meaning",
          "example",
          "example_meaning",
        ],
        properties: {
          word: { type: "string" },
          pronunciation: { type: "string" },
          word_type: { type: "string" },
          meaning: { type: "string" },
          example: { type: "string" },
          example_meaning: { type: "string" },
        },
      },
    },
    quiz: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "options", "correct_answer", "explanation"],
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correct_answer: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
    worksheet: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "correct_answer"],
        properties: {
          question: { type: "string" },
          correct_answer: { type: "string" },
        },
      },
    },
    game_ideas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["game_type", "game_data"],
        properties: {
          game_type: { type: "string" },
          game_data: {
            type: "object",
            additionalProperties: false,
            required: ["description", "items"],
            properties: {
              description: { type: "string" },
              items: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
  },
} as const;

export type LessonDraft = {
  title: string;
  language: "english" | "chinese";
  level: string;
  reasoning: string;
  reading_text: string;
  pinyin_text: string;
  vocabulary: Array<{
    word: string;
    pronunciation: string;
    word_type: string;
    meaning: string;
    example: string;
    example_meaning: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
  }>;
  worksheet: Array<{ question: string; correct_answer: string }>;
  game_ideas: Array<{
    game_type: string;
    game_data: { description: string; items: string[] };
  }>;
};

/** Gọi Lovable AI Gateway (Responses API, streaming bắt buộc) và gom text kết quả. */
async function generateLesson(
  userContent: string,
  runId?: string,
): Promise<LessonDraft> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Thiếu LOVABLE_API_KEY.");

  const res = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
      ...(runId ? { "X-Lovable-AIG-Run-ID": runId } : {}),
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: userContent }],
        },
      ],
      stream: true,
      store: false,
      reasoning: { effort: "medium", summary: "auto" },
      text: {
        format: {
          type: "json_schema",
          name: "lesson_draft",
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`AI Gateway lỗi ${res.status}: ${detail.slice(0, 500)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let deltaText = "";
  let finalText = "";

  type ResponseEvent = {
    type?: string;
    delta?: string;
    text?: string;
    response?: {
      output_text?: string | string[];
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
  };

  const extractFinal = (evt: ResponseEvent): string => {
    const ot = evt.response?.output_text;
    if (typeof ot === "string" && ot) return ot;
    if (Array.isArray(ot) && ot.length) return ot.join("");
    const items = evt.response?.output ?? [];
    let out = "";
    for (const item of items) {
      for (const part of item.content ?? []) {
        if (part?.type === "output_text" && part.text) out += part.text;
      }
    }
    return out;
  };

  const handleLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") return;
    let evt: ResponseEvent;
    try {
      evt = JSON.parse(payload) as ResponseEvent;
    } catch {
      return; // bỏ qua chunk không hợp lệ
    }
    if (evt.type === "response.output_text.delta" && evt.delta) {
      deltaText += evt.delta;
    } else if (evt.type === "response.output_text.done" && evt.text) {
      finalText = evt.text;
    } else if (
      evt.type === "response.completed" ||
      evt.type === "response.incomplete" ||
      evt.type === "response.failed"
    ) {
      const done = extractFinal(evt);
      if (done) finalText = done;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) handleLine(line);
  }
  buffer += decoder.decode();
  for (const line of buffer.split("\n")) handleLine(line);

  const text = (finalText || deltaText).trim();
  if (!text) throw new Error("AI không trả về nội dung bài học.");
  try {
    return JSON.parse(text) as LessonDraft;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1)) as LessonDraft;
    }
    throw new Error("Kết quả AI không phải JSON hợp lệ.");
  }
}

export type ProcessResult = {
  inputId: string;
  lessonId: string;
  title: string;
  language: "english" | "chinese";
  level: string;
};

/** Xử lý một bản ghi `inputs`: gọi AI, chèn dữ liệu bài học, cập nhật trạng thái. */
export async function processLessonInput(
  inputId: string,
  runId?: string,
): Promise<ProcessResult> {
  const { data: input, error: inputError } = await supabaseAdmin
    .from("inputs")
    .select("id, source_type, source_url, raw_content, status")
    .eq("id", inputId)
    .maybeSingle();

  if (inputError) throw new Error(inputError.message);
  if (!input) throw new Error("Không tìm thấy dữ liệu đầu vào.");

  await supabaseAdmin
    .from("inputs")
    .update({ status: "processing" })
    .eq("id", inputId);

  try {
    const parts = [
      `Loại nguồn: ${input.source_type}`,
      input.source_url ? `URL nguồn: ${input.source_url}` : "",
      input.raw_content ? `Nội dung thô:\n${input.raw_content}` : "",
    ].filter(Boolean);

    if (!input.raw_content && !input.source_url) {
      throw new Error("Bản ghi đầu vào không có nội dung lẫn URL.");
    }

    const draft = await generateLesson(parts.join("\n\n"), runId);

    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from("lessons")
      .insert({
        input_id: inputId,
        title: draft.title,
        language: draft.language,
        level: draft.level,
        reasoning: draft.reasoning,
        status: "draft",
      })
      .select("id")
      .single();

    if (lessonError || !lesson) {
      throw new Error(lessonError?.message ?? "Không tạo được bài học.");
    }

    const lessonId = lesson.id;

    const { error: readingError } = await supabaseAdmin
      .from("lesson_readings")
      .insert({
        lesson_id: lessonId,
        content: draft.reading_text,
        pinyin_content: draft.pinyin_text || null,
      });
    if (readingError) throw new Error(readingError.message);

    if (draft.vocabulary?.length) {
      const { error } = await supabaseAdmin.from("lesson_vocabularies").insert(
        draft.vocabulary.map((v) => ({
          lesson_id: lessonId,
          word: v.word,
          pronunciation: v.pronunciation || null,
          word_type: v.word_type || null,
          meaning: v.meaning || null,
          example: v.example || null,
          example_meaning: v.example_meaning || null,
        })),
      );
      if (error) throw new Error(error.message);
    }

    if (draft.quiz?.length) {
      const { error } = await supabaseAdmin.from("lesson_quizzes").insert(
        draft.quiz.map((q) => ({
          lesson_id: lessonId,
          question: q.question,
          options: q.options ?? [],
          correct_answer: q.correct_answer || null,
          explanation: q.explanation || null,
        })),
      );
      if (error) throw new Error(error.message);
    }

    if (draft.worksheet?.length) {
      const { error } = await supabaseAdmin.from("lesson_worksheets").insert(
        draft.worksheet.map((w) => ({
          lesson_id: lessonId,
          question: w.question,
          correct_answer: w.correct_answer || null,
        })),
      );
      if (error) throw new Error(error.message);
    }

    if (draft.game_ideas?.length) {
      const { error } = await supabaseAdmin.from("lesson_games").insert(
        draft.game_ideas.map((g) => ({
          lesson_id: lessonId,
          game_type: g.game_type,
          game_data: g.game_data ?? {},
        })),
      );
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin
      .from("inputs")
      .update({ status: "completed" })
      .eq("id", inputId);

    return {
      inputId,
      lessonId,
      title: draft.title,
      language: draft.language,
      level: draft.level,
    };
  } catch (error) {
    await supabaseAdmin
      .from("inputs")
      .update({ status: "failed" })
      .eq("id", inputId);
    throw error;
  }
}
