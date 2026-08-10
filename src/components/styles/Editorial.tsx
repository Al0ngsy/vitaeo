// MOCKUP DESIGN: "Editorial" — serif newspaper feel, oxblood accent
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { renderSection } from './sections'

const ACCENT = '#8c1d18'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    lineHeight: 1.55,
    padding: 54,
    color: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
    paddingBottom: 16,
  },
  name: { fontFamily: 'Times-Bold', fontSize: 27, color: ACCENT, marginBottom: 6 },
  headline: { fontFamily: 'Times-Italic', fontSize: 12, color: '#444', marginBottom: 6 },
  contact: { fontSize: 9, color: '#666' },
  section: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: ACCENT,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d8cfc4',
    paddingBottom: 3,
  },
  summary: { fontSize: 10.5, color: '#2a2a2a', marginBottom: 4 },
  entryTitle: { fontFamily: 'Times-Bold', fontSize: 11.5, marginBottom: 2, color: '#1a1a1a' },
  entryMeta: { fontFamily: 'Times-Italic', fontSize: 10, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10.5, marginLeft: 16, marginBottom: 3.5, color: '#2a2a2a' },
  entryEnd: { marginBottom: 14 },
  skillRow: { fontSize: 10.5, marginBottom: 3.5, color: '#2a2a2a' },
})

const joinContact = (p: CvData['profile']) =>
  [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join('  ·  ')

export const Editorial: CvStyleComponent = ({ cv, backupString }) => (
  <Document keywords={backupString}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{cv.profile.fullName}</Text>
        <Text style={styles.headline}>{cv.profile.headline}</Text>
        <Text style={styles.contact}>{joinContact(cv.profile)}</Text>
      </View>
      {cv.sectionOrder.map((id) =>
        renderSection(cv, ACCENT, styles, id, { bold: 'Times-Bold', italic: 'Times-Italic' }),
      )}
    </Page>
  </Document>
)
