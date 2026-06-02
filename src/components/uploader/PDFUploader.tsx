import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileDown, XCircle, FileText, Loader2 } from 'lucide-react'
import { usePDFStore } from '../../stores/pdfStore'
import { handleFileSelected, formatFileSize } from '../../services/pdfActions'

export function PDFUploader() {
  const {
    selectedFile,
    isLoading,
    loadProgress,
  } = usePDFStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) handleFileSelected(file)
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isLoading,
  })

  if (isLoading && selectedFile) {
    const pct = loadProgress
      ? Math.min(100, Math.round((loadProgress.loaded / Math.max(1, loadProgress.total)) * 100))
      : 0
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-blue-500/50 bg-blue-500/5 rounded-xl max-w-xl w-full transition-all"
      >
        <div className="w-14 h-14 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div className="text-center space-y-1 w-full min-w-0">
          <p className="text-base font-medium text-blue-700 dark:text-blue-300">
            Loading PDF
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 min-w-0">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
            <span className="text-neutral-400 dark:text-neutral-600 shrink-0">·</span>
            <span className="tabular-nums shrink-0">{formatFileSize(selectedFile.size)}</span>
          </div>
        </div>
        <div className="w-full max-w-xs space-y-1.5">
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-500 text-center tabular-nums">
            {pct}%
          </p>
        </div>
      </div>
    )
  }

  const showError = isDragReject
  const showActive = isDragActive && isDragAccept

  const stateClasses = showError
    ? 'border-red-500 bg-red-500/10 ring-4 ring-red-500/15 dark:ring-red-500/20'
    : showActive
      ? 'border-blue-500 bg-blue-500/15 ring-4 ring-blue-500/20 dark:ring-blue-500/25 scale-[1.015] shadow-2xl shadow-blue-500/20'
      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-900'

  const iconClasses = showError
    ? 'bg-red-500/15 text-red-500 scale-110'
    : showActive
      ? 'bg-blue-500/20 text-blue-500 scale-110 ring-4 ring-blue-500/20'
      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'

  const Icon = showError ? XCircle : showActive ? FileDown : Upload

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-4
        p-8 md:p-10 border-2 border-dashed rounded-xl
        cursor-pointer transition-all duration-200 ease-out
        select-none max-w-xl w-full
        ${stateClasses}
      `}
    >
      <input {...getInputProps()} />
      <div
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${iconClasses}`}
      >
        <Icon
          className={`w-6 h-6 md:w-7 md:h-7 ${showActive ? 'animate-pulse' : ''}`}
        />
      </div>
      <div className="text-center space-y-1">
        <p
          className={`text-base md:text-lg font-medium transition-colors ${
            showError
              ? 'text-red-600 dark:text-red-400'
              : showActive
                ? 'text-blue-600 dark:text-blue-300'
                : 'text-neutral-800 dark:text-neutral-200'
          }`}
        >
          {showError
            ? 'PDF files only'
            : showActive
              ? 'Release to load'
              : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-500">
          {showActive
            ? 'Loading starts immediately'
            : 'PDF files up to 300MB, 2000 pages'}
        </p>
      </div>
    </div>
  )
}
