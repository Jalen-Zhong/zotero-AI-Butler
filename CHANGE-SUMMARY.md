# 5.0.0-beta.2-jalen.8

Fork-only build. Confirming Generate on a finished Deep Read actually regenerates it, and Summary / Deep Read notes render `$...$` math with the same KaTeX path as Chat.

## What changed

- Deep Read regenerate no longer resumes a finished note and skips every completed round. After the overwrite confirm, the queue runs the deep read again. The Task Queue “Complete Deep Reading” action is only for a failed or incomplete run, so a finished task no longer sits there with a button that refuses to regenerate.
- Summary overwrite uses the same confirm flag: a new summary replaces the saved note instead of keeping the old one when the note strategy is “skip”. Mind Map already replaces its note on regenerate.
- Sidebar Summary and Deep Read render `$...$` and `$$...$$` through the Chat KaTeX path, including math saved as Zotero `<span class="math">` / `<pre class="math">`. Dollars inside code stay literal. Subscript layout is unchanged: no rule resets line-height or vertical-align inside `.katex`.

## Kept

- Each sidebar tab still has its own progress bar, and a finished job still reloads that tab.
- Generate still asks before replacing a finished result.
- Chat stays page-mode on black (`#000`) / white (`#fff`). KaTeX is still the 0.18 stylesheet.
- The main window still has no Summary or Chat tabs.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.8.xpi` and restart Zotero.
2. Open a paper that already has a Deep Read. In the sidebar, Generate, confirm, and watch Task Queue: the job should be running, not a completed row whose only math action is “Complete Deep Reading”.
3. Open Summary. Inline formulas should be typeset, including subscripts, not shown as raw `$...$`.
