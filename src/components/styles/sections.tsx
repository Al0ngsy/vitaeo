import { Fragment } from 'react'
import type { ReactElement } from 'react'
import { Link, Text, View } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { CvData, CvLabels, FontSizes } from '../../lib/cv/types'
import { LABEL_LANGS } from '../../lib/cv/types'

// User-overridable PDF string: manual labels[key] wins, then the selected
// language's built-in translation, then the English fallback.
export const labelOf = (cv: CvData, key: keyof CvLabels, fallback: string) =>
  cv.labels?.[key]?.trim() || LABEL_LANGS[cv.labelLang ?? 'en']?.[key] || fallback

export interface SectionStyles {
  section: Style
  summary: Style
  entryTitle: Style
  entryMeta: Style
  bullet: Style
  entryEnd: Style
  skillGroup: Style
  skillRow: Style
}

// which style keys each font-size knob patches (only patched when the style has that key)
const FONT_STYLE_KEYS: Record<keyof FontSizes, string[]> = {
  name: ['name'],
  headline: ['headline'],
  section: ['section'],
  title: ['entryTitle'],
  body: ['bullet', 'summary', 'skillRow', 'railSkill'],
  meta: ['entryMeta', 'contactLine', 'dates', 'contact'],
}

const clampFont = (v: number) => Math.min(60, Math.max(5, v))

// Patches fontSize on matching style entries; returns the same object when no overrides.
export function applyFontSizes<T extends object>(styles: T, fs?: FontSizes): T {
  if (!fs) return styles
  const out = { ...styles } as Record<string, unknown>
  for (const [key, styleKeys] of Object.entries(FONT_STYLE_KEYS)) {
    const v = fs[key as keyof FontSizes]
    if (v == null) continue
    for (const sk of styleKeys) {
      const s = out[sk]
      if (s && typeof s === 'object') {
        out[sk] = { ...(s as object), fontSize: clampFont(v) }
      }
    }
  }
  return out as T
}

export interface ContactItem {
  type: string
  value: string
}

export const contactItems = (cv: CvData): ContactItem[] => {
  const p = cv.profile
  const items: ContactItem[] = [
    ...(p.email ? [{ type: labelOf(cv, 'email', 'Email'), value: p.email }] : []),
    ...(p.phone ? [{ type: labelOf(cv, 'phone', 'Phone'), value: p.phone }] : []),
    ...(p.location ? [{ type: labelOf(cv, 'location', 'Location'), value: p.location }] : []),
    ...(p.website ? [{ type: labelOf(cv, 'website', 'Website'), value: p.website }] : []),
    ...(p.linkedin ? [{ type: labelOf(cv, 'linkedin', 'LinkedIn'), value: p.linkedin }] : []),
    ...(p.github ? [{ type: labelOf(cv, 'github', 'GitHub'), value: p.github }] : []),
  ]
  for (const c of cv.customContacts ?? []) {
    if (c.type.trim() && c.value.trim()) items.push({ type: c.type.trim(), value: c.value.trim() })
  }
  return items
}

// Renders the contact block honoring cv.contactLayout / cv.contactSeparator /
// cv.contactTypes. Templates with a distinct contact treatment (e.g. Sidebar
// rail, ProClassic right column) render their own and do not use this.
export function ContactBlock({
  cv,
  style,
  defaultSeparator = ' · ',
  lanesAlign = 'left',
}: {
  cv: CvData
  style: Style
  defaultSeparator?: string
  lanesAlign?: 'left' | 'center'
}) {
  const items = contactItems(cv)
  if (items.length === 0) return null
  const text = (it: ContactItem) => (cv.contactTypes ? `${it.type}: ${it.value}` : it.value)
  const layout = cv.contactLayout ?? 'inline'
  if (layout === 'lanes') {
    const mid = Math.ceil(items.length / 2)
    const lane = (slice: ContactItem[]) =>
      slice.map((it, i) => (
        <Text key={i} style={[style, { textAlign: lanesAlign }]}>
          {text(it)}
        </Text>
      ))
    return (
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>{lane(items.slice(0, mid))}</View>
        <View style={{ flex: 1 }}>{lane(items.slice(mid))}</View>
      </View>
    )
  }
  if (layout === 'separate') {
    return (
      <>
        {items.map((it, i) => (
          <Text key={i} style={style}>
            {text(it)}
          </Text>
        ))}
      </>
    )
  }
  return <Text style={style}>{items.map(text).join(cv.contactSeparator ?? defaultSeparator)}</Text>
}

export interface RichFonts {
  bold: string
  italic: string
}

