export function parseRange(input: string, totalPages: number): number[] {
  if (!input.trim()) return []

  const pages = new Set<number>()

  input.split(',').forEach((part) => {
    const trimmed = part.trim()
    if (!trimmed) return

    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-', 2)
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end)) return

      const from = Math.max(1, Math.min(start, end))
      const to = Math.min(totalPages, Math.max(start, end))
      for (let i = from; i <= to; i++) {
        pages.add(i)
      }
    } else {
      const num = parseInt(trimmed, 10)
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pages.add(num)
      }
    }
  })

  return Array.from(pages).sort((a, b) => a - b)
}

export function formatSelectedRange(pages: number[]): string {
  if (!pages.length) return ''

  const sorted = [...pages].sort((a, b) => a - b)
  const ranges: string[] = []
  let rangeStart = sorted[0]
  let rangeEnd = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd + 1) {
      rangeEnd = sorted[i]
    } else {
      ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`)
      rangeStart = sorted[i]
      rangeEnd = sorted[i]
    }
  }
  ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`)

  return ranges.join(', ')
}
