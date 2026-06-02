import { create } from 'zustand'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { ExtractionResult } from '../types'
import { extractPages } from '../services/extractionService'

interface WorkspaceStore {
  extractionResult: ExtractionResult | null
  isExtracting: boolean
  searchQuery: string

  extract: (pdf: PDFDocumentProxy, pageNumbers: number[]) => Promise<void>
  setSearchQuery: (query: string) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  extractionResult: null,
  isExtracting: false,
  searchQuery: '',

  extract: async (pdf, pageNumbers) => {
    if (!pageNumbers.length) {
      set({ extractionResult: null, isExtracting: false })
      return
    }
    set({ isExtracting: true })
    try {
      const result = await extractPages(pdf, pageNumbers)
      set({ extractionResult: result, isExtracting: false })
    } catch {
      set({ extractionResult: null, isExtracting: false })
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  reset: () =>
    set({
      extractionResult: null,
      isExtracting: false,
      searchQuery: '',
    }),
}))
