// MOCKUP DESIGN: "Overline" — tiny caps labels above entries, deep amber, single column
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'

const ACCENT = '#b45309'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 50, color: '#222' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 26, color: '#1a1a1a', marginBottom: 4 },
  headline: { fontSize: 11.5, color: '#666', marginBottom: 4 },
  contact: { fontSize: 9, color: '#888', marginBottom: 6 },
  section: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#8a8a8a',
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  overline: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 1.5,
  },
  entryTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 3, color: '#1a1a1a' },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
  entryEnd: { marginBottom: 12 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
})

const joinContact = (p: CvData['profile']) =>
  [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join('  ·  ')

export const Overline: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <Text style={styles.name}>{cv.profile.fullName}</Text>
      <Text style={styles.headline}>{cv.profile.headline}</Text>
      <Text style={styles.contact}>{joinContact(cv.profile)}</Text>

      {cv.summary && (
        <>
          <Text style={styles.section}>Profile</Text>
          <Text style={styles.summary}>{cv.summary}</Text>
        </>
      )}

      {cv.work.length > 0 && (
        <>
          <Text style={styles.section}>Work Experience</Text>
          {cv.work.flatMap((w, i) => [
            <Text key={`o${i}`} style={styles.overline}>
              {[w.company, w.location, `${w.start} – ${w.end}`].filter(Boolean).join(' · ')}
            </Text>,
            <Text key={`t${i}`} style={styles.entryTitle}>
              {w.role}
            </Text>,
            ...w.bullets.map((b, j) => (
              <Text
                key={`b${i}-${j}`}
                style={[styles.bullet, ...(j === w.bullets.length - 1 ? [styles.entryEnd] : [])]}
              >
                • {b}
              </Text>
            )),
          ])}
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <Text style={styles.section}>Skills</Text>
          <Text style={styles.skillRow}>{cv.skills.join(', ')}</Text>
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <Text style={styles.section}>Education</Text>
          {cv.education.flatMap((e, i) => [
            <Text key={`o${i}`} style={styles.overline}>
              {[e.institution, e.location, `${e.start} – ${e.end}`].filter(Boolean).join(' · ')}
            </Text>,
            <Text key={`t${i}`} style={styles.entryTitle}>
              {e.degree}
            </Text>,
            ...(e.details ? [<Text key={`d${i}`} style={styles.summary}>{e.details}</Text>] : []),
          ])}
        </>
      )}

      {cv.languages.length > 0 && (
        <>
          <Text style={styles.section}>Languages</Text>
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
              <Text key={i} style={styles.skillRow}>
                • {item.replace(/^[-•]\s*/, '')}
              </Text>
            ))}
          </View>
        ))}
    </Page>
  </Document>
)
