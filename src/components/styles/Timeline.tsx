// MOCKUP DESIGN: "Timeline" — date gutter with hairline, slate + teal
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'

const SLATE = '#243b53'
const TEAL = '#0d9488'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 46, color: '#222' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 24, color: SLATE, marginBottom: 7 },
  rule: { height: 2.5, width: 46, backgroundColor: TEAL, marginBottom: 10 },
  headline: { fontSize: 11.5, color: '#445', marginBottom: 5 },
  contact: { fontSize: 9, color: '#667', marginBottom: 4 },
  section: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: SLATE,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7dd',
    paddingBottom: 4,
  },
  entryRow: { flexDirection: 'row', marginBottom: 12 },
  dateCol: { width: 108, paddingRight: 12, borderRightWidth: 0.5, borderRightColor: '#d0d7dd' },
  date: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: TEAL, marginTop: 2 },
  content: { flex: 1, paddingLeft: 14 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
})

const joinContact = (p: CvData['profile']) =>
  [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join('  ·  ')

function TimelineEntries({ entries }: { entries: { title: string; meta: string; bullets: string[] }[] }) {
  return (
    <>
      {entries.map((e, i) => (
        <View key={i} style={styles.entryRow} wrap={false}>
          <View style={styles.dateCol}>
            <Text style={styles.date}>{e.meta}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.entryTitle}>{e.title}</Text>
            {e.bullets.map((b, j) => (
              <Text key={j} style={styles.bullet}>
                • {b}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </>
  )
}

export const Timeline: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <Text style={styles.name}>{cv.profile.fullName}</Text>
      <View style={styles.rule} />
      <Text style={styles.headline}>{cv.profile.headline}</Text>
      <Text style={styles.contact}>{joinContact(cv.profile)}</Text>

      {cv.summary && (
        <>
          <Text style={styles.section}>About</Text>
          <Text style={styles.summary}>{cv.summary}</Text>
        </>
      )}

      {cv.work.length > 0 && (
        <>
          <Text style={styles.section}>Work Experience</Text>
          <TimelineEntries
            entries={cv.work.map((w) => ({
              title: `${w.role} — ${w.company}`,
              meta: `${w.start} – ${w.end}`,
              bullets: w.bullets,
            }))}
          />
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
          <TimelineEntries
            entries={cv.education.map((e) => ({
              title: e.degree,
              meta: `${e.start} – ${e.end}`,
              bullets: e.details ? [e.details] : [],
            }))}
          />
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
