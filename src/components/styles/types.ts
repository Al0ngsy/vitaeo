import type { ReactElement } from 'react'
import type { CvData } from '../../lib/cv/types'

export interface CvStyleProps {
  cv: CvData
  backupString: string
}

export type CvStyleComponent = (props: CvStyleProps) => ReactElement
