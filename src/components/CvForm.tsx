import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Switch from '@mui/material/Switch'
import type {
  CvData,
  EducationEntry,
  LanguageEntry,
  WorkEntry,
  CertificationEntry,
  CustomSection,
  SkillGroup,
  CustomContact,
} from '../lib/cv/types'
import { FONT_SIZE_FIELDS, LABEL_FIELDS, LABEL_LANGS, LABEL_LANG_OPTIONS } from '../lib/cv/types'
import { useUiLang } from '../lib/i18n'
import PhotoCropDialog from './PhotoCropDialog'

const SECTION_LABELS: Record<string, string> = {
  profile: 'profile',
  appearance: 'appearance',
  summary: 'summary',
  skills: 'skills',
  work: 'work',
  education: 'education',
  languages: 'languages',
  certifications: 'certifications',
}

const EXPANDED_BY_DEFAULT = ['profile', 'summary', 'skills']

interface SectionCardProps {
  id: string
  title: string
  expanded: boolean
  onToggle: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  moveUpDisabled?: boolean
  moveDownDisabled?: boolean
  sx?: Record<string, unknown>
  children: ReactNode
}

function SectionCard({
  id,
  title,
  expanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  moveUpDisabled,
  moveDownDisabled,
  sx,
  children,
}: SectionCardProps) {
  const { t } = useUiLang()
  return (
    <Card id={`cv-section-${id}`} variant="outlined" sx={{ scrollMarginTop: 56, ...sx }}>
      <CardContent sx={{ pb: expanded ? 2 : 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
            {title}
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            {onMoveUp && (
              <IconButton size="small" onClick={onMoveUp} disabled={moveUpDisabled} aria-label={t('moveUp')}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
            )}
            {onMoveDown && (
              <IconButton size="small" onClick={onMoveDown} disabled={moveDownDisabled} aria-label={t('moveDown')}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={onToggle} size="small" aria-label={`toggle ${title}`}>
              <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
            </IconButton>
          </Stack>
        </Stack>
        <Collapse in={expanded}>{children}</Collapse>
      </CardContent>
    </Card>
  )
}

interface CvFormProps {
  cv: CvData
  onChange: (next: CvData) => void
}

export default function CvForm({ cv, onChange }: CvFormProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const base: Record<string, boolean> = {}
    for (const id of ['profile', ...cv.sectionOrder]) base[id] = EXPANDED_BY_DEFAULT.includes(id)
    return base
  })

  const patch = (p: Partial<CvData>) => onChange({ ...cv, ...p })
  const patchProfile = (p: Partial<CvData['profile']>) =>
    onChange({ ...cv, profile: { ...cv.profile, ...p } })

  const scrollTo = (id: string) =>
    document.getElementById(`cv-section-${id}`)?.scrollIntoView({ behavior: 'smooth' })

  // --- section ordering ---
  const moveSection = (id: string, dir: -1 | 1) => {
    const order = [...cv.sectionOrder]
    const i = order.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= order.length) return
    ;[order[i], order[j]] = [order[j], order[i]]
    patch({ sectionOrder: order })
  }

  // drag-and-drop reorder via the quick-nav chips (native HTML5 DnD)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const reorderSection = (fromId: string, toId: string) => {
    if (fromId === toId || fromId === 'profile') return
    const order = [...cv.sectionOrder]
    const from = order.indexOf(fromId)
    const to = order.indexOf(toId)
    if (from < 0 || to < 0) return
    order.splice(from, 1)
    order.splice(to, 0, fromId)
    patch({ sectionOrder: order })
  }

  const [highlightId, setHighlightId] = useState<string | null>(null)
  const addCustomSection = () => {
    const section: CustomSection = {
      id: `custom-${crypto.randomUUID().slice(0, 8)}`,
      title: 'New Section',
      style: 'paragraph',
      items: [],
    }
    patch({
      customSections: [...cv.customSections, section],
      sectionOrder: [...cv.sectionOrder, section.id],
    })
    setExpanded((e) => ({ ...e, [section.id]: true }))
    setHighlightId(section.id)
    window.setTimeout(() => {
      scrollTo(section.id)
      const input = document.querySelector<HTMLInputElement>(`#cv-section-${section.id} input`)
      input?.focus()
    }, 150)
    window.setTimeout(() => setHighlightId(null), 2500)
  }

  const updateCustom = (id: string, p: Partial<CustomSection>) =>
    patch({ customSections: cv.customSections.map((s) => (s.id === id ? { ...s, ...p } : s)) })

  const deleteCustom = (id: string) =>
    patch({
      customSections: cv.customSections.filter((s) => s.id !== id),
      sectionOrder: cv.sectionOrder.filter((sid) => sid !== id),
    })

  // --- repeatable entry helpers ---
  const updateWork = (i: number, p: Partial<WorkEntry>) =>
    patch({ work: cv.work.map((w, j) => (j === i ? { ...w, ...p } : w)) })
  const updateEducation = (i: number, p: Partial<EducationEntry>) =>
    patch({ education: cv.education.map((e, j) => (j === i ? { ...e, ...p } : e)) })
  const updateSkillGroup = (i: number, p: Partial<SkillGroup>) =>
    patch({ skillGroups: (cv.skillGroups ?? []).map((g, j) => (j === i ? { ...g, ...p } : g)) })
  const updateCustomContact = (i: number, p: Partial<CustomContact>) =>
    patch({ customContacts: (cv.customContacts ?? []).map((c, j) => (j === i ? { ...c, ...p } : c)) })
  const updateLanguage = (i: number, p: Partial<LanguageEntry>) =>
    patch({ languages: cv.languages.map((l, j) => (j === i ? { ...l, ...p } : l)) })
  const updateCertification = (i: number, p: Partial<CertificationEntry>) =>
    patch({ certifications: cv.certifications.map((c, j) => (j === i ? { ...c, ...p } : c)) })

  const f = (_v: string, cb: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    cb(e.target.value)

  const textFieldProps = { size: 'small' as const, fullWidth: true }

  // --- photo upload: open the crop editor, then store a 4:5 portrait JPEG ---
  // Any image type/orientation is accepted. The editor's default crop is biased
  // toward the top (faces sit above centre), and the user can drag/zoom to adjust.
  const photoRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(file)
    setCropSrc(objectUrlRef.current)
  }

  const closeCrop = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setCropSrc(null)
  }

  const applyCrop = (dataUrl: string) => {
    patchProfile({ photo: dataUrl })
    closeCrop()
  }

  const moveProps = (id: string) => ({
    onMoveUp: () => moveSection(id, -1),
    onMoveDown: () => moveSection(id, 1),
    moveUpDisabled: cv.sectionOrder.indexOf(id) === 0,
    moveDownDisabled: cv.sectionOrder.indexOf(id) === cv.sectionOrder.length - 1,
  })

  const renderCard = (id: string) => {
    const common = {
      id,
      title: SECTION_LABELS[id] ? t(SECTION_LABELS[id]) : cv.customSections.find((s) => s.id === id)?.title ?? t('section'),
      expanded: expanded[id] ?? false,
      onToggle: () => setExpanded((e) => ({ ...e, [id]: !e[id] })),
      ...(id === 'profile' || id === 'appearance' ? {} : moveProps(id)),
      sx: highlightId === id ? { outline: '2px solid', outlineColor: 'primary.main' } : undefined,
    }

    if (id === 'appearance') {
      return (
        <SectionCard key={id} {...common}>
          <Stack spacing={2} sx={{ mt: 1.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('accentColors')}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cv.accent}
                    onChange={(e) => patch({ accent: e.target.value })}
                    aria-label="Primary accent color"
                    style={{ width: 44, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('primaryAccent')}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Switch
                    size="small"
                    checked={!!cv.accent2}
                    onChange={(e) => patch({ accent2: e.target.checked ? cv.accent : undefined })}
                    aria-label="Enable secondary accent"
                  />
                  <input
                    type="color"
                    value={cv.accent2 ?? cv.accent}
                    disabled={!cv.accent2}
                    onChange={(e) => patch({ accent2: e.target.value })}
                    aria-label="Secondary accent color"
                    style={{
                      width: 44,
                      height: 32,
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      cursor: cv.accent2 ? 'pointer' : 'not-allowed',
                      opacity: cv.accent2 ? 1 : 0.35,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('secondaryAccent')}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('sidebarColors')}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cv.sidebarBg ?? '#eef1f4'}
                    onChange={(e) => patch({ sidebarBg: e.target.value === '#eef1f4' ? undefined : e.target.value })}
                    aria-label="Sidebar background color"
                    style={{ width: 44, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('sidebarBg')}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <input
                    type="color"
                    value={cv.sidebarText ?? '#333333'}
                    onChange={(e) => patch({ sidebarText: e.target.value === '#333333' ? undefined : e.target.value })}
                    aria-label="Sidebar text color"
                    style={{ width: 44, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('sidebarText')}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('fontSizes')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {FONT_SIZE_FIELDS.map(({ key, label }) => (
                  <TextField
                    key={key}
                    label={label}
                    type="number"
                    size="small"
                    slotProps={{ htmlInput: { min: 5, max: 60, step: 0.5 } }}
                    value={cv.fontSizes?.[key] ?? ''}
                    onChange={(e) => {
                      const fs = { ...cv.fontSizes }
                      const raw = e.target.value
                      if (raw === '') {
                        delete fs[key]
                      } else {
                        const v = parseFloat(raw)
                        if (!Number.isNaN(v)) fs[key] = v
                      }
                      patch({ fontSizes: Object.keys(fs).length ? fs : undefined })
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Leave empty to use the style&apos;s default size.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('contactDisplay')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <TextField
                  select
                  label={t('layout')}
                  size="small"
                  sx={{ minWidth: 150 }}
                  value={cv.contactLayout ?? 'inline'}
                  onChange={(e) =>
                    patch({
                      contactLayout:
                        e.target.value === 'inline' || e.target.value === 'separate' || e.target.value === 'lanes'
                          ? e.target.value
                          : undefined,
                    })
                  }
                >
                  <MenuItem value="inline">{t('inline')}</MenuItem>
                  <MenuItem value="separate">{t('separate')}</MenuItem>
                  <MenuItem value="lanes">{t('lanes')}</MenuItem>
                </TextField>
                <TextField
                  label={t('separator')}
                  size="small"
                  placeholder="·"
                  disabled={(cv.contactLayout ?? 'inline') !== 'inline'}
                  value={cv.contactSeparator ?? ''}
                  onChange={(e) => patch({ contactSeparator: e.target.value || undefined })}
                  sx={{ minWidth: 110 }}
                />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Switch
                    size="small"
                    checked={!!cv.contactTypes}
                    onChange={(e) => patch({ contactTypes: e.target.checked || undefined })}
                    aria-label={t('showTypeLabels')}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('showTypeLabels')}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Applies to Minimal, Classic, Big Type &amp; Edge Strip (Sidebar / Pro Classic have their own layout)
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('labelsPdf')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <TextField
                  select
                  label={t('cvLanguage')}
                  size="small"
                  sx={{ minWidth: 180 }}
                  value={cv.labelLang ?? 'en'}
                  onChange={(e) => patch({ labelLang: e.target.value === 'en' ? undefined : e.target.value })}
                >
                  {LABEL_LANG_OPTIONS.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" color="text.secondary">
                  Auto-translates headings &amp; contact types. Per-field overrides below win.
                </Typography>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {LABEL_FIELDS.map(({ key, label, fallback }) => (
                  <TextField
                    key={key}
                    label={label}
                    placeholder={LABEL_LANGS[cv.labelLang ?? 'en']?.[key] ?? fallback}
                    size="small"
                    value={cv.labels?.[key] ?? ''}
                    onChange={(e) => {
                      const labels = { ...cv.labels }
                      const v = e.target.value
                      if (v === '') {
                        delete labels[key]
                      } else {
                        labels[key] = v
                      }
                      patch({ labels: Object.keys(labels).length ? labels : undefined })
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Overrides for the auto-generated section headings and contact types. Empty = English default (e.g.
                &quot;Berufserfahrung&quot; for a German CV).
              </Typography>
            </Box>
          </Stack>
        </SectionCard>
      )
    }

    if (id === 'summary') {
      return (
        <SectionCard key={id} {...common}>
          <TextField
            multiline
            minRows={4}
            maxRows={10}
            label={t('aboutYou')}
            placeholder={t('aboutYouHint')}
            {...textFieldProps}
            value={cv.summary}
            onChange={f(cv.summary, (v) => patch({ summary: v }))}
            sx={{ mt: 1.5 }}
          />
        </SectionCard>
      )
    }

    if (id === 'skills') {
      return (
        <SectionCard key={id} {...common}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={cv.skills}
            onChange={(_, value) => patch({ skills: value.map(String) })}
            renderInput={(params) => (
              <TextField {...params} label={t('skills')} placeholder={t('skillPlaceholder')} size="small" sx={{ mt: 1.5 }} />
            )}
          />
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {cv.skillGroups?.map((g, gi) => (
              <Box
                key={gi}
                sx={{ p: 1.5, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={t('subsectionName')}
                    placeholder="e.g. Frameworks, Languages"
                    size="small"
                    value={g.name}
                    onChange={(e) => updateSkillGroup(gi, { name: e.target.value })}
                  />
                  <IconButton
                    size="small"
                    onClick={() => patch({ skillGroups: cv.skillGroups!.filter((_, j) => j !== gi) })}
                    aria-label={t('deleteSubsection')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={g.skills}
                  onChange={(_, value) => updateSkillGroup(gi, { skills: value.map(String) })}
                  renderInput={(params) => (
                    <TextField {...params} label={t('skillsIn', { group: g.name || t('thisSubsection') })} placeholder={t('skillPlaceholder')} size="small" />
                  )}
                />
              </Box>
            ))}
            <Button
              size="small"
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => patch({ skillGroups: [...(cv.skillGroups ?? []), { name: '', skills: [] }] })}
              sx={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}
            >
              {t('addSubsection')}
            </Button>
          </Stack>
        </SectionCard>
      )
    }

    if (id === 'work') {
      return (
        <SectionCard key={id} {...common}>
          <Stack spacing={2} sx={{ mt: 1.5 }}>
            {cv.work.map((w, i) => (
              <Box key={i}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">{w.role || t('entry', { n: i + 1 })}</Typography>
                  <IconButton size="small" onClick={() => patch({ work: cv.work.filter((_, j) => j !== i) })} aria-label={t('deleteEntry')}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField label={t('role')} placeholder="e.g. Software Engineer" {...textFieldProps} value={w.role} onChange={f(w.role, (v) => updateWork(i, { role: v }))} />
                    <TextField label={t('company')} placeholder="e.g. ACME GmbH" {...textFieldProps} value={w.company} onChange={f(w.company, (v) => updateWork(i, { company: v }))} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField label={t('location')} {...textFieldProps} value={w.location} onChange={f(w.location, (v) => updateWork(i, { location: v }))} />
                    <TextField label={t('start')} placeholder="2024-07" {...textFieldProps} value={w.start} onChange={f(w.start, (v) => updateWork(i, { start: v }))} />
                    <TextField label={t('end')} placeholder="2026-08 or Present" {...textFieldProps} value={w.end} onChange={f(w.end, (v) => updateWork(i, { end: v }))} />
                  </Stack>
                  <TextField
                    label={t('bullets')}
                    multiline
                    minRows={3}
                    {...textFieldProps}
                    value={w.bullets.join('\n')}
                    onChange={f(w.bullets.join('\n'), (v) => updateWork(i, { bullets: v.split('\n') }))}
                  />
                </Stack>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="primary"
              onClick={() =>
                patch({ work: [...cv.work, { role: '', company: '', location: '', start: '', end: '', bullets: [] }] })
              }
            >
              Add entry
            </Button>
          </Stack>
        </SectionCard>
      )
    }

    if (id === 'education') {
      return (
        <SectionCard key={id} {...common}>
          <Stack spacing={2} sx={{ mt: 1.5 }}>
            {cv.education.map((e, i) => (
              <Box key={i}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">{e.degree || t('entry', { n: i + 1 })}</Typography>
                  <IconButton size="small" onClick={() => patch({ education: cv.education.filter((_, j) => j !== i) })} aria-label={t('deleteEntry')}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                  <TextField label={t('degree')} placeholder="e.g. B.Sc. Computer Science" {...textFieldProps} value={e.degree} onChange={f(e.degree, (v) => updateEducation(i, { degree: v }))} />
                  <Stack direction="row" spacing={1}>
                    <TextField label={t('institution')} {...textFieldProps} value={e.institution} onChange={f(e.institution, (v) => updateEducation(i, { institution: v }))} />
                    <TextField label={t('location')} {...textFieldProps} value={e.location} onChange={f(e.location, (v) => updateEducation(i, { location: v }))} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField label={t('start')} placeholder="2016-10" {...textFieldProps} value={e.start} onChange={f(e.start, (v) => updateEducation(i, { start: v }))} />
                    <TextField label={t('end')} placeholder="2022-03" {...textFieldProps} value={e.end} onChange={f(e.end, (v) => updateEducation(i, { end: v }))} />
                  </Stack>
                  <TextField label={t('details')} multiline minRows={2} {...textFieldProps} value={e.details ?? ''} onChange={f(e.details ?? '', (v) => updateEducation(i, { details: v }))} />
                  <Typography variant="caption" color="text.secondary">
                    **bold**, *italic*, [label](https://…) becomes a clickable link
                  </Typography>
                </Stack>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="primary"
              onClick={() =>
                patch({ education: [...cv.education, { degree: '', institution: '', location: '', start: '', end: '' }] })
              }
            >
              Add entry
            </Button>
          </Stack>
        </SectionCard>
      )
    }

    if (id === 'languages') {
      return (
        <SectionCard key={id} {...common}>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {cv.languages.map((l, i) => (
              <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <TextField label={t('language')} {...textFieldProps} value={l.name} onChange={f(l.name, (v) => updateLanguage(i, { name: v }))} />
                <TextField label={t('level')} placeholder="C2 / Native" {...textFieldProps} value={l.level} onChange={f(l.level, (v) => updateLanguage(i, { level: v }))} />
                <IconButton size="small" onClick={() => patch({ languages: cv.languages.filter((_, j) => j !== i) })} aria-label={t('deleteEntry')}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => patch({ languages: [...cv.languages, { name: '', level: '' }] })}>
              Add language
            </Button>
          </Stack>
        </SectionCard>
      )
    }

    if (id === 'certifications') {
      return (
        <SectionCard key={id} {...common}>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {cv.certifications.map((c, i) => (
              <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <TextField label={t('certName')} {...textFieldProps} value={c.name} onChange={f(c.name, (v) => updateCertification(i, { name: v }))} />
                <TextField label={t('issuer')} {...textFieldProps} value={c.issuer} onChange={f(c.issuer, (v) => updateCertification(i, { issuer: v }))} />
                <TextField label={t('year')} {...textFieldProps} value={c.year} onChange={f(c.year, (v) => updateCertification(i, { year: v }))} />
                <IconButton size="small" onClick={() => patch({ certifications: cv.certifications.filter((_, j) => j !== i) })} aria-label={t('deleteEntry')}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="primary"
              onClick={() => patch({ certifications: [...cv.certifications, { name: '', issuer: '', year: '' }] })}
            >
              Add certification
            </Button>
          </Stack>
        </SectionCard>
      )
    }

    // custom section
    const cs = cv.customSections.find((s) => s.id === id)
    if (!cs) return null
    return (
      <SectionCard key={id} {...common}>
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TextField label={t('sectionTitle')} {...textFieldProps} value={cs.title} onChange={f(cs.title, (v) => updateCustom(id, { title: v }))} />
            <TextField
              select
              label={t('style')}
              size="small"
              sx={{ minWidth: 140 }}
              value={cs.style}
              onChange={(e) => updateCustom(id, { style: e.target.value as CustomSection['style'] })}
            >
              <MenuItem value="bullets">Bullet list</MenuItem>
              <MenuItem value="line">Inline line</MenuItem>
              <MenuItem value="paragraph">Paragraph</MenuItem>
            </TextField>
            <IconButton size="small" onClick={() => deleteCustom(id)} aria-label={t('deleteSection')}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
          <TextField
            label={t('items')}
            multiline
            minRows={3}
            {...textFieldProps}
            value={cs.items.join('\n')}
            onChange={f(cs.items.join('\n'), (v) => updateCustom(id, { items: v.split('\n') }))}
          />
          <Typography variant="caption" color="text.secondary">
            Paragraph: one item per line — **bold**, *italic*, [label](url) becomes a link; lines starting with &quot;- &quot; become bullets ·
            Bullet list: one bullet per item · Inline line: items joined with commas
          </Typography>
        </Stack>
      </SectionCard>
    )
  }

  const sectionIds = ['appearance', 'profile', ...cv.sectionOrder]
  const { t } = useUiLang()

  return (
    <Stack spacing={1.5}>
      {/* quick-nav */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'rgba(11, 14, 19, 0.9)',
          backdropFilter: 'blur(8px)',
          py: 1,
          flexWrap: 'wrap',
          borderRadius: 2,
        }}
      >
        {sectionIds.map((id) => (
          <Chip
            key={id}
            label={SECTION_LABELS[id] ? t(SECTION_LABELS[id]) : cv.customSections.find((s) => s.id === id)?.title ?? t('section')}
            size="small"
            draggable={id !== 'profile' && id !== 'appearance'}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', id)
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragOver(id)}
            onDragLeave={() => setDragOver((cur) => (cur === id ? null : cur))}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(null)
              const from = e.dataTransfer.getData('text/plain')
              if (from) reorderSection(from, id)
            }}
            onClick={() => scrollTo(id)}
            sx={dragOver === id ? { outline: '2px solid', outlineColor: 'primary.main' } : undefined}
          />
        ))}
      </Stack>

      {renderCard('appearance')}

      {/* profile / header card (always first, no reordering) */}
      <SectionCard
        id="profile"
        title={t('profile')}
        expanded={expanded.profile ?? true}
        onToggle={() => setExpanded((e) => ({ ...e, profile: !e.profile }))}
      >
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <TextField label={t('fullName')} placeholder="e.g. Jane Doe" {...textFieldProps} value={cv.profile.fullName} onChange={f(cv.profile.fullName, (v) => patchProfile({ fullName: v }))} />
          <TextField label={t('headline')} placeholder="e.g. Senior Backend Engineer" {...textFieldProps} value={cv.profile.headline} onChange={f(cv.profile.headline, (v) => patchProfile({ headline: v }))} />
          <TextField label={t('email')} type="email" {...textFieldProps} value={cv.profile.email} onChange={f(cv.profile.email, (v) => patchProfile({ email: v }))} />
          <TextField label={t('phone')} {...textFieldProps} value={cv.profile.phone} onChange={f(cv.profile.phone, (v) => patchProfile({ phone: v }))} />
          <TextField label={t('location')} placeholder="City, Country" {...textFieldProps} value={cv.profile.location} onChange={f(cv.profile.location, (v) => patchProfile({ location: v }))} />
          <TextField label={t('website')} {...textFieldProps} value={cv.profile.website ?? ''} onChange={f(cv.profile.website ?? '', (v) => patchProfile({ website: v }))} />
          <TextField label={t('linkedin')} {...textFieldProps} value={cv.profile.linkedin ?? ''} onChange={f(cv.profile.linkedin ?? '', (v) => patchProfile({ linkedin: v }))} />
          <TextField label={t('github')} {...textFieldProps} value={cv.profile.github ?? ''} onChange={f(cv.profile.github ?? '', (v) => patchProfile({ github: v }))} />

          {cv.customContacts?.map((c, ci) => (
            <Stack key={ci} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TextField
                label={t('type')}
                placeholder="e.g. Discord"
                {...textFieldProps}
                value={c.type}
                onChange={f(c.type, (v) => updateCustomContact(ci, { type: v }))}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t('value')}
                {...textFieldProps}
                value={c.value}
                onChange={f(c.value, (v) => updateCustomContact(ci, { value: v }))}
                sx={{ flex: 2 }}
              />
              <IconButton
                size="small"
                onClick={() => patch({ customContacts: cv.customContacts!.filter((_, j) => j !== ci) })}
                aria-label={t('deleteField')}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => patch({ customContacts: [...(cv.customContacts ?? []), { type: '', value: '' }] })}
            sx={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}
          >
            {t('addContactField')}
          </Button>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            {cv.profile.photo ? (
              <Box component="img" src={cv.profile.photo} alt="CV photo" sx={{ width: 56, height: 70, borderRadius: 1, objectFit: 'cover' }} />
            ) : (
              <Box
                sx={{
                  width: 56,
                  height: 70,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Photo
                </Typography>
              </Box>
            )}
            <Stack spacing={0.5}>
              <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
              <Button size="small" variant="outlined" onClick={() => photoRef.current?.click()}>
                {t('uploadPhoto')}
              </Button>
              {cv.profile.photo && (
                <Button size="small" onClick={() => patchProfile({ photo: undefined })}>
                  {t('removePhoto')}
                </Button>
              )}
            </Stack>
          </Stack>

        </Stack>
      </SectionCard>

      {cv.sectionOrder.map((id) => renderCard(id))}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        color="primary"
        onClick={addCustomSection}
        sx={{ borderStyle: 'dashed', py: 1.4, color: 'text.secondary' }}
      >
        {t('addCustomSection')}
      </Button>

      <PhotoCropDialog open={!!cropSrc} src={cropSrc} onClose={closeCrop} onApply={applyCrop} />
    </Stack>
  )
}
