// CV style: "Sidebar" — light rail with contact/skills, main column (2-col)
//
// ATS safety: PDF text extraction follows the JSX tree order, so the tree is
// ordered name/contact -> main content -> skills/languages (the ideal CV
// reading order). Visually the rail stays left because every rail block is
// absolutely positioned; the rail background is a separate text-less layer.
import type { ReactNode } from 'react'
import { Fragment, useMemo } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_ACCENT } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { applyFontSizes, contactItems, labelOf, RichText, stripBulletMarker } from './sections'

const RAIL_BG = '#eef1f4'

const makeStyles = (accent: string, accent2: string, bg: string, nameBlockH: number, text?: string) =>
  StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      lineHeight: 1.5,
      color: '#222',
      paddingTop: 24,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    main: { marginLeft: '32%', paddingLeft: 24, paddingRight: 24, paddingTop: 0, paddingBottom: 0 },
    nameBlock: { position: 'absolute', left: 20, top: 20, width: '32%', paddingRight: 40 },
    railContent: {
      position: 'absolute',
      left: 20,
      top: nameBlockH,
      width: '32%',
      paddingRight: 40,
    },
    railBg: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: -24, // reach the physical page bottom below the top padding
      width: '32%',
      backgroundColor: bg,
    },
    name: { fontFamily: 'Helvetica-Bold', fontSize: 17, color: text ?? '#1a1a1a', marginBottom: 5 },
    headline: { fontSize: 9.5, color: accent, marginBottom: 6 },
    contactLine: { fontSize: 8.5, color: text ?? '#555', marginBottom: 2.5 },
    railSection: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 9.5,
      color: text ?? '#333',
      textTransform: 'uppercase',
      marginTop: 16,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: accent2,
      paddingBottom: 3,
    },
    railSkill: { fontSize: 8.6, color: text ?? '#444', marginBottom: 2 },
    railSkillGroup: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 8.8,
      color: text ?? '#333',
      marginTop: 6,
      marginBottom: 2,
    },
    section: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 11,
      color: '#1a1a1a',
      textTransform: 'uppercase',
      marginTop: 16,
      marginBottom: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
      paddingBottom: 3,
    },
    summary: { fontSize: 10, color: '#333', marginBottom: 4 },
    entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
    entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
    bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.2, color: '#333' },
    entryEnd: { marginBottom: 12 },
skillGroup: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginTop: 6, marginBottom: 2 },
    skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
  })

function RailSection({
  title,
  children,
  s,
}: {
  title: string
  children: ReactNode
  s: ReturnType<typeof makeStyles>
}) {
  return (
    <>
      <Text style={s.railSection}>{title}</Text>
      {children}
    </>
  )
}

