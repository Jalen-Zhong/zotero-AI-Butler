import { Lexer, type MarkedToken, type Token } from "marked";
import {
  extractDisplayFormulas,
  renderDisplayFormulaHtml,
  type DisplayFormula,
} from "../../noteMarkdown";
import { documentOf, element } from "./dom";

const FORMULA_PLACEHOLDER =
  /AI_BUTLER_FORMULA_(BLOCK|INLINE)_(\d+)_END/g;

/** Allow source citations without permitting privileged or executable schemes. */
export function agentCitationURL(href: string): string | undefined {
  const value = decodeEntities(href).trim();
  if (
    [...value].some(
      (character) =>
        character.charCodeAt(0) <= 32 ||
        character.charCodeAt(0) === 127 ||
        character === "\\",
    )
  )
    return undefined;
  if (
    /^zotero:\/\/select\/(?:library|groups\/[1-9]\d*)\/items\/[A-Z0-9]{8}$/.test(
      value,
    )
  )
    return value;
  if (!/^https?:\/\//i.test(value)) return undefined;
  try {
    const url = new URL(value);
    if (url.hostname && !url.username && !url.password) return url.href;
  } catch {
    // Incomplete streamed links remain ordinary text until they are valid.
  }
  return undefined;
}

/** Build a small Markdown DOM vocabulary; model HTML never reaches an HTML sink. */
export function renderAgentMarkdown(host: HTMLElement, source: string): void {
  host.replaceChildren();
  host.classList.add("agent-markdown");
  try {
    // Same math splitter as quick chat. Only the KaTeX fragment is parsed as
    // HTML; citations and other Markdown still go through the safe DOM path.
    const extracted = extractDisplayFormulas(source);
    const tokens = new Lexer({ gfm: true, breaks: false }).lex(
      extracted.markdown,
    );
    appendTokens(host, tokens);
    if (extracted.formulas.length > 0) {
      replaceFormulaPlaceholders(host, extracted.formulas);
    }
    void ensureAgentKatexCss(documentOf(host));
  } catch (error) {
    host.classList.remove("agent-markdown");
    host.textContent = source;
    ztoolkit.log("[AI-Butler Agent] Markdown rendering failed", error);
  }
}

/** Load KaTeX fonts once per document and keep formula metrics from wrapping. */
export async function ensureAgentKatexCss(doc: Document): Promise<void> {
  if (doc.getElementById("ai-butler-agent-katex-style")) return;
  try {
    const { themeManager } = await import("../../themeManager");
    const katexCss = await themeManager.loadKatexCss();
    const styleEl = doc.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "style",
    ) as HTMLStyleElement;
    styleEl.id = "ai-butler-agent-katex-style";
    styleEl.textContent = `${katexCss}\n${AGENT_KATEX_LAYOUT_CSS}`;
    const target = doc.head || doc.documentElement;
    target?.appendChild(styleEl);
  } catch (error) {
    ztoolkit.log("[AI-Butler Agent] KaTeX CSS injection failed", error);
  }
}

const AGENT_KATEX_LAYOUT_CSS = `
.agent-markdown .katex,
.agent-markdown .katex-display,
.agent-markdown .katex * {
  max-width: none !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
  white-space: nowrap !important;
}
.agent-markdown .katex-scroll-container {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0.6em 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap !important;
}
.agent-markdown .katex-scroll-container .katex-display {
  display: inline-block !important;
  width: auto;
  max-width: none !important;
  margin: 0;
  overflow: visible !important;
  text-align: left;
}
.agent-markdown .katex-inline {
  display: inline-block;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  vertical-align: middle;
  white-space: nowrap !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
}
.agent-markdown .katex-inline > .katex,
.agent-markdown .katex-scroll-container .katex {
  display: inline-block !important;
  max-width: none !important;
}
`;

function replaceFormulaPlaceholders(
  root: HTMLElement,
  formulas: DisplayFormula[],
): void {
  const doc = documentOf(root);
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    const value = node.nodeValue || "";
    if (!value.includes("AI_BUTLER_FORMULA_")) continue;
    if (isInsideCode(node)) continue;
    FORMULA_PLACEHOLDER.lastIndex = 0;
    if (!FORMULA_PLACEHOLDER.test(value)) continue;

    const fragment = doc.createDocumentFragment();
    let cursor = 0;
    FORMULA_PLACEHOLDER.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = FORMULA_PLACEHOLDER.exec(value))) {
      if (match.index > cursor) {
        fragment.append(doc.createTextNode(value.slice(cursor, match.index)));
      }
      const formula = formulas[Number(match[2])];
      // trust:false blocks KaTeX commands that emit links or raw HTML.
      const html = renderDisplayFormulaHtml(formula, { trust: false });
      if (html) fragment.append(trustedKatexFragment(doc, html));
      else fragment.append(doc.createTextNode(match[0]));
      cursor = match.index + match[0].length;
    }
    if (cursor < value.length) {
      fragment.append(doc.createTextNode(value.slice(cursor)));
    }
    const parent = node.parentNode;
    if (!parent) continue;
    parent.insertBefore(fragment, node);
    node.remove();
    hoistLoneBlockFormula(parent);
  }
}

function isInsideCode(node: Text): boolean {
  let parent = node.parentElement;
  while (parent) {
    const tag = parent.tagName.toLowerCase();
    if (tag === "code" || tag === "pre") return true;
    parent = parent.parentElement;
  }
  return false;
}

