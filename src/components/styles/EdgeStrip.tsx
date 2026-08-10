// CV style: "EdgeStrip" — accent strip down the left edge, photo right in header
import { useMemo } from 'react'
import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_ACCENT } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { applyFontSizes, ContactBlock, renderSection } from './sections'

const makeStyles = (accent: string, accent2: string) =>
  StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      lineHeight: 1.5,
      color: '#222',
      paddingTop: 46,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    layout: { flexDirection: 'row' },
    strip: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: -46, // reach the physical page bottom below the top padding
      width: 16,
      backgroundColor: accent,
    },
    content: { flex: 1, marginLeft: 16, paddingLeft: 40, paddingRight: 46, paddingTop: 0, paddingBottom: 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    nameBlock: { flex: 1, paddingRight: 16 },
    name: { fontFamily: 'Helvetica-Bold', fontSize: 25, color: '#111', marginBottom: 14 },
    rule: { height: 2.5, width: '100%', backgroundColor: accent2, marginBottom: 10 },
    headline: { fontSize: 11.5, color: '#445', marginBottom: 5 },
    contact: { fontSize: 9, color: '#667' },
    photo: { width: 66, height: 83, borderRadius: 4 },
    section: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 11,
      color: accent,
      textTransform: 'uppercase',
      marginTop: 18,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#dde3e8',
      paddingBottom: 3,
    },
    summary: { fontSize: 10, color: '#333', marginBottom: 4 },
    entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
    entryMeta: { fontSize: 9, color: '#555', marginBottom: 5 },
    bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
    entryEnd: { marginBottom: 14 },
skillGroup: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginTop: 6, marginBottom: 2 },
    skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
  })

export const EdgeStrip: CvStyleComponent = ({ cv, backupString }) => {
  const accent = cv.accent || DEFAULT_ACCENT
  const accent2 = cv.accent2 || accent
  const styles = useMemo(
    () => applyFontSizes(makeStyles(accent, accent2), cv.fontSizes),
    [accent, accent2, cv.fontSizes],
  )
  return (
    <Document keywords={backupString}>
      <Page size="A4" style={styles.page}>
        <View style={styles.strip} />
        <View style={styles.layout}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameBlock}>
                <Text style={styles.name}>{cv.profile.fullName}</Text>
                <View style={styles.rule} />
                <Text style={styles.headline}>{cv.profile.headline}</Text>
                <ContactBlock cv={cv} style={styles.contact} />
              </View>
              {cv.profile.photo && <Image src={cv.profile.photo} style={styles.photo} />}
            </View>
            {cv.sectionOrder.map((id) => renderSection(cv, accent, styles, id))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
