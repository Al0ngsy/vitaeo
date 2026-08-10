// CV style: "ProClassic" — split header, right-aligned dates on title lines
import { Fragment, useMemo } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_ACCENT } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { applyFontSizes, contactItems, labelOf, RichText, stripBulletMarker } from './sections'

const makeStyles = (accent: string, accent2: string) =>
  StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 48, color: '#222' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: accent2, paddingBottom: 14 },
    nameBlock: { flex: 1 },
    name: { fontFamily: 'Helvetica-Bold', fontSize: 26, color: '#1a1a1a', marginBottom: 14 },
    headline: { fontSize: 11.5, color: '#555', marginBottom: 2 },
    contact: { alignItems: 'flex-end' },
    contactLine: { fontSize: 8.5, color: '#666', marginBottom: 1.5 },
    section: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      color: accent,
      textTransform: 'uppercase',
      marginTop: 16,
      marginBottom: 7,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      paddingBottom: 3,
    },
    entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 1, color: '#1a1a1a', flex: 1, paddingRight: 8 },
    dates: { fontSize: 9, color: '#666' },
    entryMeta: { fontSize: 9, color: '#555', marginBottom: 4 },
    bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3, color: '#333' },
    entryEnd: { marginBottom: 11 },
    summary: { fontSize: 10, color: '#333', marginBottom: 4 },
skillGroup: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginTop: 6, marginBottom: 2 },
    skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
  })

export const ProClassic: CvStyleComponent = ({ cv, backupString }) => {
  const accent = cv.accent || DEFAULT_ACCENT
  const accent2 = cv.accent2 || accent
  const styles = useMemo(
    () => applyFontSizes(makeStyles(accent, accent2), cv.fontSizes),
    [accent, accent2, cv.fontSizes],
  )
  return (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{cv.profile.fullName}</Text>
          <Text style={styles.headline}>{cv.profile.headline}</Text>
        </View>
        <View style={styles.contact}>
          {contactItems(cv).map((it, i) => (
            <Text key={i} style={styles.contactLine}>
              {cv.contactTypes ? `${it.type}: ${it.value}` : it.value}
            </Text>
          ))}
        </View>
      </View>

      {cv.summary && (
        <>
          <Text style={styles.section}>{labelOf(cv, 'profile', 'Profile')}</Text>
          <Text style={styles.summary}>{cv.summary}</Text>
        </>
      )}

      {cv.work.length > 0 && (
        <>
          <Text style={styles.section}>{labelOf(cv, 'work', 'Work Experience')}</Text>
          {cv.work.flatMap((w, i) => [
            <View key={`h${i}`} style={styles.entryRow}>
              <Text style={styles.entryTitle}>{w.role}</Text>
              <Text style={styles.dates}>
                {w.start} – {w.end}
              </Text>
            </View>,
            <Text key={`m${i}`} style={styles.entryMeta}>
              {w.company} · {w.location}
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

      {(cv.skills.length > 0 || (cv.skillGroups?.length ?? 0) > 0) && (
        <>
          <Text style={styles.section}>{labelOf(cv, 'skills', 'Skills')}</Text>
          {cv.skills.length > 0 && <Text style={styles.skillRow}>{cv.skills.join(', ')}</Text>}
          {cv.skillGroups
            ?.filter((g) => g.skills.some((x) => x.trim()))
            .map((g, gi) => (
              <Fragment key={gi}>
                {g.name.trim() && <Text style={[styles.skillGroup, { color: accent }]}>{g.name}</Text>}
                <Text style={styles.skillRow}>{g.skills.join(', ')}</Text>
              </Fragment>
            ))}
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <Text style={styles.section}>{labelOf(cv, 'education', 'Education')}</Text>
          {cv.education.flatMap((e, i) => [
            <View key={`h${i}`} style={styles.entryRow}>
              <Text style={styles.entryTitle}>{e.degree}</Text>
              <Text style={styles.dates}>
                {e.start} – {e.end}
              </Text>
            </View>,
            <Text key={`m${i}`} style={[styles.entryMeta, ...(!e.details ? [styles.entryEnd] : [])]}>
              {e.institution} · {e.location}
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

      {cv.languages.length > 0 && (
        <>
          <Text style={styles.section}>{labelOf(cv, 'languages', 'Languages')}</Text>
          {cv.languages.map((l, i) => (
            <Text key={i} style={styles.skillRow}>
              {l.name} — {l.level}
            </Text>
          ))}
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
    </Page>
  </Document>
  )
}
