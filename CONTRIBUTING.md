# Contributing to PDF Context Extractor

Thanks for your interest in contributing! This document covers the basics of working with the codebase.

## Development

### Prerequisites

- **Node.js 20+** (we use modern JS features)
- **npm 10+** (or pnpm/yarn if you prefer — npm is what CI uses)

### Setup

```bash
git clone https://github.com/<your-username>/pdf-context-extractor.git
cd pdf-context-extractor
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` with HMR.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check (`tsc`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for testing |

### Project layout

```
src/
  components/
    uploader/      — drag/drop + click PDF upload
    viewer/        — canvas-based PDF renderer
    sidebar/       — page list, selection, range input, thumbnail grid
    workspace/     — extraction preview, search, copy actions
    shared/        — landing page, theme toggle
  services/        — PDF, extraction, clipboard, file-action logic
  stores/          — Zustand stores: pdf, selection, workspace, theme
  hooks/           — (reserved for future shared hooks)
  utils/           — range parser, tokenizer
  types/           — shared TypeScript types
```

### Architectural rules

- **No backend.** Everything runs in the browser. The PDF never leaves the user's machine.
- **No analytics, no external API calls** (except the static CDN imports at build time).
- **State lives in Zustand stores** under `src/stores/`. Components read from stores, never the other way around.
- **Services in `src/services/`** are pure functions or small wrappers around `pdfjs-dist`. No React inside.
- **Tailwind for styling.** No CSS-in-JS, no styled-components. Use `dark:` variants for dark mode.

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Make your changes. Add a short description in the PR.
3. Run `npm run build` locally to make sure it compiles. CI will also run it.
4. Open a PR against `main`.
5. If your change is user-visible, add a screenshot or short clip.

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Browser and OS
- PDF size and approximate page count
- Steps to reproduce
- What you expected vs. what happened
- A screenshot if the issue is visual

## Requesting features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Search existing issues first to avoid duplicates.

## Code of conduct

Be kind. Disagree on ideas, not on people. We're all here to ship a useful tool.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
