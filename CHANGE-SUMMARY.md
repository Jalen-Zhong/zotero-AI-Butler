# 5.0.0-beta.2-jalen.9

Fork-only build. Opening the AI Butler sidebar paints immediately, and a paper that already has Summary or Deep Read notes shows those notes without generating again.

## What changed

- The sidebar shell is attached before any tab does heavy work. Summary, Deep Read, and Mind Map are no longer built, scanned, and typeset in the same turn as the robot-icon click.
- Existing Summary and Deep Read notes load after the pane is on screen. A later open of the same paper fills a blank note tab instead of keeping the empty pane. The active tab loads first; the other note tab follows on the next turn.
- Restored Chat messages are typeset a pair at a time, and the task-queue progress read waits until after the pane has painted.

## Kept

- Each sidebar tab still has its own progress bar, and a finished job still reloads that tab.
- Generate still asks before replacing a finished result, and confirm still regenerates Deep Read and Summary.
- Summary and Deep Read still use the Chat KaTeX path. Subscript layout is unchanged.
- Chat stays page-mode on black (`#000`) / white (`#fff`). KaTeX is still the 0.18 stylesheet.
- The main window still has no Summary or Chat tabs.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.9.xpi` and restart Zotero.
2. Select a paper that already has Summary and Deep Read notes, then click the AI Butler robot icon. The pane should appear quickly, and those notes should show in their tabs without Generate or a manual refresh.
3. Switch to another paper with saved notes. Summary and Deep Read should follow the selection.
