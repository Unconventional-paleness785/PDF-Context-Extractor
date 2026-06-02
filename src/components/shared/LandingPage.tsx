import { FileText, ListChecks, Copy, Sparkles, Lock, Zap } from 'lucide-react'
import { PDFUploader } from '../uploader/PDFUploader'

export function LandingPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              PDF Context Extractor
            </h1>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              Pick pages from any PDF, copy clean text, and paste it into ChatGPT,
              Claude, Gemini, or your notes.
            </p>
          </div>
        </div>

        <PDFUploader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Step
            num={1}
            icon={ListChecks}
            title="Select pages"
            description="Click, shift-click, or type a range like 1-10, 15, 40-42"
          />
          <Step
            num={2}
            icon={Copy}
            title="Copy text"
            description="As raw text, markdown, or a pre-formatted AI prompt"
          />
          <Step
            num={3}
            icon={Sparkles}
            title="Paste into AI"
            description="Drop it into any AI chat, your notes, or export as TXT"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
            <Lock className="w-3.5 h-3.5" />
            <span>100% local — your PDF never leaves your browser</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">
            ·
          </span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
            <Zap className="w-3.5 h-3.5" />
            <span>Works offline after first load</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({
  num,
  icon: Icon,
  title,
  description,
}: {
  num: number
  icon: typeof ListChecks
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-2 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold tabular-nums">
          {num}
        </div>
        <Icon className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
      </div>
      <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
