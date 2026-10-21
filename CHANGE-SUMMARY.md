# 5.0.0-beta.2-jalen.6

Fork-only build. Sidebar Generate shows the selected paper’s task progress, and asks before replacing a finished result.

## What changed

- Summary, Deep Read, and Mind Map subscribe to the existing task-queue progress and completion callbacks. A bar under the sidebar tabs shows that paper’s running job (queued, in progress, or failed). It is not only in the Task Queue.
- If that feature already has a completed result, Generate asks before replacing it. Cancel leaves the note alone. An empty or failed result starts without the question. A confirmed replace passes `forceOverwrite` through the same queue used by Mind Map, so a finished task is not skipped.
- Mind Map keeps Generate in the section header, including when a map is already there.
- Chat stays page-mode on black (`#000`) / white (`#fff`). Summary and Deep Read stay on that shell. KaTeX is still the 0.18 stylesheet. The main window still has no Summary or Chat tabs.

## Verify in Zotero

1. Install `zotero-ai-butler-5.0.0-beta.2-jalen.6.xpi` and restart Zotero.
2. Select a paper with no summary. Generate should start immediately and show a progress bar in the sidebar.
3. When a summary, deep read, or mind map already exists, Generate should ask first. Cancel does nothing. Confirm runs again and the bar tracks that job.

## Prefs

This build does not rewrite `noteStrategy`. The confirm step is the overwrite choice for that one paper.
