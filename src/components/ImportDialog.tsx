import { useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import type { CvData } from '../lib/cv/types'
import { decodeCv } from '../lib/cv/encoding'
import { extractCvStringFromPdf } from '../lib/cv/pdf'
import { useUiLang } from '../lib/i18n'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (data: CvData) => void
}

export default function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const [tab, setTab] = useState(0)
  const { t } = useUiLang()
  const [pasted, setPasted] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [pdfName, setPdfName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setPasted('')
    setPassphrase('')
    setPdfName('')
    setError('')
    setBusy(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const load = async (str: string) => {
    setBusy(true)
    setError('')
    try {
      const data = (await decodeCv(str, passphrase)) as CvData
      onImport(data)
      handleClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const handleFile = async (file: File) => {
    setPdfName(file.name)
    setBusy(true)
    setError('')
    try {
      const str = await extractCvStringFromPdf(file)
      await load(str)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('importTitle')}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={t('pasteTab')} />
          <Tab label={t('uploadTab')} />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField
              label={t('backupString')}
              multiline
              minRows={4}
              placeholder="cv0$… or cv1$…"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
            />
            <Button variant="contained" disabled={!pasted || busy} onClick={() => load(pasted)}>
              {t('load')}
            </Button>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                border: '1.5px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {pdfName || 'Drop a PDF generated on this site, or click to choose'}
              </Typography>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleFile(file)
                  e.target.value = ''
                }}
              />
            </Box>
          </Stack>
        )}

        <TextField
          label="Passphrase (if the data is encrypted)"
          type="password"
          size="small"
          fullWidth
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          sx={{ mt: 2 }}
          disabled={busy}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={busy}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
