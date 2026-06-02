import { useEffect, useRef, useState, useMemo } from 'react'
import {
  Copy,
  FileText,
  MessageSquare,
  Download,
  Loader2,
  Check,
  ChevronDown,
  X,
} from 'lucide-react'
import { usePDFStore } from '../../stores/pdfStore'
import { useSelectionStore } from '../../stores/selectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import {
  formatAsText,
  formatAsMarkdown,
  formatAsAIPrompt,
  PROMPT_TEMPLATES,
} from '../../services/extractionService'
import { copyToClipboard } from '../../services/clipboardService'
import type { PromptTemplate } from '../../types'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function ExtractionWorkspace() {
  const { pdf } = usePDFStore()
  const { selectedPages } = useSelectionStore()
  const {
    extractionResult,
    isExtracting,
    searchQuery,
    extract,
    setSearchQuery,
  } = useWorkspaceStore()

  const selectedCount = selectedPages.size
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const [template, setTemplate] = useState<PromptTemplate>('explain')
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false)
  const extractTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const templateMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pdf) return
    if (extractTimer.current) clearTimeout(extractTimer.current)
    extractTimer.current = setTimeout(() => {
      extract(pdf, Array.from(selectedPages))
    }, 300)
    return () => {
      if (extractTimer.current) clearTimeout(extractTimer.current)
    }
  }, [pdf, selectedPages, extract])

  useEffect(() => {
    if (!templateMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        templateMenuRef.current &&
        !templateMenuRef.current.contains(e.target as Node)
      ) {
        setTemplateMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [templateMenuOpen])

  const previewText = useMemo(
    () => extractionResult?.pages.map((p) => p.text).join('\n\n') ?? '',
    [extractionResult],
  )

  const matchCount = useMemo(() => {
    const q = searchQuery.trim()
    if (!q || !previewText) return 0
    const escaped = escapeRegex(q)
    const matches = previewText.match(new RegExp(escaped, 'gi'))
    return matches?.length ?? 0
  }, [previewText, searchQuery])

  const handleCopy = async (label: string, getText: () => string) => {
    const ok = await copyToClipboard(getText())
    if (ok) {
      setCopiedLabel(label)
      setTimeout(() => setCopiedLabel(null), 2000)
    }
  }

  const handleExportTxt = () => {
    if (!extractionResult) return
    const blob = new Blob([formatAsText(extractionResult)], {
      type: 'text/plain',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeTemplate = PROMPT_TEMPLATES.find((t) => t.id === template)!

  if (!pdf) {
    return (
      <div className="w-80 flex flex-col h-full border-l border-border bg-card shrink-0">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-xs text-muted-foreground text-center">
            Upload a PDF to begin
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 flex flex-col h-full border-l border-border bg-card shrink-0">
      <div className="px-4 py-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Workspace</h2>
          </div>
          {isExtracting && (
            <Loader2 className="w-3 h-3 text-primary animate-spin" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted rounded p-2">
            <div className="text-base font-semibold text-foreground tabular-nums">
              {selectedCount}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Pages
            </div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-base font-semibold text-foreground tabular-nums">
              {(extractionResult?.totalChars ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Chars
            </div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-base font-semibold text-foreground tabular-nums">
              {(extractionResult?.tokenEstimate ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Tokens
            </div>
          </div>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in extracted text..."
              className="w-full pl-7 pr-12 py-1 text-xs bg-muted border border-input rounded text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {searchQuery && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground tabular-nums px-1">
                  {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {extractionResult && selectedCount > 0 ? (
          searchQuery.trim() && matchCount === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No matches found
            </p>
          ) : (
            <div className="text-xs text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">
              <HighlightedText text={previewText} query={searchQuery} />
            </div>
          )
        ) : selectedCount > 0 ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs">Extracting text...</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8">
            Select pages from the sidebar to extract text
          </p>
        )}
      </div>

      {extractionResult && selectedCount > 0 && (
        <div className="p-3 border-t border-border space-y-1.5">
          <CopyButton
            icon={Copy}
            label="Copy Text"
            active={copiedLabel === 'Copy Text'}
            onClick={() =>
              handleCopy('Copy Text', () => formatAsText(extractionResult))
            }
          />
          <CopyButton
            icon={FileText}
            label="Copy Markdown"
            active={copiedLabel === 'Copy Markdown'}
            onClick={() =>
              handleCopy('Copy Markdown', () =>
                formatAsMarkdown(extractionResult),
              )
            }
          />

          <div ref={templateMenuRef} className="relative">
            <div className="flex w-full rounded overflow-hidden border border-input">
              <button
                onClick={() =>
                  handleCopy('Copy AI Prompt', () =>
                    formatAsAIPrompt(extractionResult, template),
                  )
                }
                className="group relative flex-1 flex items-center gap-2 min-w-0 px-3 py-1.5 text-xs bg-muted hover:bg-muted/70 text-foreground/80 transition-colors"
              >
                {copiedLabel === 'Copy AI Prompt' ? (
                  <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">
                  {copiedLabel === 'Copy AI Prompt'
                    ? 'Copied!'
                    : 'Copy AI Prompt'}
                </span>
              </button>
              <button
                onClick={() => setTemplateMenuOpen((v) => !v)}
                title="Change AI prompt template"
                aria-label="Change AI prompt template"
                aria-expanded={templateMenuOpen}
                className={`flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium border-l transition-colors shrink-0 ${
                  templateMenuOpen
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20'
                }`}
              >
                <span className="max-w-[80px] truncate">{activeTemplate.label}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform shrink-0 ${
                    templateMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            {templateMenuOpen && (
              <div className="absolute bottom-full right-0 mb-1 w-72 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-10">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  AI Prompt Template
                </div>
                {PROMPT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemplate(t.id)
                      setTemplateMenuOpen(false)
                    }}
                    className={`flex flex-col items-start w-full px-3 py-2 text-left transition-colors ${
                      template === t.id
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        template === t.id
                          ? 'text-primary'
                          : 'text-foreground'
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {t.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportTxt}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded bg-muted hover:bg-muted/70 text-foreground/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXT</span>
          </button>
        </div>
      )}
    </div>
  )
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escaped = escapeRegex(query)
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === query.toLowerCase()
        return isMatch ? (
          <mark
            key={i}
            className="bg-yellow-300/50 dark:bg-yellow-500/30 text-foreground rounded-sm px-0.5 -mx-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </>
  )
}

function CopyButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Copy
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded bg-muted hover:bg-muted/70 text-foreground/80 transition-colors"
    >
      {active ? (
        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      <span className="truncate">{active ? 'Copied!' : label}</span>
    </button>
  )
}
