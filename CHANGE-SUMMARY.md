# 5.0.0-beta.2-jalen.4

Fork-only build. Chat stays pure black (`#000`) with white (`#fff`) text. Subscripts and superscripts use the KaTeX 0.18 layout.

## Why subscripts sat on the base

Chat, Summary, and Agent render math with KaTeX **0.18.1**. That HTML uses `katex-strut`, `katex-base`, and `katex-sizing` (for example `.katex-sizing.reset-size6.size3` at `font-size: .7em`).

The stylesheet shipped in the add-on was still KaTeX **0.16.27**. It styles `.strut` and `.sizing`, which 0.18 no longer emits. The script `top` offset was present, but the script never shrank and the strut stayed `display: inline`, so `height` and `vertical-align` on it were ignored. Subscripts stayed full size and overlapped the base (`R_{BoN}`, `D_{KL,BoN}`, `e^{\alpha_{RL}/\beta_{RL}-1}`).

Fonts were already the 0.18 files. KaTeX CSS was already injected. A parent `line-height` or `vertical-align` reset was not the cause, and this build does not add one.

## What changed

- `addon/content/katex.min.css` is the 0.18.1 stylesheet that matches the renderer. Chat, Summary, and Agent all load this file.
- Chat still forces `box-sizing: content-box` on `.katex` and keeps `.vlist-s` at 2px, so the chat’s `border-box` / `min-width: 0` rules do not shrink KaTeX’s script table. Those rules do not set `line-height` or `vertical-align` on `.katex` internals.
- Sidebar layout generation is `4`, so an open pane replaces the inlined 0.16 CSS from jalen.3.
- The black shell, black Chat bubbles, and page-mode Chat (no Full Chat card) are unchanged.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.4.xpi` and restart Zotero. Select the paper again if the pane was left open from jalen.3.
2. In Chat, `R_{BoN}` and `\alpha_{BoN}` should show a smaller subscript below the baseline, and `e^{\alpha_{RL}/\beta_{RL}-1}` should show a raised exponent. The pane stays black with white text, and there is no Full Chat card.

## Prefs

This build does not rewrite `markdownTheme` or `sidebarQuickChatHeight`.
