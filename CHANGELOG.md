# Changelog

All notable changes to PDF Context Extractor are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project follows [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-06-02

### Added

- **PDF upload** via drag/drop or file picker, with a real progress bar showing bytes loaded while parsing
- **PDF viewer** — scrollable, zoom 50%–400%, fit-to-100% default
- **Page sidebar** with two view modes:
  - List view: page numbers, click to select, shift-click for range
  - Grid view: lazy-generated thumbnails (IntersectionObserver-driven, cached)
- **Range input** — type `1-10, 15, 40-42` to select multiple ranges at once
- **Extraction workspace** with debounced auto-extraction (300ms)
- **Three copy actions:**
  - Copy Text — raw extracted text
  - Copy Markdown — `# Page N` headers per page
  - Copy AI Prompt — pre-formatted prompt with one of 5 templates:
    - Explain
    - Summarize
    - Key Points
    - Extract Quotes
    - Critique
- **Search inside extracted text** with regex-safe highlighting, match counter, clear button
- **Light/dark theme toggle** with `localStorage` persistence and `prefers-color-scheme` respect on first load
- **Mobile responsive** layout (tab-based switcher for Pages / View / Extract panels)
- **Thin scrollbar** styling for both light and dark themes
- **Drag-and-drop visual cues** — blue ring + scale + glow when dragging a PDF; red treatment for non-PDF files
- **Keyboard shortcuts:**
  - `Ctrl+O` — open PDF
  - `Ctrl+A` — select all pages
  - `Esc` — clear selection
- **Export TXT** — download selected pages as a plain-text file
- **Landing page** with hero, 3-step flow, and privacy badge

### Privacy

- 100% local — no server, no analytics, no external API calls
- The PDF never leaves the browser

### Tech

- Vite 8 + React 19 + TypeScript
- pdfjs-dist 4
- Zustand 5
- TailwindCSS 4
- react-dropzone, lucide-react
