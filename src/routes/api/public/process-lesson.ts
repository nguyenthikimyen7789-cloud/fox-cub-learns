import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  input_id: z.string().uuid().optional(),
  source_type: z
    .enum(["youtube", "tiktok", "audio", "image", "text"])
    .optional(),
  source_url: z.string().url().nullable().optional(),
  raw_content: z.string().min(1).nullable().optional(),
});

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export const Route = createFileRoute("/api/public/process-lesson")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        const provided =
          request.headers.get("x-process-lesson-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!secret || provided !== secret) return unauthorized();

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { processLessonInput } = await import(
          "@/lib/process-lesson.server"
        );

        try {
          let inputId = parsed.input_id;

          if (!inputId) {
            if (!parsed.source_type || (!parsed.raw_content && !parsed.source_url)) {
              return Response.json(
                { error: "Cần input_id, hoặc source_type kèm nội dung/URL." },
                { status: 400 },
              );
            }
            const { data, error } = await supabaseAdmin
              .from("inputs")
              .insert({
                source_type: parsed.source_type,
                source_url: parsed.source_url ?? null,
                raw_content: parsed.raw_content ?? null,
                status: "pending",
              })
              .select("id")
              .single();
            if (error || !data) {
              return Response.json(
                { error: error?.message ?? "Không tạo được dữ liệu đầu vào." },
                { status: 500 },
              );
            }
            inputId = data.id;
          }

          const result = await processLessonInput(inputId);
          return Response.json({ ok: true, ...result });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Lỗi không xác định";
          console.error("[process-lesson]", message);
          return Response.json({ ok: false, error: message }, { status: 500 });
        }
      },
    },
  },
});
