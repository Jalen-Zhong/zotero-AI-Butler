# 5.0.0-beta.2-jalen.10

Fork-only build. The sidebar progress bar clears when a task finishes, Deep Read shows each finished section as it is saved, and Summary has the same per-tab progress bar as Deep Read and Mind Map.

## What changed

- A finished, failed, or cancelled Summary / Deep Read / Mind Map job no longer leaves the sidebar bar on “generating”. Later progress events from that same task cannot turn the bar back on. The note reloads when the job ends.
- Each time Deep Read saves a finished section, the sidebar Deep Read tab reloads that note in place. The view stays on the current tab, and the progress bar stays with that tab until the job ends.
- The Summary progress bar is the same per-tab bar as Deep Read and Mind Map, drawn above the note so it stays visible while that summary is generating.

## Kept

- Generate still asks before replacing a finished result, and confirm still regenerates.
- Summary and Deep Read still use the Chat KaTeX path. Black (`#000`) / white (`#fff`) is unchanged.
- Opening the sidebar still paints the shell before the heavy note work.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.10.xpi` and restart Zotero.
2. Regenerate Deep Read. Finished sections should show in the Deep Read tab while later sections are still running. When Task Queue shows the job finished, the sidebar bar should clear and the note should match the saved deep read.
3. Generate Summary. The Summary tab should show its own progress bar until that job finishes.
