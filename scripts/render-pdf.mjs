// Render every registered CV style to PDF for verification
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { writeFileSync, mkdirSync } from 'node:fs'

const server = await createServer({ server: { middlewareMode: true }, logLevel: 'error', appType: 'custom' })
try {
  const { SAMPLE_CV } = await server.ssrLoadModule('/src/lib/cv/sample.ts')
  const { CV_STYLES } = await server.ssrLoadModule('/src/components/styles/index.ts')
  // verify both accents render: primary stays sample blue, secondary rose
  const twoAccentCv = { ...SAMPLE_CV, accent: '#1a4f8b', accent2: '#e11d48' }
  mkdirSync('/tmp/vitaeo-styles', { recursive: true })
  for (const style of CV_STYLES) {
    const buf = await renderToBuffer(createElement(style.component, { cv: twoAccentCv, backupString: 'cv0$x' }))
    writeFileSync(`/tmp/vitaeo-styles/${style.id}.pdf`, buf)
    console.log(`${style.id}: ${buf.length} bytes`)
  }
} finally {
  await server.close()
}
