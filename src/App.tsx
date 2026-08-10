import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import type { CvData } from './lib/cv/types'
import { BUILTIN_SECTION_IDS, DEFAULT_ACCENT } from './lib/cv/types'
import { SAMPLE_CV, CV_PRESETS } from './lib/cv/sample'
import { encodeCv } from './lib/cv/encoding'
import { CV_STYLES } from './components/styles'
import CvForm from './components/CvForm'
import PdfPreview from './components/PdfPreview'
import type { RenderMode } from './components/PdfPreview'
import ImportDialog from './components/ImportDialog'
import { LegalPage } from './components/LegalPages'
import type { LegalPageName } from './components/LegalPages'
import { UI_LANGS, useUiLang } from './lib/i18n'

const LS_CV = 'vitaeo:v1'
const LS_STYLE = 'vitaeo:style'

function isValidCv(v: unknown): v is CvData {
  if (typeof v !== 'object' || v === null) return false
  const c = v as Partial<CvData>
  return c.schema === 1 && typeof c.profile === 'object' && c.profile !== null
}

function loadStored(): CvData {
  try {
    const raw = localStorage.getItem(LS_CV)
    if (!raw) return SAMPLE_CV
    const parsed = JSON.parse(raw)
    if (!isValidCv(parsed)) return SAMPLE_CV
    if (!parsed.accent) parsed.accent = DEFAULT_ACCENT // migrate old stored CVs
    if (!parsed.sectionOrder) parsed.sectionOrder = [...BUILTIN_SECTION_IDS]
    if (!parsed.customSections) parsed.customSections = []
    return parsed
  } catch {
    return SAMPLE_CV
  }
}

