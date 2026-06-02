import { useEffect, useRef, useState, useCallback } from 'react'
import { PDFViewer } from './components/viewer/PDFViewer'
import { PageSidebar } from './components/sidebar/PageSidebar'
import { ExtractionWorkspace } from './components/workspace/ExtractionWorkspace'
import { ThemeToggle } from './components/shared/ThemeToggle'
import { LandingPage } from './components/shared/LandingPage'
import { usePDFStore } from './stores/pdfStore'
import { useSelectionStore } from './stores/selectionStore'
import { useWorkspaceStore } from './stores/workspaceStore'
import { clearThumbnailCache } from './services/pdfService'
import { handleFileSelected } from './services/pdfActions'
import { FileText, List, FileSearch, Sparkles } from 'lucide-react'

type MobileView = 'pages' | 'viewer' | 'extract'

function App() {
  const { pdf, error } = usePDFStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mobileView, setMobileView] = useState<MobileView>('viewer')

  useEffect(() => {
    useSelectionStore.getState().clearSelection()
    useWorkspaceStore.getState().reset()
    if (pdf) {
      useSelectionStore.getState().setTotalPages(pdf.numPages)
      clearThumbnailCache()
    } else {
      useSelectionStore.getState().setTotalPages(0)
      clearThumbnailCache()
      setMobileView('viewer')
    }
  }, [pdf])

  const handleFileOpen = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      handleFileSelected(file)
      e.target.value = ''
    },
    [],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'o':
            e.preventDefault()
            fileInputRef.current?.click()
            break
          case 'a':
            if (pdf) {
              e.preventDefault()
              useSelectionStore.getState().selectAll()
            }
            break
        }
      }
      if (e.key === 'Escape') {
        useSelectionStore.getState().clearSelection()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pdf])

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileOpen}
        className="hidden"
      />

      <header className="flex items-center justify-between gap-2 px-3 md:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
          <h1 className="font-semibold text-sm tracking-wide truncate">
            PDF Context Extractor
          </h1>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {pdf && (
            <div className="md:hidden flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-md p-0.5">
              <MobileTab
                active={mobileView === 'pages'}
                onClick={() => setMobileView('pages')}
                icon={List}
                label="Pages"
              />
              <MobileTab
                active={mobileView === 'viewer'}
                onClick={() => setMobileView('viewer')}
                icon={FileSearch}
                label="View"
              />
              <MobileTab
                active={mobileView === 'extract'}
                onClick={() => setMobileView('extract')}
                icon={Sparkles}
                label="Extract"
              />
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {error && (
        <div className="mx-3 md:mx-4 mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center justify-between">
          <span className="min-w-0 truncate">{error}</span>
          <button
            onClick={() => usePDFStore.getState().setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline text-xs ml-3 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {!pdf ? (
          <LandingPage />
        ) : (
          <>
            <div
              className={`${mobileView === 'pages' ? 'flex' : 'hidden'} md:flex shrink-0`}
            >
              <PageSidebar />
            </div>
            <div
              className={`${mobileView === 'viewer' ? 'flex' : 'hidden'} md:flex flex-1 min-w-0`}
            >
              <PDFViewer />
            </div>
            <div
              className={`${mobileView === 'extract' ? 'flex' : 'hidden'} md:flex shrink-0`}
            >
              <ExtractionWorkspace />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function MobileTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof List
  label: string
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}

export default App
