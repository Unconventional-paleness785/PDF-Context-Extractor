import { create } from 'zustand'
import { parseRange } from '../utils/rangeParser'

export type SidebarViewMode = 'list' | 'grid'

interface SelectionStore {
  selectedPages: Set<number>
  rangeInput: string
  lastClickedPage: number | null
  totalPages: number
  viewMode: SidebarViewMode

  togglePage: (page: number) => void
  selectRange: (start: number, end: number) => void
  parseRangeInput: () => void
  setRangeInput: (input: string) => void
  selectAll: () => void
  clearSelection: () => void
  setLastClickedPage: (page: number | null) => void
  setTotalPages: (totalPages: number) => void
  setViewMode: (mode: SidebarViewMode) => void
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedPages: new Set(),
  rangeInput: '',
  lastClickedPage: null,
  totalPages: 0,
  viewMode: 'list',

  togglePage: (page) =>
    set((state) => {
      const next = new Set(state.selectedPages)
      if (next.has(page)) {
        next.delete(page)
      } else {
        next.add(page)
      }
      return { selectedPages: next, lastClickedPage: page }
    }),

  selectRange: (start, end) => {
    const from = Math.min(start, end)
    const to = Math.max(start, end)
    const next = new Set<number>()
    for (let i = from; i <= to; i++) {
      next.add(i)
    }
    set({ selectedPages: next })
  },

  parseRangeInput: () => {
    const { rangeInput, totalPages } = get()
    if (!rangeInput.trim()) {
      set({ selectedPages: new Set() })
      return
    }
    const pages = parseRange(rangeInput, totalPages)
    set({ selectedPages: new Set(pages) })
  },

  setRangeInput: (rangeInput) => set({ rangeInput }),

  selectAll: () => {
    const { totalPages } = get()
    const next = new Set<number>()
    for (let i = 1; i <= totalPages; i++) {
      next.add(i)
    }
    set({ selectedPages: next })
  },

  clearSelection: () =>
    set({ selectedPages: new Set(), lastClickedPage: null }),

  setLastClickedPage: (page) => set({ lastClickedPage: page }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setViewMode: (viewMode) => set({ viewMode }),
}))
