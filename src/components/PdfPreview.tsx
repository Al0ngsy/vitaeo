import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { usePDF } from '@react-pdf/renderer'
import type { CvData } from '../lib/cv/types'
import { CV_STYLES } from './styles'
import AtsViewDialog from './AtsViewDialog'
import { useUiLang } from '../lib/i18n'

export type RenderMode = 'live' | 'manual'

interface PdfPreviewProps {
  cv: CvData
  backupString: string
  styleId: string
  mode: RenderMode
}

const LIVE_DEBOUNCE_MS = 700

export default function PdfPreview({ cv, backupString, styleId, mode }: PdfPreviewProps) {
  const { t } = useUiLang()
  const Style = useMemo(() => CV_STYLES.find((s) => s.id === styleId)!.component, [styleId])
  const document = useMemo(
    () => <Style cv={cv} backupString={backupString} />,
    [Style, cv, backupString],
  )
  const snapshot = useMemo(
    () => JSON.stringify({ styleId, cv, backupString }),
    [styleId, cv, backupString],
  )

  // usePDF does not auto-update on prop change — call update() explicitly
  const [state, update] = usePDF()
  const [lastRendered, setLastRendered] = useState<string | null>(null)
  const [atsOpen, setAtsOpen] = useState(false)
  const liveTimer = useRef<number | undefined>(undefined)

  const stale = lastRendered !== null && lastRendered !== snapshot

  const renderNow = useCallback(() => {
    update(document)
    setLastRendered(snapshot)
  }, [update, document, snapshot])

  // initial render (both modes)
  useEffect(() => {
    renderNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // live mode: debounced re-render on changes
  useEffect(() => {
    if (mode !== 'live') return
    if (lastRendered === snapshot) return
    window.clearTimeout(liveTimer.current)
    liveTimer.current = window.setTimeout(renderNow, LIVE_DEBOUNCE_MS)
    return () => window.clearTimeout(liveTimer.current)
  }, [mode, snapshot, lastRendered, renderNow])

  // switching to live renders stale content immediately
  useEffect(() => {
    if (mode === 'live' && stale) renderNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const { url, blob, loading, error } = state
  const filename = (cv.profile.fullName || 'cv').toLowerCase().replace(/\s+/g, '-') + '-cv.pdf'

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          bgcolor: '#0d111c',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 1, md: 2 },
        }}
      >
        {url ? (
          <iframe
            src={url}
            title="CV preview"
            style={{
              width: '100%',
              height: '72vh',
              border: 'none',
              borderRadius: 8,
              background: '#fff',
              boxShadow: '0 14px 44px rgba(0,0,0,0.5)',
              display: 'block',
            }}
          />
        ) : (
          <Box
            sx={{
              height: '72vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              bgcolor: '#0d111c',
            }}
          >
            <Typography color="text.secondary">
              {loading ? 'Rendering…' : `PDF error: ${String(error)}`}
            </Typography>
          </Box>
        )}
      </Box>

      {mode === 'manual' &&
        (stale ? (
          <Button variant="contained" size="large" startIcon={<RefreshIcon />} onClick={renderNow}>
            {t('renderPdf')}
          </Button>
        ) : (
          <Button variant="outlined" size="large" startIcon={<RefreshIcon />} disabled>
            {t('upToDate')}
          </Button>
        ))}

      <Stack direction="row" spacing={1}>
        <Button
          component="a"
          href={url ?? undefined}
          download={filename}
          variant="contained"
          disabled={!url}
          sx={{ flex: 1 }}
        >
          {t('downloadPdf')}
        </Button>
        <Button variant="outlined" disabled={!blob} onClick={() => setAtsOpen(true)}>
          {t('atsView')}
        </Button>
      </Stack>
      <AtsViewDialog open={atsOpen} onClose={() => setAtsOpen(false)} blob={blob ?? null} />
    </Stack>
  )
}