export default function App() {
  const [cv, setCv] = useState<CvData>(loadStored)
  const [styleId, setStyleId] = useState<string>(
    () => localStorage.getItem(LS_STYLE) ?? 'minimal',
  )
  const [renderMode, setRenderMode] = useState<RenderMode>(
    () => (localStorage.getItem('vitaeo:mode') as RenderMode) ?? 'live',
  )
  const [passphrase, setPassphrase] = useState('')
  const [backupString, setBackupString] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [showPass, setShowPass] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [helpAnchor, setHelpAnchor] = useState<HTMLElement | null>(null)
  const [legal, setLegal] = useState<LegalPageName | null>(null)
  const [preset, setPreset] = useState('')

  const theme = useTheme()
  const narrow = useMediaQuery(theme.breakpoints.down('md'))
  const { lang, auto, setLang, t } = useUiLang()

  // debounce refs
  const cvTimer = useRef<number | undefined>(undefined)
  const encTimer = useRef<number | undefined>(undefined)

  // autosave cv (debounced)
  useEffect(() => {
    setSaveStatus('saving')
    window.clearTimeout(cvTimer.current)
    cvTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(LS_CV, JSON.stringify(cv))
      } catch {
        /* storage full/unavailable — non-fatal */
      }
      setSaveStatus('saved')
    }, 500)
    return () => window.clearTimeout(cvTimer.current)
  }, [cv])

  // encode backup string (debounced) — feeds both export and PDF embed
  useEffect(() => {
    window.clearTimeout(encTimer.current)
    encTimer.current = window.setTimeout(() => {
      void encodeCv(cv, passphrase).then(setBackupString)
    }, 400)
    return () => window.clearTimeout(encTimer.current)
  }, [cv, passphrase])

  // persist style
  useEffect(() => {
    localStorage.setItem(LS_STYLE, styleId)
  }, [styleId])

  // persist render mode
  useEffect(() => {
    localStorage.setItem('vitaeo:mode', renderMode)
  }, [renderMode])

  const copyBackup = useCallback(async () => {
    if (!backupString) return
    try {
      await navigator.clipboard.writeText(backupString)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setNotice('Clipboard blocked — copy the string from the export field instead.')
    }
  }, [backupString])

  const handleImport = useCallback(
    (data: CvData) => {
      const current = JSON.stringify(cv)
      const incoming = JSON.stringify(data)
      if (current !== incoming && !window.confirm('Replace current data?')) return
      if (!data.accent) data.accent = DEFAULT_ACCENT // migrate old backup strings
      if (!data.sectionOrder) data.sectionOrder = [...BUILTIN_SECTION_IDS]
      if (!data.customSections) data.customSections = []
      setCv(data)
      setPassphrase('')
      setNotice('Data loaded.')
      window.setTimeout(() => setNotice(''), 2500)
    },
    [cv],
  )

  if (legal) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <LegalPage page={legal} onBack={() => setLegal(null)} />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      {/* ambient depth glows (dark themes read flat without them) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(45% 30% at 8% -5%, rgba(245,158,11,0.09), transparent 60%), radial-gradient(40% 35% at 100% 100%, rgba(245,158,11,0.05), transparent 60%)',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* header */}
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: 'rgba(11, 14, 19, 0.82)',
            backdropFilter: 'blur(14px)',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, px: { xs: 1.5, md: 2.5 }, py: 1.1, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '11px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 22px rgba(245,158,11,0.35)',
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#0b0e13', fontSize: 19, lineHeight: 1 }}>
                V
              </Typography>
            </Box>
            <Box sx={{ mr: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.15 }}>Vitaeo</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, display: 'block' }}>
                {t('tagline')}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: saveStatus === 'saved' ? 'success.main' : 'primary.main',
                  boxShadow: saveStatus === 'saved' ? '0 0 8px rgba(74,222,128,0.7)' : '0 0 8px rgba(245,158,11,0.7)',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {saveStatus === 'saved' ? 'Saved' : 'Saving…'}
              </Typography>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <TextField
              select
              size="small"
              sx={{ minWidth: 150 }}
              label={t('sampleData')}
              value={preset}
              onChange={(e) => {
                const id = e.target.value
                const found = CV_PRESETS.find((p) => p.id === id)
                if (!found) return
                const hasContent = JSON.stringify(cv).length > 1200
                if (hasContent && !window.confirm(t('sampleConfirm'))) {
                  setPreset('')
                  return
                }
                setCv(found.cv)
                setBackupString('')
                setSaveStatus('saved')
                setPreset('')
              }}
            >
              <MenuItem value="sample">{t('sampleAlien')}</MenuItem>
              <MenuItem value="lorem">{t('sampleLorem')}</MenuItem>
              <MenuItem value="blank">{t('sampleBlank')}</MenuItem>
            </TextField>

            <Tooltip title={t('helpTooltip')}>
              <IconButton
                size="small"
                onClick={(e) => setHelpAnchor(e.currentTarget)}
                aria-label={t('helpTooltip')}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('passphraseTooltip')}>
              <TextField
                size="small"
                placeholder={t('passphrase')}
                type={showPass ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                sx={{ minWidth: 190 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPass((s) => !s)} aria-label="toggle passphrase visibility">
                          {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Tooltip>
            <Popover
              open={!!helpAnchor}
              anchorEl={helpAnchor}
              onClose={() => setHelpAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { maxWidth: 380, p: 2 } } }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">{t('helpTitle')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('helpExport')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('helpPassphrase')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('helpLocal')}
                </Typography>
              </Stack>
            </Popover>

            <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => setImportOpen(true)}>
              {t('import')}
            </Button>
            <Button variant="contained" startIcon={<ContentCopyIcon />} onClick={() => void copyBackup()} disabled={!backupString}>
              {copied ? t('copied') : t('export')}
            </Button>
            <TextField
              select
              size="small"
              sx={{ minWidth: 150 }}
              label={t('uiLanguage')}
              value={auto ? '__auto__' : lang}
              onChange={(e) => {
                const v = e.target.value
                setLang(v === '__auto__' ? null : (v as (typeof UI_LANGS)[number]))
              }}
            >
              <MenuItem value="__auto__">{t('uiAuto')}</MenuItem>
              {UI_LANGS.map((id) => (
                <MenuItem key={id} value={id}>
                  {id === 'en' ? 'English' : 'Deutsch'}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>

        {notice && (
          <Alert severity="info" sx={{ mx: 2, mt: 2 }} onClose={() => setNotice('')}>
            {notice}
          </Alert>
        )}

        <Stack
          direction={narrow ? 'column' : 'row'}
          spacing={2.5}
          sx={{ p: { xs: 1.5, md: 2.5 }, alignItems: 'flex-start', maxWidth: 1700, mx: 'auto', width: '100%' }}
        >
          <Box sx={{ flex: narrow ? 'none' : '1 1 55%', minWidth: 0, width: narrow ? '100%' : undefined }}>
            <CvForm cv={cv} onChange={setCv} />
          </Box>
          <Box
            sx={{
              flex: narrow ? 'none' : '1 1 45%',
              minWidth: 0,
              width: narrow ? '100%' : undefined,
              position: narrow ? 'static' : 'sticky',
              top: 84,
            }}
          >
            <Stack spacing={1.25}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 0.75,
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                <ToggleButtonGroup exclusive size="small" value={styleId} onChange={(_, v) => v && setStyleId(v)}>
                  {CV_STYLES.map((s) => (
                    <ToggleButton key={s.id} value={s.id}>
                      {s.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={renderMode}
                  onChange={(_, v) => v && setRenderMode(v as RenderMode)}
                >
                  <ToggleButton value="manual">Manual</ToggleButton>
                  <ToggleButton value="live">Live</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <PdfPreview cv={cv} backupString={backupString} styleId={styleId} mode={renderMode} />
            </Stack>
          </Box>
        </Stack>

        <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', pb: 2, opacity: 0.7 }}>
          {backupString
            ? `Backup string (${backupString.length} chars, ${backupString.startsWith('cv1$') ? 'encrypted' : 'compressed — not encrypted'})`
            : '…'}
        </Typography>

        <Box component="footer" sx={{ textAlign: 'center', pb: 3, px: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('footerLine', { year: new Date().getFullYear() })}
          </Typography>
          <Box sx={{ mt: 0.25 }}>
            <Button size="small" color="inherit" sx={{ textTransform: 'none', minWidth: 0, px: 1 }} onClick={() => setLegal('impressum')}>
              {t('impressum')}
            </Button>
            <Button size="small" color="inherit" sx={{ textTransform: 'none', minWidth: 0, px: 1 }} onClick={() => setLegal('terms')}>
              {t('terms')}
            </Button>
            <Button size="small" color="inherit" sx={{ textTransform: 'none', minWidth: 0, px: 1 }} onClick={() => setLegal('privacy')}>
              {t('privacy')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
