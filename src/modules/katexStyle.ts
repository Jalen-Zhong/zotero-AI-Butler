import { themeManager } from "./themeManager";

/** Insert KaTeX CSS as an HTML style element. XUL style nodes do not style the chat HTML. */
export async function injectHtmlKatexStyle(
  doc: Document,
  styleId: string,
  extraCss = "",
): Promise<boolean> {
  if (doc.getElementById(styleId)) return true;
  try {
    const katexCss = await themeManager.loadKatexCss();
    if (!katexCss && !extraCss) return false;
    if (doc.getElementById(styleId)) return true;
    const styleEl = doc.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "style",
    ) as HTMLStyleElement;
    styleEl.id = styleId;
    styleEl.textContent = extraCss ? `${katexCss}\n${extraCss}` : katexCss;
    const target = doc.head || doc.documentElement;
    if (!target) return false;
    target.appendChild(styleEl);
    return true;
  } catch (error) {
    ztoolkit.log("[AI-Butler] KaTeX CSS injection failed:", error);
    return false;
  }
}
