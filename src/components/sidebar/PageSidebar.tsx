import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CheckCircle,
  Circle,
  SquareStack,
  Trash2,
  List,
  LayoutGrid,
  Loader2,
} from 'lucide-react'
import { usePDFStore } from '../../stores/pdfStore'
import { useSelectionStore } from '../../stores/selectionStore'
import { getThumbnail } from '../../services/pdfService'

export function PageSidebar() {
  const { pdf, totalPages, setJumpToPage } = usePDFStore()
  const {
    selectedPages,
    rangeInput,
    togglePage,
    selectRange,
    parseRangeInput,
    setRangeInput,
    selectAll,
    clearSelection,
    lastClickedPage,
    viewMode,
    setViewMode,
  } = useSelectionStore()

  const selectedCount = selectedPages.size

  const handlePageClick = useCallback(
    (page: number, event: React.MouseEvent) => {
      if (event.shiftKey && lastClickedPage !== null) {
        selectRange(lastClickedPage, page)
      } else {
        togglePage(page)
      }
      setJumpToPage(page)
    },
    [lastClickedPage, selectRange, togglePage, setJumpToPage],
  )

  return (
    <div className="w-64 flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
      <div className="p-3 space-y-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') parseRangeInput()
            }}
            placeholder={`e.g. 1-10, 15, ${Math.max(1, Math.min(totalPages, 55))}-${totalPages}`}
            className="flex-1 min-w-0 px-2 py-1 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
          />
          <button
            onClick={parseRangeInput}
            className="px-2.5 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Go
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={selectAll}
            className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <SquareStack className="w-3 h-3" />
            All
          </button>
          <button
            onClick={clearSelection}
            className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded p-0.5 shrink-0">
            <ViewToggle
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              icon={List}
              label="List view"
            />
            <ViewToggle
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              icon={LayoutGrid}
              label="Thumbnail view"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <ListView
            totalPages={totalPages}
            selectedPages={selectedPages}
            onPageClick={handlePageClick}
          />
        ) : (
          <GridView
            pdf={pdf}
            totalPages={totalPages}
            selectedPages={selectedPages}
            onPageClick={handlePageClick}
          />
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
        {selectedCount > 0
          ? `${selectedCount} page${selectedCount === 1 ? '' : 's'} selected`
          : `${totalPages} page${totalPages === 1 ? '' : 's'} total`}
      </div>
    </div>
  )
}

function ViewToggle({
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
      className={`p-1 rounded transition-colors ${
        active
          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
      }`}
    >
      <Icon className="w-3 h-3" />
    </button>
  )
}

function ListView({
  totalPages,
  selectedPages,
  onPageClick,
}: {
  totalPages: number
  selectedPages: Set<number>
  onPageClick: (page: number, e: React.MouseEvent) => void
}) {
  return (
    <>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isSelected = selectedPages.has(page)
        return (
          <div
            key={page}
            onClick={(e) => onPageClick(page, e)}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-sm select-none transition-colors border-l-2 ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 border-transparent'
            }`}
          >
            {isSelected ? (
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />
            )}
            <span className="tabular-nums text-xs">Page {page}</span>
          </div>
        )
      })}
    </>
  )
}

function GridView({
  pdf,
  totalPages,
  selectedPages,
  onPageClick,
}: {
  pdf: ReturnType<typeof usePDFStore.getState>['pdf']
  totalPages: number
  selectedPages: Set<number>
  onPageClick: (page: number, e: React.MouseEvent) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <ThumbnailCard
          key={page}
          pdf={pdf}
          page={page}
          isSelected={selectedPages.has(page)}
          onClick={onPageClick}
        />
      ))}
    </div>
  )
}

function ThumbnailCard({
  pdf,
  page,
  isSelected,
  onClick,
}: {
  pdf: ReturnType<typeof usePDFStore.getState>['pdf']
  page: number
  isSelected: boolean
  onClick: (page: number, e: React.MouseEvent) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px' },
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad || !pdf || thumbnail) return
    let cancelled = false
    getThumbnail(pdf, page)
      .then((url) => {
        if (!cancelled) setThumbnail(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [shouldLoad, pdf, page, thumbnail])

  return (
    <div
      ref={containerRef}
      onClick={(e) => onClick(page, e)}
      className={`group relative cursor-pointer rounded-md border-2 transition-all overflow-hidden ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Page ${page}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <Loader2 className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 animate-spin" />
        )}
      </div>
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-blue-500 text-white scale-100'
            : 'bg-white/90 dark:bg-neutral-900/90 text-transparent scale-90 group-hover:scale-100 group-hover:text-neutral-300'
        }`}
      >
        {isSelected ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
      </div>
      <div
        className={`absolute bottom-0 inset-x-0 px-1.5 py-0.5 text-[10px] tabular-nums font-medium ${
          isSelected
            ? 'bg-blue-500 text-white'
            : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300'
        }`}
      >
        Page {page}
      </div>
    </div>
  )
}
