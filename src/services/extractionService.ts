import type { PDFDocumentProxy } from 'pdfjs-dist'
import { getPageText } from './pdfService'
import { estimateTokens } from '../utils/tokenizer'
import type { ExtractionResult, PromptTemplate } from '../types'

export async function extractPages(
  pdf: PDFDocumentProxy,
  pageNumbers: number[],
): Promise<ExtractionResult> {
  const sorted = [...pageNumbers].sort((a, b) => a - b)

  const pagePromises = sorted.map(async (pageNum) => {
    const text = await getPageText(pdf, pageNum)
    return { pageNumber: pageNum, text }
  })

  const pages = await Promise.all(pagePromises)

  const fullText = pages.map((p) => p.text).join('\n\n')
  const totalChars = fullText.length
  const tokenEstimate = estimateTokens(fullText)

  return { pages, totalChars, tokenEstimate }
}

export function formatAsMarkdown(result: ExtractionResult): string {
  return result.pages
    .map((page) => `# Page ${page.pageNumber}\n\n${page.text}`)
    .join('\n\n---\n\n')
}

export interface PromptTemplateInfo {
  id: PromptTemplate
  label: string
  description: string
  format: (content: string) => string
}

export const PROMPT_TEMPLATES: PromptTemplateInfo[] = [
  {
    id: 'explain',
    label: 'Explain',
    description: 'Explain the content in detail',
    format: (content) =>
      `Please explain the following content.\n\n${content}`,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Provide a concise summary',
    format: (content) =>
      `Please provide a concise summary of the following content.\n\n${content}`,
  },
  {
    id: 'key-points',
    label: 'Key Points',
    description: 'Extract the main key points',
    format: (content) =>
      `Extract the main key points from the following content. Format as a bulleted list.\n\n${content}`,
  },
  {
    id: 'quotes',
    label: 'Extract Quotes',
    description: 'Pull out notable quotes',
    format: (content) =>
      `Extract the most notable and quotable passages from the following content.\n\n${content}`,
  },
  {
    id: 'critique',
    label: 'Critique',
    description: 'Critically analyze the content',
    format: (content) =>
      `Please provide a critical analysis of the following content, including strengths, weaknesses, and any biases.\n\n${content}`,
  },
]

export function formatAsAIPrompt(
  result: ExtractionResult,
  template: PromptTemplate = 'explain',
): string {
  const content = result.pages.map((page) => page.text).join('\n\n')
  const tmpl = PROMPT_TEMPLATES.find((t) => t.id === template)
  return (tmpl ?? PROMPT_TEMPLATES[0]).format(content)
}

export function formatAsText(result: ExtractionResult): string {
  return result.pages.map((page) => page.text).join('\n\n')
}
