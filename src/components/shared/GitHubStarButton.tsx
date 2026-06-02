import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { GITHUB_REPO_URL } from '../../constants'
import { cn } from '../../lib/utils'

type Variant = 'header' | 'cta'

export function GitHubStarButton({ variant = 'header' }: { variant?: Variant }) {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('https://api.github.com/repos/Mohammadjamiu/PDF-Context-Extractor')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (variant === 'cta') {
    return (
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Star className="w-4 h-4 fill-current" />
        <span>Star on GitHub</span>
        {stars !== null && (
          <span className="px-1.5 py-0.5 text-xs rounded bg-background/20 tabular-nums">
            {formatCount(stars)}
          </span>
        )}
      </a>
    )
  }

  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Star on GitHub"
      aria-label="Star on GitHub"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted',
      )}
    >
      <Star className="w-3.5 h-3.5" />
      <span className="text-xs font-medium hidden sm:inline">Star</span>
      {stars !== null && (
        <span className="text-xs tabular-nums text-muted-foreground">· {formatCount(stars)}</span>
      )}
    </a>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
