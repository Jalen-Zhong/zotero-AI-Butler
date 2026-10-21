# 5.0.0-beta.2-jalen.7

Fork-only build. Sidebar progress stays on the feature that started it, and a finished job reloads that feature’s note.

## What changed

- Summary, Deep Read, and Mind Map each have their own progress bar inside that tab. A Deep Read job no longer paints its bar on Summary, and switching tabs leaves the other feature’s bar behind. Generate keeps you on the tab you started from.
- When that job finishes, the sidebar reloads that feature’s note or mind map. A slower note save is tried again. An older in-flight render cannot overwrite the new content. The manual refresh button is still there, but it is not required after a successful generate.
- Regenerate still asks before replacing a finished result. Chat stays page-mode on black (`#000`) / white (`#fff`). KaTeX is still the 0.18 stylesheet. The main window still has no Summary or Chat tabs.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.7.xpi` and restart Zotero.
2. On Deep Read, click Generate. The Deep Read tab should stay selected and show only that job’s bar. Open Summary while it runs: no Deep Read bar. Return to Deep Read: the bar is still there.
3. When the job finishes, that tab’s note or mind map should appear on its own. Summary and Mind Map behave the same way, each with its own bar.
