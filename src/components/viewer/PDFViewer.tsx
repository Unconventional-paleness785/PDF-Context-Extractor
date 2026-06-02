import { useEffect, useRef, useCallback } from 'react'
import { Minus, Plus, Maximize } from 'lucide-react'
import { usePDFStore } from '../../stores/pdfStore'
import { renderPageToCanvas } from '../../services/pdfService'

export function PDFViewer() {
  const {
    pdf,
    fileName,
    totalPages,
    scale,
    setScale,
    jumpToPage,
    setJumpToPage,
  } = usePDFStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const renderIdRef = useRef(0)

  const renderPages = useCallback(async () => {
    if (!pdf || !containerRef.current) return

    const renderId = ++renderIdRef.current
    containerRef.current.innerHTML = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      if (renderId !== renderIdRef.current) return

      const canvas = document.createElement('canvas')
      canvas.dataset.page = String(i)
      canvas.className =
        'block mx-auto mb-4 shadow-md dark:shadow-black/30 rounded-sm bg-white'
      containerRef.current.appendChild(canvas)

      try {
        await renderPageToCanvas(pdf, i, canvas, scale)
      } catch {
        canvas.remove()
      }
    }
  }, [pdf, scale])

  useEffect(() => {
    renderPages()
  }, [renderPages])

  useEffect(() => {
    if (jumpToPage !== null && containerRef.current) {
      const canvas = containerRef.current.querySelector(
        `canvas[data-page="${jumpToPage}"]`,
      )
      if (canvas) {
        canvas.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setJumpToPage(null)
    }
  }, [jumpToPage, setJumpToPage])

  const zoomIn = () => setScale(Math.min(4, scale + 0.25))
  const zoomOut = () => setScale(Math.max(0.5, scale - 0.25))
  const zoomReset = () => setScale(1.0)

  if (!pdf) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500 text-lg">Upload a PDF to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-w-0 w-full">
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <span className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 truncate flex-1 min-w-0">
          {fileName} <span className="text-neutral-400 dark:text-neutral-600">—</span>{' '}
          <span className="tabular-nums">
            {totalPages} {totalPages === 1 ? 'page' : 'pages'}
          </span>
        </span>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs text-neutral-500 dark:text-neutral-500 w-12 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={zoomReset}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
            title="Reset zoom"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 md:p-6 bg-neutral-100 dark:bg-neutral-900"
      />
    </div>
  )
}
