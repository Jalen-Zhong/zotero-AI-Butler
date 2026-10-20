# 5.0.0-beta.2-jalen.1

Fork-only build. Agent stays. Chat is the direct paper Q&A window.

## Root cause

- 「打开对话」 / `chatWithAI` called `SummaryView.loadItemForChat`. That follow-up is in-memory only and has no ChatPersist new / list / delete.
- Summary follow-up already turns `$...$` into KaTeX HTML. Without `katex.min.css` in that dialog, the HTML's text reads as one flat line (`tγ = Ω (...)`), which is the screenshot. Streaming summary HTML also skipped KaTeX and used `marked` only.

## What changed

- Main window **Chat** tab hosts the same full-height `renderChatArea(..., { mode: "page" })` used by the sidebar, including thread list, + Chat, and Delete (`ChatPersist`, per item).
- 「打开对话」, the reader button, and the `chatWithAI` menu open that tab for the current item. The tab can also bind the paper selected in Zotero.
- The dialog links `katex.min.css` the same way as the other stylesheets, and Summary follow-up / summary card / streaming output inject that CSS again when the HTML is written. Summary markdown now goes through `markdownToDisplayHtml`. Chat uses the same stylesheet.
- Agent replies render the same math delimiters through the safe DOM path; model HTML is still not an HTML sink.

## Files

- `src/modules/views/ChatView.ts` (new)
- `src/modules/katexStyle.ts` (new)
- `src/modules/views/MainWindow.ts`
- `src/hooks.ts`
- `src/modules/ItemPaneSection.ts`
- `src/modules/views/SummaryView.ts`
- `src/modules/noteMarkdown.ts`
- `src/modules/views/agent/AgentMarkdown.ts`
- `src/modules/views/agent/AgentView.ts`
- `addon/content/agent.css`
- `addon/content/outputWindow.css`
- `addon/locale/en-US/mainWindow.ftl`
- `addon/locale/zh-CN/mainWindow.ftl`
- `package.json` version `5.0.0-beta.2-jalen.1`

## Verify in Zotero

1. Install the XPI, restart Zotero, select a paper.
2. Item pane → 对话, or 打开对话 / AI Chat. The main window Chat tab should open on that paper.
3. Ask a question. Use the thread list, **+ Chat**, and **Delete**. Close and reopen the same paper; the thread should still be there.
4. Ask for `$E=mc^2$`, `$$a_b=c^2$$`, `\(...\)`, and `\[...\]` in Chat and in AI Summary follow-up. Formulas should look like typeset math, not raw KaTeX spans.
5. Agent tab still opens and can show the same delimiters.

## Prefs already on this Mac

Fork defaults hide note, table, and image summary and start the sidebar on Chat. An existing profile can still have `sidebarModuleVisibility` with note/table true and `sidebarQuickChatHeight` 200. Those prefs are not rewritten by this build. The Chat tab does not use the 200px height.
