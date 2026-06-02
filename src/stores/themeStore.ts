import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('pdfextractor-theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem('pdfextractor-theme', theme)
  } catch {}
}

const initial = getInitialTheme()
applyTheme(initial)

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initial,
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
