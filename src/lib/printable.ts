import type { Lesson } from "./lessondata";

export function openPrintableBook(lesson: Lesson, kind: "a4" | "mini") {
  if (typeof window === "undefined") return;
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) return;

  const pages = lesson.lines
    .map(
      (l, i) => `
      <section class="page ${kind}">
        <div class="frame">
          <div class="num">${i + 1}</div>
          <div class="art">${lesson.emoji}</div>
          <p class="en">${l.en}</p>
          <p class="zh">${l.zh}</p>
          <p class="py">${l.pinyin}</p>
          <p class="vi">${l.vi}</p>
        </div>
      </section>`,
    )
    .join("");

  win.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8">
  <title>${lesson.title} — Bản in tô màu</title>
  <style>
    @page { size: A4 ${kind === "mini" ? "landscape" : "portrait"}; margin: 12mm; }
    body { font-family: "Quicksand", system-ui, sans-serif; color:#3a2a24; background:#fffaf2; }
    h1 { color:#C93B2B; text-align:center; }
    .sub { text-align:center; color:#7a6357; margin-top:-8px; }
    .grid { display:grid; grid-template-columns: ${kind === "mini" ? "repeat(2, 1fr)" : "1fr"}; gap:10mm; }
    .page { break-inside: avoid; }
    .frame { border:3px dashed #C93B2B; border-radius:18px; padding:14px; min-height:${kind === "mini" ? "70mm" : "85mm"}; position:relative; }
    .num { position:absolute; top:8px; left:12px; font-weight:800; color:#C93B2B; }
    .art { font-size:${kind === "mini" ? "48px" : "72px"}; text-align:center; filter:grayscale(1); opacity:.55; }
    .en { font-weight:800; font-size:${kind === "mini" ? "14px" : "20px"}; margin:6px 0 0; }
    .zh { font-weight:700; font-size:${kind === "mini" ? "14px" : "20px"}; margin:2px 0 0; }
    .py { color:#7a6357; margin:2px 0 0; font-size:12px; }
    .vi { color:#7a6357; margin:2px 0 0; font-size:12px; }
    .tip { text-align:center; color:#7a6357; font-size:12px; margin-top:10mm; }
    @media print { .noprint { display:none; } }
  </style></head><body>
  <h1>🦊 ${lesson.title}</h1>
  <p class="sub">${lesson.titleEn} · ${lesson.titleZh} — ${kind === "mini" ? "Sách mini gấp đôi" : "Bản A4 tô màu"}</p>
  <p class="noprint" style="text-align:center">
    <button onclick="window.print()" style="background:#C93B2B;color:#fff;border:0;border-radius:999px;padding:10px 22px;font-weight:800;cursor:pointer">🖨️ In ngay</button>
  </p>
  <div class="grid">${pages}</div>
  <p class="tip">Học Viện Cáo Nhỏ — tô màu hình và đọc to từng câu cùng bố mẹ nhé!</p>
  </body></html>`);
  win.document.close();
}
