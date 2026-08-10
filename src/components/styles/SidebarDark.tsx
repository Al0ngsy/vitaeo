// MOCKUP DESIGN: "SidebarDark" — dark charcoal rail, amber accent (D variant)
import type { ReactNode } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvStyleComponent } from './types'

const ACCENT = '#f59e0b'
const RAIL_BG = '#1e2632'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 0, color: '#222' },
  columns: { flexDirection: 'row', minHeight: '100%' },
  rail: { width: '32%', backgroundColor: RAIL_BG, padding: 22 },
  main: { flex: 1, padding: 26 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 17, color: '#ffffff', marginBottom: 5 },
  headline: { fontSize: 9.5, color: ACCENT, marginBottom: 6 },
  contactLine: { fontSize: 8.5, color: '#a8b3c5', marginBottom: 3 },
  railSection: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#ffffff',
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4657',
    paddingBottom: 3,
  },
  railSkill: { fontSize: 8.8, color: '#c3ccda', marginBottom: 2.5 },
  section: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT,
    paddingBottom: 3,
  },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
  entryEnd: { marginBottom: 13 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
})

function RailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Text style={styles.railSection}>{title}</Text>
      {children}
    </>
  )
}

export const SidebarDark: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.columns}>
        <View style={styles.rail}>
          <Text style={styles.name}>{cv.profile.fullName}</Text>
          <Text style={styles.headline}>{cv.profile.headline}</Text>
          {cv.profile.email && <Text style={styles.contactLine}>{cv.profile.email}</Text>}
          {cv.profile.phone && <Text style={styles.contactLine}>{cv.profile.phone}</Text>}
          {cv.profile.location && <Text style={styles.contactLine}>{cv.profile.location}</Text>}
          {cv.profile.website && <Text style={styles.contactLine}>{cv.profile.website}</Text>}
          {cv.profile.linkedin && <Text style={styles.contactLine}>{cv.profile.linkedin}</Text>}
          {cv.profile.github && <Text style={styles.contactLine}>{cv.profile.github}</Text>}

          {cv.skills.length > 0 && (
            <RailSection title="Skills">
              {cv.skills.map((s, i) => (
                <Text key={i} style={styles.railSkill}>
                  • {s}
                </Text>
              ))}
            </RailSection>
          )}

          {cv.languages.length > 0 && (
            <RailSection title="Languages">
              {cv.languages.map((l, i) => (
                <Text key={i} style={styles.railSkill}>
                  {l.name} — {l.level}
                </Text>
              ))}
            </RailSection>
          )}
        </View>

        <View style={styles.main}>
          {cv.summary && <Text style={styles.summary}>{cv.summary}</Text>}

          {cv.work.length > 0 && (
            <>
              <Text style={styles.section}>Work Experience</Text>
              {cv.work.flatMap((w, i) => [
                <Text key={`t${i}`} style={styles.entryTitle}>
                  {w.role} — {w.company}
                </Text>,
                <Text key={`m${i}`} style={styles.entryMeta}>
                  {w.start} – {w.end} · {w.location}
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

          {cv.education.length > 0 && (
            <>
              <Text style={styles.section}>Education</Text>
              {cv.education.flatMap((e, i) => [
                <Text key={`t${i}`} style={styles.entryTitle}>
                  {e.degree}
                </Text>,
                <Text key={`m${i}`} style={styles.entryMeta}>
                  {e.institution} · {e.location} · {e.start} – {e.end}
                </Text>,
              ])}
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
        </View>
      </View>
    </Page>
  </Document>
)
