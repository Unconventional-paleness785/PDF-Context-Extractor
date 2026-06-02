import type { PDFDocumentProxy } from 'pdfjs-dist'

export interface PDFState {
  pdf: PDFDocumentProxy | null
  fileName: string
  totalPages: number
  isLoading: boolean
  error: string | null
}

export interface PageContent {
  pageNumber: number
  text: string
}

export interface ExtractionResult {
  pages: PageContent[]
  totalChars: number
  tokenEstimate: number
}

export interface ViewerSettings {
  scale: number
  currentPage: number
}

export type CopyMode = 'text' | 'markdown' | 'ai-prompt'

export type PromptTemplate =
  | 'explain'
  | 'summarize'
  | 'key-points'
  | 'quotes'
  | 'critique'
