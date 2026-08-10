// CV style: "BigType" — oversized name, Courier micro-labels, type-driven
import { useMemo } from 'react'
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_ACCENT } from '../../lib/cv/types'
import type { CvStyleComponent } from './types'
import { applyFontSizes, ContactBlock, renderSection } from './sections'

const makeStyles = (accent: string, accent2: string) =>
  StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.55, padding: 52, color: '#222' },
    name: { fontFamily: 'Helvetica-Bold', fontSize: 34, color: '#111', marginBottom: 24 },
    headline: { fontSize: 11.5, color: accent2, marginBottom: 12 },
    contact: { fontSize: 8.8, color: '#888', marginBottom: 8 },
    section: {
      fontFamily: 'Courier-Bold',
      fontSize: 8.5,
      color: accent,
      textTransform: 'uppercase',
      marginTop: 20,
      marginBottom: 8,
    },
    summary: { fontSize: 10.2, color: '#333', marginBottom: 4 },
    entryTitle: { fontSize: 11.5, fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#1a1a1a' },
    entryMeta: { fontFamily: 'Courier', fontSize: 8.5, color: '#777', marginBottom: 6 },
    bullet: { fontSize: 10, marginLeft: 14, marginBottom: 3.5, color: '#333' },
    entryEnd: { marginBottom: 14 },
skillGroup: { fontFamily: 'Courier-Bold', fontSize: 8.5, marginTop: 6, marginBottom: 2 },
    skillRow: { fontSize: 10, marginBottom: 3.5, color: '#333' },
  })

export const BigType: CvStyleComponent = ({ cv, backupString }) => {
  const accent = cv.accent || DEFAULT_ACCENT
  const accent2 = cv.accent2 || accent
  const styles = useMemo(
    () => applyFontSizes(makeStyles(accent, accent2), cv.fontSizes),
    [accent, accent2, cv.fontSizes],
  )
  return (
    <Document keywords={backupString}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cv.profile.fullName}</Text>
        <Text style={styles.headline}>{cv.profile.headline}</Text>
        <ContactBlock cv={cv} style={styles.contact} defaultSeparator=" / " />
        {cv.sectionOrder.map((id) =>
          renderSection(cv, accent, styles, id, { bold: 'Courier-Bold', italic: 'Courier-Oblique' }),
        )}
      </Page>
    </Document>
  )
}
