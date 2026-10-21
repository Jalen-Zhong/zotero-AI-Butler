# 5.0.0-beta.2-jalen.11

Fork-only build. The AI Butler item-pane section keeps a real body height when Zotero stacks it with the other reader sections, so the tabs and saved notes mount instead of an empty strip.

## Why the pane was blank

The reader context pane stacks Libraries, Tags, AI Butler, and Related. The sidebar shell was a flex column with `height: 100%`, `min-height: 0`, and `overflow: hidden`. In that stacked section the percentage height does not resolve, so the shell collapsed and the tab row was clipped. The viewport fit then wrote that collapsed height back as `0px` (`max(0, innerHeight - rect.top)`), and the resize observer kept the body at 0. The notes were already saved; the section never had a box to draw the tabs in.

## What changed

- A stacked section now gets a 360px body. The fit only stretches to the viewport when this section is the only visible pane and there is at least 200px of room. It never writes a 0px height.
- Opening the section appends the shell and renders the active tab immediately, then loads Summary and Deep Read on the next turns. A render error can no longer leave the wiped body empty.
- Sidebar layout generation is 11, so a pane Zotero kept from jalen.10 picks up the new height rules.

## Kept

- Finished Summary / Deep Read / Mind Map jobs still clear that tab’s progress bar. Deep Read still streams each saved section into the open tab. Summary still has its own progress bar.
- Generate still asks before replacing a finished result, and confirm still regenerates.
- Summary and Deep Read still use the Chat KaTeX path. Black (`#000`) / white (`#fff`) is unchanged.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.11.xpi` and restart Zotero.
2. Open the reader for a paper that already has an AI Summary and an AI Deep Reading note. Expand AI Butler. The tab row (Summary, Chat, Deep Read, Mind Map) should be visible, and the saved note for the active tab should load without regenerating.
3. Regenerate Deep Read. Finished sections should show while later sections are still running. When Task Queue shows the job finished, that tab’s progress bar should clear.
