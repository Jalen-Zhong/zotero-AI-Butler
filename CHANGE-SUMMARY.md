# 5.0.0-beta.2-jalen.2

Fork-only build. Agent stays. Chat is the paper Q&A window, in the sidebar and in the main window.

## Root cause of the remaining raw LaTeX

jalen.1 loaded KaTeX CSS and rendered delimited math (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`). The installed Chat screenshot still shows source such as `d = \sqrt{D_{KL}(\pi || \pi_{init})}` and `R_{BoN}(d) = d(\alpha_{BoN} - \beta_{BoN} d)`.

That is undelimited TeX. `extractDisplayFormulas` only pulls math that already has delimiters, so KaTeX never ran. Missing CSS looks different: glyph text such as `tγ = Ω (...)` with no `\sqrt`. The quick-chat sanitizers are not the cause. `sanitizeQuickChatDomString` only drops unsafe control characters, and `normalizeQuickChatXhtml` only rewrites `&nbsp;` and void tags. Neither removes `.katex` or `.katex-display`.

## What changed

- Before display HTML is built, undelimited TeX is wrapped. A whole equation line becomes `$$...$$`. A formula inside a sentence becomes `$...$`. Double-escaped `\\sqrt` is normalized to `\sqrt` first. Fenced code and already-delimited math are left alone. The same pass feeds Chat, Summary follow-up, and Agent.
- Chat surfaces (sidebar Chat tab and main Chat tab) use a black background and white text, including `.katex { color: #fff }`.
- The sidebar Chat tab is the full-height page chat (thread list, new, delete). It does not use the 200px `sidebarQuickChatHeight` pref. The old “open chat” card is no longer stacked above it. A ↗ control still opens the main Chat tab.

## Files

- `src/modules/noteMarkdown.ts`
- `src/modules/quickChatDom.ts` (new)
- `src/modules/ItemPaneSection.ts`
- `src/modules/views/ChatView.ts`
- `test/noteMarkdown.test.ts`
- `package.json` version `5.0.0-beta.2-jalen.2`

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.2.xpi`, restart Zotero, select a paper.
2. Sidebar Chat should fill the item pane under the tabs, black background, white text, with the thread list, + Chat, and Delete. ↗ opens the main Chat tab for the same paper.
3. Ask for the undelimited lines `d = \sqrt{D_{KL}(\pi || \pi_{init})}` and `R_{BoN}(d) = d(\alpha_{BoN} - \beta_{BoN} d)`, and for `$E=mc^2$`. They should typeset, including the white KaTeX glyphs. The same thread should appear in the main Chat tab.
4. Agent still opens. Summary follow-up still typesets delimited and undelimited formulas.

## Prefs already on this Mac

Fork defaults hide note, table, and image summary and start the sidebar on Chat. This build does not rewrite `sidebarModuleVisibility` or `sidebarQuickChatHeight`. Page-mode Chat ignores that height.
