# 5.0.0-beta.2-jalen.5

Fork-only build. Summary, Chat, Deep Read, and Mind Map live on the item sidebar. The main window no longer uses AI Summary or Chat as the paper viewer.

## What changed

- The main window tab bar no longer has AI Summary or Chat. Dashboard, Agent, Task Queue, and Settings stay. Opening those old tabs lands on the dashboard instead of the paper viewer. Task-queue details no longer switches to the Summary view.
- The item sidebar tabs are Summary, Chat, Deep Read, and Mind Map. Chat is still the full-height page-mode thread (new, cache, delete). There is no separate Chat window button and no Full Chat card.
- Summary and Deep Read each have a Generate button for the selected paper, using the same queue path as Mind Map (`addTask` / `addDeepReadTask`, priority for that one item).
- The default sidebar map shows the summary note. A profile that still has the exact previous fork map (summary hidden, table and image summary hidden) is updated so Summary appears. Any other saved map is left alone.
- Chat stays `#000` / `#fff`. Summary and Deep Read use the same black shell with white text. KaTeX is still the 0.18 stylesheet, and the sidebar note rules do not reset `line-height` or `vertical-align` inside `.katex`.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.5.xpi` and restart Zotero.
2. The 🤖 window should not show AI Summary or Chat tabs. Select a paper and use the sidebar: Summary, Chat, Deep Read, Mind Map.
3. Generate on Summary or Deep Read queues that paper only. Chat stays black, and subscripts still sit below the baseline.

## Prefs

Table summary and one-image summary stay off. `sidebarQuickChatHeight` is not rewritten. Page-mode Chat still ignores that height pref.
