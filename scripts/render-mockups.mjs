// Render the 4 mockup designs to PDFs for visual comparison
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { writeFileSync, mkdirSync } from 'node:fs'

const server = await createServer({ server: { middlewareMode: true }, logLevel: 'error', appType: 'custom' })
try {
  const { SAMPLE_CV } = await server.ssrLoadModule('/src/lib/cv/sample.ts')
  const mods = {
    Editorial: await server.ssrLoadModule('/src/components/styles/Editorial.tsx'),
    TwoTone: await server.ssrLoadModule('/src/components/styles/TwoTone.tsx'),
    Timeline: await server.ssrLoadModule('/src/components/styles/Timeline.tsx'),
    Sidebar: await server.ssrLoadModule('/src/components/styles/Sidebar.tsx'),
    SidebarDark: await server.ssrLoadModule('/src/components/styles/SidebarDark.tsx'),
    RailAmber: await server.ssrLoadModule('/src/components/styles/RailAmber.tsx'),
    Overline: await server.ssrLoadModule('/src/components/styles/Overline.tsx'),
    HeroBlock: await server.ssrLoadModule('/src/components/styles/HeroBlock.tsx'),
    ProClassic: await server.ssrLoadModule('/src/components/styles/ProClassic.tsx'),
    BigType: await server.ssrLoadModule('/src/components/styles/BigType.tsx'),
    EdgeStrip: await server.ssrLoadModule('/src/components/styles/EdgeStrip.tsx'),
    Banner: await server.ssrLoadModule('/src/components/styles/Banner.tsx'),
  }
  mkdirSync('/tmp/mockups', { recursive: true })
  for (const [name, m] of Object.entries(mods)) {
    const buf = await renderToBuffer(createElement(m[name], { cv: SAMPLE_CV, backupString: 'cv0$x' }))
    writeFileSync(`/tmp/mockups/${name.toLowerCase()}.pdf`, buf)
    console.log(`${name.toLowerCase()}: ${buf.length} bytes`)
  }
} finally {
  await server.close()
}
