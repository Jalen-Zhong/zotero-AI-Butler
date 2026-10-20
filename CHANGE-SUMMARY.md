# 5.0.0-beta.2-jalen.3

Fork-only build. Sidebar and main Chat are pure black with white text. Agent stays.

## Why jalen.2 still looked gray

- `.ai-butler-sidebar-shell` defaulted to a light blue-white gradient. The darker shell existed only inside `@media (prefers-color-scheme: dark)`. Zotero on macOS often stays light, so the pane chrome stayed gray around the chat.
- Pref `markdownTheme=github` injects `#ffffff` / `#f6f8fa` for `.markdown-body`, code, and tables. Those rules share the item-pane document with Chat.
- `renderItemPaneSection` kept the existing DOM whenever Quick Chat was already on screen. After an XPI upgrade that DOM could still be the old Full Chat card stacked above Quick Chat, so the new page-mode chat never replaced it.

## What changed

- The sidebar shell, topbar, and tabs are `#000` / `#fff` with no light gradient and no `prefers-color-scheme` switch.
- Chat messages, bubbles, code, tables, blockquote, and `.markdown-body` inside `#ai-butler-inline-chat` are forced to `#000` background and `#fff` text. `.katex` stays white on a transparent background.
- The Chat tab only mounts `renderChatArea(..., { mode: "page" })`, with ↗ to open the main Chat tab. It does not render the Full Chat card.
- A layout generation of `3` is stored on the shell. A re-render rebuilds the pane when that attribute is missing or when `.ai-butler-sidebar-chat-entry` is still in the DOM.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.3.xpi` and restart Zotero. Select the same paper again if the old card is still visible once; the pane rebuilds when that card or a pre-v3 shell is present.
2. Sidebar Chat should be black from the tabs through the composer. Text and formulas are white. There is no teal Full Chat card above the thread.
3. Main Chat (↗ or the Chat tab) uses the same black thread.

## Prefs

This build does not rewrite `markdownTheme` or `sidebarQuickChatHeight`. GitHub markdown colors are overridden inside Chat only. Page-mode Chat still ignores the 200px height pref.