export const Sidebar: CvStyleComponent = ({ cv, backupString }) => {
  const accent = cv.accent || DEFAULT_ACCENT
  const accent2 = cv.accent2 || accent
  const sidebarBg = cv.sidebarBg || RAIL_BG
  const nameFs = cv.fontSizes?.name ?? 17
  const headFs = cv.fontSizes?.headline ?? 9.5
  const metaFs = cv.fontSizes?.meta ?? 8.5
  // Conservative estimate of the name block height (name + headline + contact
  // lines, wraps included) so the skills block starts below it. Overestimating
  // leaves a small gap; underestimating would overlap.
  const lineH = (fs: number) => fs * 1.8
  const wrapLines = (t: string) => Math.max(1, Math.ceil(t.length / 32))
  const nameBlockH =
    lineH(nameFs) +
    5 +
    lineH(headFs) +
    6 +
    contactItems(cv).reduce((acc, c) => acc + wrapLines(c.value) * (lineH(metaFs) + 2.5), 0)
  const styles = useMemo(
    () => applyFontSizes(makeStyles(accent, accent2, sidebarBg, nameBlockH, cv.sidebarText), cv.fontSizes),
    [accent, accent2, sidebarBg, nameBlockH, cv.sidebarText, cv.fontSizes],
  )
  return (
    <Document keywords={backupString}>
      <Page size="A4" style={styles.page}>
        {/* rail background — text-less, first child so it paints UNDER the rail text */}
        <View style={styles.railBg} />

        {/* rail: name + contact — extracted first (ATS reads name/contact first) */}
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{cv.profile.fullName}</Text>
          <Text style={styles.headline}>{cv.profile.headline}</Text>
          {contactItems(cv).map((it, i) => (
            <Text key={i} style={styles.contactLine}>
              {cv.contactTypes ? `${it.type}: ${it.value}` : it.value}
            </Text>
          ))}
        </View>

        {/* main column — extracted second */}
        <View style={styles.main}>
          {cv.summary && <Text style={styles.summary}>{cv.summary}</Text>}

          {cv.work.length > 0 && (
            <>
              <Text style={styles.section}>{labelOf(cv, 'work', 'Work Experience')}</Text>
              {cv.work.flatMap((w, i) => [
                <Text key={`t${i}`} style={styles.entryTitle}>
                  {w.role} — {w.company}
                </Text>,
                <Text key={`m${i}`} style={styles.entryMeta}>
                  {w.start} – {w.end} · {w.location}
                </Text>,
                ...w.bullets.map((b, j) => (
                  <RichText
                    key={`b${i}-${j}`}
                    text={`• ${b}`}
                    style={[styles.bullet, ...(j === w.bullets.length - 1 ? [styles.entryEnd] : [])]}
                    linkStyle={{ color: accent, textDecoration: 'underline' }}
                  />
                )),
              ])}
            </>
          )}

          {cv.education.length > 0 && (
            <>
              <Text style={styles.section}>{labelOf(cv, 'education', 'Education')}</Text>
              {cv.education.flatMap((e, i) => [
                <Text key={`t${i}`} style={styles.entryTitle}>
                  {e.degree}
                </Text>,
                <Text key={`m${i}`} style={[styles.entryMeta, ...(!e.details ? [styles.entryEnd] : [])]}>
                  {e.institution} · {e.location} · {e.start} – {e.end}
                </Text>,
                ...(e.details
                  ? [
                      <RichText
                        key={`d${i}`}
                        text={e.details}
                        style={[styles.summary, styles.entryEnd]}
                        linkStyle={{ color: accent, textDecoration: 'underline' }}
                      />,
                    ]
                  : []),
              ])}
            </>
          )}

          {cv.customSections
            .filter((cs) => cv.sectionOrder.includes(cs.id) && cs.items.length > 0)
            .map((cs) => (
              <View key={cs.id}>
                <Text style={styles.section}>{cs.title}</Text>
                {cs.items.map((item, i) => (
                  <RichText
                    key={i}
                    text={`• ${stripBulletMarker(item)}`}
                    style={styles.skillRow}
                    linkStyle={{ color: accent, textDecoration: 'underline' }}
                  />
                ))}
              </View>
            ))}
        </View>

        {/* rail: skills + languages — extracted last */}
        <View style={styles.railContent}>
          {(cv.skills.length > 0 || (cv.skillGroups?.length ?? 0) > 0) && (
            <RailSection title={labelOf(cv, 'skills', 'Skills')} s={styles}>
              {cv.skills.map((s, i) => (
                <Text key={i} style={styles.railSkill}>
                  • {s}
                </Text>
              ))}
              {cv.skillGroups
                ?.filter((g) => g.skills.some((x) => x.trim()))
                .map((g, gi) => (
                  <Fragment key={gi}>
                    {g.name.trim() && <Text style={styles.railSkillGroup}>{g.name}</Text>}
                    {g.skills.map((sk, i) => (
                      <Text key={i} style={styles.railSkill}>
                        • {sk}
                      </Text>
                    ))}
                  </Fragment>
                ))}
            </RailSection>
          )}

          {cv.languages.length > 0 && (
            <RailSection title={labelOf(cv, 'languages', 'Languages')} s={styles}>
              {cv.languages.map((l, i) => (
                <Text key={i} style={styles.railSkill}>
                  {l.name} — {l.level}
                </Text>
              ))}
            </RailSection>
          )}
        </View>
      </Page>
    </Document>
  )
}
