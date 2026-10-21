/**
 * Quick-chat HTML cleanup before innerHTML.
 * These passes do not parse the tree and do not remove `.katex` or
 * `.katex-display`. KaTeX markup produced by markdownToDisplayHtml survives.
 */

/** Drops unsafe controls, noncharacters, and broken surrogates only. */
export function sanitizeQuickChatDomString(text: string): string {
  let result = "";
  const input = String(text ?? "");
  for (let index = 0; index < input.length; index++) {
    const code = input.charCodeAt(index);
    const isUnsafeControl =
      code <= 8 ||
      (code >= 11 && code <= 12) ||
      (code >= 14 && code <= 31) ||
      (code >= 127 && code <= 159);
    if (isUnsafeControl) continue;

    const isUnicodeNonCharacter =
      (code >= 0xfdd0 && code <= 0xfdef) || code === 0xfffe || code === 0xffff;
    if (isUnicodeNonCharacter) continue;

    if (code >= 0xd800 && code <= 0xdbff) {
      const next = input.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        result += input[index] + input[index + 1];
        index += 1;
      } else {
        result += "\uFFFD";
      }
      continue;
    }

    if (code >= 0xdc00 && code <= 0xdfff) {
      result += "\uFFFD";
      continue;
    }

    result += input[index];
  }
  return result;
}

/** Rewrites `&nbsp;` and void elements. Class attributes stay intact. */
export function normalizeQuickChatXhtml(html: string): string {
  return html
    .replace(/&nbsp;/gi, "&#160;")
    .replace(
      /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b([^>]*)>/gi,
      (match, tagName: string, attributes: string) => {
        if (match.endsWith("/>")) return match;
        return `<${tagName}${attributes.replace(/\s*\/?\s*$/, "")}/>`;
      },
    );
}
