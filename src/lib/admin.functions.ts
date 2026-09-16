import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Danh sách dữ liệu đầu vào gần đây (đang xử lý / đã xong). */
export const listInputs = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("inputs")
    .select("id, source_type, source_url, raw_content, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return data ?? [];
});

/** Danh sách bài học (nháp + đã xuất bản). */
export const listLessons = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("lessons")
    .select("id, title, language, level, reasoning, status, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return data ?? [];
});

/** Đổi trạng thái bài học giữa nháp và xuất bản. */
export const setLessonStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        lessonId: z.string().uuid(),
        status: z.enum(["draft", "published"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("lessons")
      .update({ status: data.status })
      .eq("id", data.lessonId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
