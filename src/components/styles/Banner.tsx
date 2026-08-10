// MOCKUP DESIGN: "Banner" — section headings as full-width tinted strips
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { renderSection } from './sections'

const ACCENT = '#334155'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 46, color: '#222' },
  header: { marginBottom: 18 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 24, color: '#111', marginBottom: 4 },
  headline: { fontSize: 11.5, color: '#556', marginBottom: 4 },
  contact: { fontSize: 9, color: '#778' },
  section: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: ACCENT,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
    backgroundColor: '#eef1f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
  entryEnd: { marginBottom: 14 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
})

const joinContact = (p: CvData['profile']) =>
  [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join('  ·  ')

export const Banner: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{cv.profile.fullName}</Text>
        <Text style={styles.headline}>{cv.profile.headline}</Text>
        <Text style={styles.contact}>{joinContact(cv.profile)}</Text>
      </View>
      {cv.sectionOrder.map((id) => renderSection(cv, ACCENT, styles, id))}
    </Page>
  </Document>
)
