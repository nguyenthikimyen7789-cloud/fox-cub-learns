import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getLessonDetail = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ lessonId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lesson, error } = await supabaseAdmin
      .from("lessons")
      .select(
        "id, title, language, level, reasoning, status, lesson_readings(id, content, pinyin_content), lesson_vocabularies(id, word, pronunciation, word_type, meaning, example, example_meaning), lesson_quizzes(id, question, options, correct_answer, explanation), lesson_games(id, game_type, game_data)",
      )
      .eq("id", data.lessonId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return lesson;
  });