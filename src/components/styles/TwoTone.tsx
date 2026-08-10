// MOCKUP DESIGN: "TwoTone" — full-width accent band header, navy
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { renderSection } from './sections'

const ACCENT = '#1e3a5f'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 0, color: '#222' },
  band: {
    backgroundColor: ACCENT,
    paddingHorizontal: 48,
    paddingTop: 34,
    paddingBottom: 30,
    marginBottom: 6,
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 26, color: '#ffffff', marginBottom: 5 },
  headline: { fontSize: 12, color: '#dce6f0', marginBottom: 7 },
  contact: { fontSize: 9, color: '#a9c0d8' },
  body: { paddingHorizontal: 48, paddingTop: 6 },
  section: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: ACCENT,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe2ea',
    paddingBottom: 3,
  },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10, marginLeft: 16, marginBottom: 3.5, color: '#333' },
  entryEnd: { marginBottom: 14 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
})

const joinContact = (p: CvData['profile']) =>
  [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join('  ·  ')

export const TwoTone: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.band}>
        <Text style={styles.name}>{cv.profile.fullName}</Text>
        <Text style={styles.headline}>{cv.profile.headline}</Text>
        <Text style={styles.contact}>{joinContact(cv.profile)}</Text>
      </View>
      <View style={styles.body}>
        {cv.sectionOrder.map((id) => renderSection(cv, ACCENT, styles, id))}
      </View>
    </Page>
  </Document>
)