const DEFAULT_RICH_FONTS: RichFonts = { bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' }

// --- lightweight markup: **bold**, *italic*, [label](url) link ---
interface Segment {
  text: string
  bold?: boolean
  italic?: boolean
  url?: string
}

function richSegments(text: string): Segment[] {
  const parts = text.split(/(\[[^\[\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith('[') && p.endsWith(')') && p.includes('](')) {
        const close = p.indexOf('](')
        return { text: p.slice(1, close), url: p.slice(close + 2, -1) }
      }
      if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return { text: p.slice(2, -2), bold: true }
      if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return { text: p.slice(1, -1), italic: true }
      return { text: p }
    })
}

export function RichText({
  text,
  style,
  fonts = DEFAULT_RICH_FONTS,
  linkStyle = { textDecoration: 'underline' },
}: {
  text: string
  style: Style | Style[]
  fonts?: RichFonts
  linkStyle?: Style
}) {
  const segments = richSegments(text)
  if (segments.length === 1 && !segments[0].bold && !segments[0].italic && !segments[0].url) {
    return <Text style={style}>{text}</Text>
  }
  return (
    <Text style={style}>
      {segments.map((seg, i) =>
        seg.url ? (
          <Link key={i} src={seg.url} style={linkStyle}>
            {seg.text}
          </Link>
        ) : seg.bold ? (
          <Text key={i} style={{ fontFamily: fonts.bold }}>
            {seg.text}
          </Text>
        ) : seg.italic ? (
          <Text key={i} style={{ fontFamily: fonts.italic }}>
            {seg.text}
          </Text>
        ) : (
          seg.text
        ),
      )}
    </Text>
  )
}

export const stripBulletMarker = (t: string) => t.replace(/^[-•]\s*/, '')

// Renders one content section by id (built-in or custom) in the given style set.
export function renderSection(
  cv: CvData,
  accent: string,
  s: SectionStyles,
  id: string,
  fonts: RichFonts = DEFAULT_RICH_FONTS,
): ReactElement | null {
  const linkStyle: Style = { color: accent, textDecoration: 'underline' }
  switch (id) {
    case 'summary':
      return cv.summary ? <Text style={s.summary}>{cv.summary}</Text> : null

    case 'skills': {
      const groups = cv.skillGroups?.filter((g) => g.skills.some((x) => x.trim()))
      const hasSkills = cv.skills.length > 0 || (groups?.length ?? 0) > 0
      if (!hasSkills) return null
      return (
        <>
          <Text style={[s.section, { color: accent }]}>{labelOf(cv, 'skills', 'Skills')}</Text>
          {cv.skills.length > 0 && <Text style={s.skillRow}>{cv.skills.join(', ')}</Text>}
          {groups?.map((g, i) => (
            <Fragment key={i}>
              {g.name.trim() && (
                <Text style={[s.skillGroup, { color: accent }]}>{g.name}</Text>
              )}
              <Text style={s.skillRow}>{g.skills.join(', ')}</Text>
            </Fragment>
          ))}
        </>
      )
    }

    case 'work':
      return cv.work.length > 0 ? (
        <>
          <Text style={[s.section, { color: accent }]}>{labelOf(cv, 'work', 'Work Experience')}</Text>
          {cv.work.flatMap((w, i) => [
            <Text key={`t${i}`} style={s.entryTitle}>
              {w.role} — {w.company}
            </Text>,
            <Text key={`m${i}`} style={s.entryMeta}>
              {w.start} – {w.end} · {w.location}
            </Text>,
            ...w.bullets.map((b, j) => (
              <RichText
                key={`b${i}-${j}`}
                text={`• ${b}`}
                style={[s.bullet, ...(j === w.bullets.length - 1 ? [s.entryEnd] : [])]}
                fonts={fonts}
                linkStyle={linkStyle}
              />
            )),
          ])}
        </>
      ) : null

    case 'education':
      return cv.education.length > 0 ? (
        <>
          <Text style={[s.section, { color: accent }]}>{labelOf(cv, 'education', 'Education')}</Text>
          {cv.education.flatMap((e, i) => [
            <Text key={`t${i}`} style={s.entryTitle}>
              {e.degree}
            </Text>,
            <Text key={`m${i}`} style={[s.entryMeta, ...(!e.details ? [s.entryEnd] : [])]}>
              {e.institution} · {e.location} · {e.start} – {e.end}
            </Text>,
            ...(e.details
              ? [
                  <RichText key={`d${i}`} text={e.details} style={[s.summary, s.entryEnd]} fonts={fonts} linkStyle={linkStyle} />,
                ]
              : []),
          ])}
        </>
      ) : null

    case 'languages':
      return cv.languages.length > 0 ? (
        <>
          <Text style={[s.section, { color: accent }]}>{labelOf(cv, 'languages', 'Languages')}</Text>
          {cv.languages.map((l, i) => (
            <Text key={i} style={s.skillRow}>
              {l.name} — {l.level}
            </Text>
          ))}
        </>
      ) : null

    case 'certifications':
      return cv.certifications.length > 0 ? (
        <>
          <Text style={[s.section, { color: accent }]}>{labelOf(cv, 'certifications', 'Certifications')}</Text>
          {cv.certifications.map((c, i) => (
            <Text key={i} style={s.skillRow}>
              {c.name} — {c.issuer} ({c.year})
            </Text>
          ))}
        </>
      ) : null

    default: {
      const cs = cv.customSections.find((x) => x.id === id)
      if (!cs || !cs.title.trim()) return null
      const items = cs.items.filter((it) => it.trim().length > 0)
      if (items.length === 0) return null
      const last = items.length - 1
      return (
        <>
          <Text style={[s.section, { color: accent }]}>{cs.title}</Text>
          {cs.style === 'line' && <RichText text={items.join(', ')} style={s.skillRow} fonts={fonts} linkStyle={linkStyle} />}
          {cs.style === 'paragraph' &&
            items.map((item, i) => {
              const t = item.trim()
              const isBullet = t.startsWith('- ') || t.startsWith('• ')
              return isBullet ? (
                <RichText
                  key={i}
                  text={`• ${stripBulletMarker(t)}`}
                  style={[s.bullet, ...(i === last ? [s.entryEnd] : [])]}
                  fonts={fonts}
                  linkStyle={linkStyle}
                />
              ) : (
                <RichText
                  key={i}
                  text={t}
                  style={[s.summary, ...(i === last ? [s.entryEnd] : [])]}
                  fonts={fonts}
                  linkStyle={linkStyle}
                />
              )
            })}
          {cs.style === 'bullets' &&
            items.map((item, i) => (
              <RichText
                key={i}
                text={`• ${stripBulletMarker(item.trim())}`}
                style={[s.bullet, ...(i === last ? [s.entryEnd] : [])]}
                fonts={fonts}
                linkStyle={linkStyle}
              />
            ))}
        </>
      )
    }
  }
}
