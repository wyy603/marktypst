Check original [README](README.md)

## intro

This project wants to integrate Marktext with Tinymist. It aims to achieve the following goals:
- [x] typst mathematical formulas enclosed in $$
- [x] code blocks that display typst enclosed in ```typst
- [ ] imports from local files

This project is under develop.

## why this project

Tinymist for vscode is awesome, but I want an editor that doesn't separate the text and preview. Currently, I've only found Wypst from Obsidian that supports this, but my experience isn't very friendly. Therefore, I'm currently choosing the open source Marktext for transformation.

```
$env:MARKTEXT_DEV_HIDE_BROWSER_ANALYZER="true"; yarn run dev
```
