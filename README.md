# PDF Context Extractor

> Load a PDF. Pick pages. Copy clean text — ready to paste into ChatGPT, Claude, Gemini, or your notes.

A local-first web app that turns *"I need to copy pages 40–55 of this ebook into ChatGPT"* from a 5-minute click-every-page chore into a 10-second workflow.

[Live demo](https://pdf-context-extractor.pages.dev) · [Report bug](https://github.com/<your-username>/pdf-context-extractor/issues) · [Request feature](https://github.com/<your-username>/pdf-context-extractor/issues)

---

## Why

Reading a 400-page ebook or research paper in WPS, Adobe, or a built-in reader? Trying to copy a chapter into ChatGPT to ask "explain this" means:

1. Click page 1, Ctrl+A, Ctrl+C
2. Switch tab, paste
3. Click page 2, Ctrl+A, Ctrl+C
4. Switch tab, paste
5. Repeat. For. Every. Single. Page.

This is broken. We fix it.

## Features

- **Drag/drop or click upload** with a real progress bar
- **Scrollable viewer** with zoom (50%–400%)
- **Two sidebar modes** — page list or thumbnail grid (lazy-generated, cached)
- **Flexible selection** — click, shift-click range, or type `1-10, 15, 40-42`
- **5 AI prompt templates** — Explain, Summarize, Key Points, Extract Quotes, Critique
- **Three copy formats** — raw text, markdown, or pre-formatted AI prompt
- **Export TXT** — download selected pages as plain text
- **Search inside extracted text** with match highlighting and count
- **Light/dark theme** with `localStorage` persistence
- **Mobile responsive** layout (tab-based switcher)
- **Keyboard shortcuts** — `Ctrl+O`, `Ctrl+A`, `Esc`
- **100% local** — the PDF never leaves your browser

## Quick start

### Run locally

```bash
git clone https://github.com/<your-username>/pdf-context-extractor.git
cd pdf-context-extractor
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
```

The static site is output to `dist/`. Drop it on any static host.

## Deploy

### Cloudflare Pages (recommended)

The app is a pure static SPA, so Cloudflare Pages is the simplest target.

**Option A — Git integration (zero-config CI/CD):**

1. Push this repo to GitHub.
2. In Cloudflare dashboard → **Pages** → **Create a project** → **Connect to Git**.
3. Select the repo.
4. Set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
   - **Environment variables:** none needed
5. Click **Save and Deploy**. Every push to `main` will redeploy automatically.

**Option B — Direct upload via Wrangler:**

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=pdf-context-extractor
```

A `wrangler.toml` is included so Wrangler knows the build directory.

### Other static hosts

The build output is a plain `dist/` folder. It works on:

- **Vercel** — `vercel deploy` (Vite preset auto-detected)
- **Netlify** — drag-and-drop the `dist/` folder, or connect git
- **GitHub Pages** — push `dist/` to a `gh-pages` branch
- **Any static file server** — `nginx`, `caddy`, `python -m http.server`, etc.

## Privacy

Everything runs in your browser. The PDF never leaves your machine. No server uploads, no analytics, no external API calls. The app works fully offline after the first load.

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Styling | TailwindCSS 4 (with `dark:` variants) |
| State | Zustand 5 |
| PDF engine | pdfjs-dist 4 |
| Upload | react-dropzone |
| Icons | lucide-react |

**Deliberately not used:** Next.js, shadcn/ui, Dexie/IndexedDB, gpt-tokenizer, react-virtual. We add dependencies only when a real need appears.

## Architecture

```
src/
  components/
    uploader/      — drag/drop + click PDF upload
    viewer/        — canvas-based PDF renderer with zoom
    sidebar/       — page list, selection, range input, thumbnail grid
    workspace/     — extraction preview, search, copy actions
    shared/        — landing page, theme toggle
  services/        — pdf, extraction, clipboard, file actions
  stores/          — Zustand: pdf, selection, workspace, theme
  utils/           — range parser, tokenizer
  types/           — shared TypeScript types
```

### Core services

- **`pdfService`** — load (with progress callback), render to canvas, extract text, generate thumbnails (with cache)
- **`extractionService`** — extract selected pages, format as text/markdown/AI prompt with 5 templates
- **`clipboardService`** — copy with `navigator.clipboard` + `execCommand` fallback
- **`pdfActions`** — shared `handleFileSelected` used by both uploader and file picker

## Roadmap

- **v0.2** — drag-select range on sidebar, session persistence (IndexedDB), keyboard nav (`j`/`k`/`space`)
- **v0.3** — OCR for scanned PDFs (Tesseract.js), highlight + export highlights
- **v0.4** — built-in AI chat panel (opt-in API key), chapter detection
- **v1.0** — Electron desktop build

See [CHANGELOG.md](CHANGELOG.md) for the full history.

## Contributing

We welcome PRs and issues. See [CONTRIBUTING.md](CONTRIBUTING.md) for the dev setup, project layout, and PR process.

## License

[MIT](LICENSE) — free to use, modify, and ship.
