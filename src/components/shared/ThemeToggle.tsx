import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
      className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
