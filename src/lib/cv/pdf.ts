import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

let configured = false

function ensureWorker() {
  if (!configured) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
    configured = true
  }
}

export async function extractCvStringFromPdf(file: File): Promise<string> {
  ensureWorker()
  const task = pdfjs.getDocument({ data: await file.arrayBuffer() })
  const doc = await task.promise
  try {
    const { info } = await doc.getMetadata()
    const keywords: unknown = (info as Record<string, unknown> | null)?.Keywords
    if (typeof keywords !== 'string') {
      throw new Error('This PDF has no editable data — it must be generated on this site')
    }
    const match = keywords.match(/cv[01]\$[A-Za-z0-9_-]+/)
    if (!match) throw new Error('This PDF has no editable data — it must be generated on this site')
    return match[0]
  } finally {
    void task.destroy()
  }
}

// Reconstruct the text an ATS parser would extract: pages separated, text
// runs in content-stream order (= JSX tree order for our own PDFs — the
// absolute Sidebar rail blocks keep their logical position this way).
// Consecutive runs on the same line (e.g. rich-text markup) are merged.
export async function extractAtsText(blob: Blob): Promise<string> {
  ensureWorker()
  const task = pdfjs.getDocument({ data: await blob.arrayBuffer() })
  const doc = await task.promise
  try {
    const pages: string[] = []
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p)
      const content = await page.getTextContent()
      const lines: { y: number; text: string }[] = []
      for (const item of content.items) {
        if (!('str' in item)) continue
        const y = Math.round(item.transform[5])
        const last = lines[lines.length - 1]
        if (last && Math.abs(last.y - y) <= 1) {
          last.text += ` ${item.str}`
        } else {
          lines.push({ y, text: item.str })
        }
      }
      pages.push(lines.map((l) => l.text).join('\n'))
    }
    return pages.map((t, i) => `--- Page ${i + 1} ---\n${t}`).join('\n\n')
  } finally {
    void task.destroy()
  }
}
