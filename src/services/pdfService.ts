import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

export async function loadPDF(
  file: File,
  onProgress?: (loaded: number, total: number) => void,
): Promise<pdfjsLib.PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer()
  const task = pdfjsLib.getDocument({ data: arrayBuffer })
  if (onProgress) {
    task.onProgress = (p: pdfjsLib.OnProgressParameters) =>
      onProgress(p.loaded, p.total)
  }
  return await task.promise
}

export async function getPageText(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
): Promise<string> {
  const page = await pdf.getPage(pageNumber)
  const content = await page.getTextContent()
  return content.items
    .map((item) => ('str' in item ? item.str : ''))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function renderPageToCanvas(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5,
): Promise<void> {
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale })
  canvas.width = viewport.width
  canvas.height = viewport.height
  const context = canvas.getContext('2d')!
  await page.render({ canvas, canvasContext: context, viewport }).promise
}

const thumbnailCache = new Map<number, string>()
const inflight = new Map<number, Promise<string>>()

export async function getThumbnail(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 0.3,
): Promise<string> {
  const cached = thumbnailCache.get(pageNumber)
  if (cached) return cached

  const pending = inflight.get(pageNumber)
  if (pending) return pending

  const promise = (async () => {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.floor(viewport.width))
    canvas.height = Math.max(1, Math.floor(viewport.height))
    const context = canvas.getContext('2d')!
    await page.render({ canvas, canvasContext: context, viewport }).promise
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    thumbnailCache.set(pageNumber, dataUrl)
    inflight.delete(pageNumber)
    return dataUrl
  })()

  inflight.set(pageNumber, promise)
  return promise
}

export function clearThumbnailCache(): void {
  thumbnailCache.clear()
  inflight.clear()
}
