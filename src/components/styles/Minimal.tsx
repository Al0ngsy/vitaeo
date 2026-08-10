import { useMemo } from 'react'
import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_ACCENT } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { applyFontSizes, ContactBlock, renderSection } from './sections'

const BASE_STYLES = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    padding: 44,
    color: '#222',
  },
  header: { flexDirection: 'row', marginBottom: 4 },
  photo: { width: 78, height: 98, borderRadius: 4, marginRight: 20 },
  headerText: { flex: 1 },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  rule: { height: 2.5, backgroundColor: DEFAULT_ACCENT, width: '100%', marginBottom: 10 },
  headline: { fontSize: 11.5, color: '#444', marginBottom: 5 },
  contact: { fontSize: 9, color: '#666', marginBottom: 2 },
  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: DEFAULT_ACCENT,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 3,
  },
  summary: { fontSize: 10, color: '#333', marginBottom: 4 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
  bullet: { fontSize: 10, marginLeft: 16, marginBottom: 3.5, color: '#333' },
  entryEnd: { marginBottom: 14 }, // spacing between entries (entries are flat Texts so they can flow across pages)
skillGroup: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginTop: 6, marginBottom: 2 },
  skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
})

export const Minimal: CvStyleComponent = ({ cv, backupString }) => {
  const accent = cv.accent || DEFAULT_ACCENT
  const accent2 = cv.accent2 || accent
  const styles = useMemo(() => applyFontSizes(BASE_STYLES, cv.fontSizes), [cv.fontSizes])
  return (
    <Document keywords={backupString}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {cv.profile.photo && <Image src={cv.profile.photo} style={styles.photo} />}
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: accent }]}>{cv.profile.fullName}</Text>
            <View style={[styles.rule, { backgroundColor: accent2 }]} />
            <Text style={styles.headline}>{cv.profile.headline}</Text>
            <ContactBlock cv={cv} style={styles.contact} />
          </View>
        </View>

        {cv.sectionOrder.map((id) => renderSection(cv, accent, styles, id))}
      </Page>
    </Document>
  )
}
