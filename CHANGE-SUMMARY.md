# 5.0.0-beta.2-jalen.12

Fork-only build. In the stacked reader item pane, AI Butler opens at 640px instead of the 360px floor, and a drag handle on the bottom edge resizes it. The height is saved in `sidebarSectionHeight`.

## What changed

- The stacked section (Libraries, Tags, AI Butler, Related) uses the saved height. The first open is 640px. Dragging stays between 360px and 2400px.
- The white grip at the bottom of the AI Butler body resizes that section. The library sidenav, where AI Butler is the only pane, still fills the viewport and hides the grip.
- A resize in progress is not reset by the viewport fit. Layout generation is 12 so a pane kept from jalen.11 picks up the grip.

## Kept

- Tabs stay visible and saved Summary / Deep Read notes still load.
- Finished jobs still clear that tab’s progress bar. Deep Read still streams each saved section. Summary still has its own progress bar.
- Generate still asks before replacing a finished result, and confirm still regenerates.
- Summary and Deep Read still use the Chat KaTeX path. Black (`#000`) / white (`#fff`) is unchanged.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.12.xpi` and restart Zotero.
2. Open a paper in the reader and expand AI Butler. The body should be taller than before, with Summary / Chat / Deep Read / Mind Map visible.
3. Drag the white grip at the bottom of AI Butler. The section should grow or shrink and keep that height after switching papers or restarting Zotero.
