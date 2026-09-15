import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const processSchema = z.object({ inputId: z.string().uuid() });

const createSchema = z.object({
  sourceType: z.enum(["youtube", "tiktok", "audio", "image", "text"]),
  sourceUrl: z.string().url().nullable().optional(),
  rawContent: z.string().min(1).nullable().optional(),
});

/** Chạy quy trình biên soạn bài học cho một bản ghi đầu vào đã có. */
export const processLesson = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => processSchema.parse(data))
  .handler(async ({ data }) => {
    const { processLessonInput } = await import("./process-lesson.server");
    return processLessonInput(data.inputId);
  });

/** Tạo bản ghi đầu vào mới rồi biên soạn bài học ngay. */
export const submitAndProcessLesson = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { processLessonInput } = await import("./process-lesson.server");

    const { data: input, error } = await supabaseAdmin
      .from("inputs")
      .insert({
        source_type: data.sourceType,
        source_url: data.sourceUrl ?? null,
        raw_content: data.rawContent ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !input) {
      throw new Error(error?.message ?? "Không tạo được dữ liệu đầu vào.");
    }

    return processLessonInput(input.id);
  });
