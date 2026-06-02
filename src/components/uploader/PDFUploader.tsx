import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileDown, XCircle, FileText, Loader2 } from 'lucide-react'
import { usePDFStore } from '../../stores/pdfStore'
import { handleFileSelected, formatFileSize } from '../../services/pdfActions'

export function PDFUploader() {
  const { selectedFile, isLoading, loadProgress } = usePDFStore()

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
      ? Math.min(
          100,
          Math.round((loadProgress.loaded / Math.max(1, loadProgress.total)) * 100),
        )
      : 0
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-primary/50 bg-primary/5 rounded-xl w-full transition-all">
        <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div className="text-center space-y-1 w-full min-w-0">
          <p className="text-base font-medium text-primary">Loading PDF</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground min-w-0">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
            <span className="text-border shrink-0">·</span>
            <span className="tabular-nums shrink-0">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
        </div>
        <div className="w-full max-w-xs space-y-1.5">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center tabular-nums">
            {pct}%
          </p>
        </div>
      </div>
    )
  }

  const showError = isDragReject
  const showActive = isDragActive && isDragAccept

  const stateClasses = showError
    ? 'border-destructive bg-destructive/10 ring-4 ring-destructive/20'
    : showActive
      ? 'border-primary bg-primary/15 ring-4 ring-primary/25 scale-[1.015] shadow-2xl shadow-primary/20'
      : 'border-border hover:border-primary/40 bg-card hover:bg-muted/40'

  const iconClasses = showError
    ? 'bg-destructive/15 text-destructive scale-110'
    : showActive
      ? 'bg-primary/20 text-primary scale-110 ring-4 ring-primary/20'
      : 'bg-muted text-muted-foreground'

  const Icon = showError ? XCircle : showActive ? FileDown : Upload

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-4
        p-8 md:p-10 border-2 border-dashed rounded-xl
        cursor-pointer transition-all duration-200 ease-out
        select-none w-full
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
              ? 'text-destructive'
              : showActive
                ? 'text-primary'
                : 'text-foreground'
          }`}
        >
          {showError
            ? 'PDF files only'
            : showActive
              ? 'Release to load'
              : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          {showActive
            ? 'Loading starts immediately'
            : 'PDF files up to 300MB, 2000 pages'}
        </p>
      </div>
    </div>
  )
}
