// MOCKUP DESIGN: "HeroBlock" — light hero band, accent-block section markers, single column
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { renderSection } from './sections'

const ACCENT = '#c2410c'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, padding: 0, color: '#222' },
  band: { backgroundColor: '#f2f4f7', paddingHorizontal: 48, paddingTop: 40, paddingBottom: 34, marginBottom: 8 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 28, color: '#111', marginBottom: 8 },
  rule: { height: 3, width: 56, backgroundColor: ACCENT, marginBottom: 12 },
  headline: { fontSize: 12, color: '#445', marginBottom: 6 },
  contact: { fontSize: 9, color: '#667' },
  body: { paddingHorizontal: 48, paddingTop: 8 },
  section: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#111',
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 9,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    paddingLeft: 10,
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

export const HeroBlock: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.band}>
        <Text style={styles.name}>{cv.profile.fullName}</Text>
        <View style={styles.rule} />
        <Text style={styles.headline}>{cv.profile.headline}</Text>
        <Text style={styles.contact}>{joinContact(cv.profile)}</Text>
      </View>
      <View style={styles.body}>
        {cv.sectionOrder.map((id) => renderSection(cv, ACCENT, styles, id))}
      </View>
    </Page>
  </Document>
)
