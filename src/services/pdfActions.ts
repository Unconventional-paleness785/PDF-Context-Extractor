import { usePDFStore } from '../stores/pdfStore'
import { loadPDF } from './pdfService'

export async function handleFileSelected(file: File): Promise<void> {
  const {
    setError,
    setLoading,
    setPDF,
    setSelectedFile,
    setLoadProgress,
  } = usePDFStore.getState()

  if (
    file.type !== 'application/pdf' &&
    !file.name.toLowerCase().endsWith('.pdf')
  ) {
    setError('Please upload a PDF file')
    return
  }

  setSelectedFile(file)
  setLoadProgress({ loaded: 0, total: file.size })
  setLoading(true)
  setError(null)

  try {
    const pdf = await loadPDF(file, (loaded, total) => {
      setLoadProgress({ loaded, total: total || file.size })
    })
    setPDF(pdf, file.name, pdf.numPages)
  } catch {
    setError(
      'Failed to load PDF. The file may be corrupt or password-protected.',
    )
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}