function hoistLoneBlockFormula(parent: Node): void {
  if (parent.nodeType !== 1) return;
  const paragraph = parent as HTMLElement;
  if (paragraph.tagName.toLowerCase() !== "p") return;
  const only = paragraph.children.length === 1 ? paragraph.children[0] : null;
  if (!only?.classList.contains("katex-scroll-container")) return;
  const extraText = [...paragraph.childNodes].some((child) => {
    if (!child || child === only) return false;
    return (child.textContent || "").trim().length > 0;
  });
  if (!extraText) paragraph.replaceWith(only);
}

function trustedKatexFragment(doc: Document, html: string): DocumentFragment {
  const fragment = doc.createDocumentFragment();
  const Parser = doc.defaultView?.DOMParser ?? DOMParser;
  const parsed = new Parser().parseFromString(
    `<div xmlns="http://www.w3.org/1999/xhtml">${html}</div>`,
    "text/html",
  );
  const container = parsed.body?.firstElementChild;
  if (!container) {
    fragment.append(doc.createTextNode(html.replace(/<[^>]+>/g, "")));
    return fragment;
  }
  const imported = doc.importNode(container, true) as HTMLElement;
  sanitizeKatexHost(imported);
  while (imported.firstChild) fragment.append(imported.firstChild);
  return fragment;
}

function sanitizeKatexHost(root: HTMLElement): void {
  root
    .querySelectorAll("script, iframe, object, embed, link, meta, base, form")
    .forEach((node: Element) => node.remove());
  const elements: Element[] = [root, ...root.querySelectorAll("*")];
  for (const el of elements) {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      if (
        name.startsWith("on") ||
        name === "href" ||
        name === "src" ||
        name === "xlink:href"
      ) {
        el.removeAttribute(attr.name);
      }
    }
  }
}

function appendTokens(host: HTMLElement, tokens: Token[], depth = 0): void {
  const doc = documentOf(host);
  const text = (value: string) => host.appendChild(doc.createTextNode(value));
  for (const rawToken of tokens) {
    if (depth > 32) {
      text(rawToken.raw);
      continue;
    }
    // This lexer has no extensions; all emitted tokens use marked's built-ins.
    const token = rawToken as MarkedToken;
    switch (token.type) {
      case "space":
      case "def":
        break;
      case "paragraph":
      case "blockquote":
      case "strong":
      case "em":
      case "del": {
        const tags = {
          paragraph: "p",
          blockquote: "blockquote",
          strong: "strong",
          em: "em",
          del: "del",
        } as const;
        const node = element(doc, tags[token.type], "");
        appendTokens(node, token.tokens, depth + 1);
        host.append(node);
        break;
      }
      case "heading": {
        const tags = ["h2", "h3", "h4", "h5", "h6", "h6"] as const;
        const node = element(doc, tags[token.depth - 1] || "h6", "");
        appendTokens(node, token.tokens, depth + 1);
        host.append(node);
        break;
      }
      case "code": {
        const pre = element(doc, "pre", "");
        pre.tabIndex = 0;
        pre.append(element(doc, "code", "", token.text));
        host.append(pre);
        break;
      }
      case "codespan":
        host.append(element(doc, "code", "", token.text));
        break;
      case "br":
      case "hr":
        host.append(element(doc, token.type, ""));
        break;
      case "list": {
        const list = element(doc, token.ordered ? "ol" : "ul", "");
        if (token.ordered && typeof token.start === "number")
          list.setAttribute("start", String(token.start));
        appendTokens(list, token.items, depth + 1);
        host.append(list);
        break;
      }
      case "list_item": {
        const item = element(doc, "li", "");
        appendTokens(item, token.tokens, depth + 1);
        host.append(item);
        break;
      }
      case "checkbox":
        text(token.checked ? "☑ " : "☐ ");
        break;
      case "table": {
        const wrapper = element(doc, "div", "agent-markdown-table");
        wrapper.tabIndex = 0;
        const table = element(doc, "table", "");
        const head = element(doc, "thead", "");
        const body = element(doc, "tbody", "");
        for (const [index, cells] of [token.header, ...token.rows].entries()) {
          const row = element(doc, "tr", "");
          for (const cell of cells) {
            const node = element(doc, index === 0 ? "th" : "td", "");
            if (cell.align) node.style.textAlign = cell.align;
            if (index === 0) node.setAttribute("scope", "col");
            appendTokens(node, cell.tokens, depth + 1);
            row.append(node);
          }
          (index === 0 ? head : body).append(row);
        }
        table.append(head, body);
        wrapper.append(table);
        host.append(wrapper);
        break;
      }
      case "link": {
        const href = agentCitationURL(token.href);
        if (!href) {
          appendTokens(host, token.tokens, depth + 1);
          break;
        }
        const link = element(doc, "a", "");
        link.href = href;
        link.title = token.title || href;
        link.rel = "noopener noreferrer";
        appendTokens(link, token.tokens, depth + 1);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          Zotero.launchURL(href);
        });
        host.append(link);
        break;
      }
      case "image":
        // Image descriptions are useful evidence; remote resources are not loaded.
        text(decodeEntities(token.text));
        break;
      case "text":
        if (token.tokens) appendTokens(host, token.tokens, depth + 1);
        else text(decodeEntities(token.text));
        break;
      case "escape":
        text(token.text);
        break;
      case "html":
        text(token.raw);
        break;
      default:
        text(rawToken.raw);
    }
  }
}

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00a0",
  };
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
    (all, key: string) => {
      if (!key.startsWith("#")) return named[key.toLowerCase()] || all;
      const hex = key[1].toLowerCase() === "x";
      const code = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : all;
    },
  );
}
