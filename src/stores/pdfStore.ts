import { create } from 'zustand'
import type { PDFDocumentProxy } from 'pdfjs-dist'

export interface LoadProgress {
  loaded: number
  total: number
}

interface PDFStore {
  pdf: PDFDocumentProxy | null
  fileName: string
  totalPages: number
  isLoading: boolean
  error: string | null
  selectedFile: File | null
  loadProgress: LoadProgress | null
  scale: number
  jumpToPage: number | null

  setPDF: (pdf: PDFDocumentProxy, fileName: string, totalPages: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedFile: (file: File | null) => void
  setLoadProgress: (progress: LoadProgress | null) => void
  setScale: (scale: number) => void
  setJumpToPage: (page: number | null) => void
  reset: () => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  pdf: null,
  fileName: '',
  totalPages: 0,
  isLoading: false,
  error: null,
  selectedFile: null,
  loadProgress: null,
  scale: 1.0,
  jumpToPage: null,

  setPDF: (pdf, fileName, totalPages) =>
    set({
      pdf,
      fileName,
      totalPages,
      isLoading: false,
      error: null,
      selectedFile: null,
      loadProgress: null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) =>
    set({ error, isLoading: false, selectedFile: null, loadProgress: null }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setScale: (scale) => set({ scale }),
  setJumpToPage: (jumpToPage) => set({ jumpToPage }),
  reset: () =>
    set({
      pdf: null,
      fileName: '',
      totalPages: 0,
      isLoading: false,
      error: null,
      selectedFile: null,
      loadProgress: null,
      scale: 1.0,
      jumpToPage: null,
    }),
}))
