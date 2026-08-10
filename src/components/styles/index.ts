import { Minimal } from './Minimal'
import { Classic } from './Classic'
import { Sidebar } from './Sidebar'
import { ProClassic } from './ProClassic'
import { BigType } from './BigType'
import { EdgeStrip } from './EdgeStrip'
import type { CvStyleComponent } from './types'

export const CV_STYLES: { id: string; label: string; component: CvStyleComponent }[] = [
  { id: 'minimal', label: 'Minimal', component: Minimal },
  { id: 'classic', label: 'Classic', component: Classic },
  { id: 'sidebar', label: 'Sidebar', component: Sidebar },
  { id: 'proclassic', label: 'Pro Classic', component: ProClassic },
  { id: 'bigtype', label: 'Big Type', component: BigType },
  { id: 'edgestrip', label: 'Edge Strip', component: EdgeStrip },
]
