// UI language: auto-detected from the browser on first visit, persisted once
// the user picks a language manually (localStorage 'vitaeo:uiLang').
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export const UI_LANGS = ['en', 'de'] as const
export type UiLang = (typeof UI_LANGS)[number]

const LS_UI_LANG = 'vitaeo:uiLang'

export const UI_STRINGS: Record<UiLang, Record<string, string>> = {
  en: {
    tagline: 'ATS-safe CV builder',
    passphrase: 'Passphrase (optional)',
    passphraseTooltip: 'Locks the backup string and PDF with encryption. Forgotten passphrase = data unrecoverable.',
    import: 'Import',
    export: 'Export',
    copied: 'Copied ✓',
    helpTooltip: 'How export, import & the passphrase work',
    helpTitle: 'Backup & restore',
    helpExport:
      'Export copies your whole CV as a single encoded string (clipboard). Import accepts that string — or a previously downloaded PDF, which carries the same data embedded in its metadata.',
    helpPassphrase:
      'Passphrase: with one set, export & PDF backups are encrypted (AES-256-GCM). The same passphrase is required to import them again. It is never stored — a forgotten passphrase means the backup cannot be recovered.',
    helpLocal: 'Your data stays in this browser (local autosave). No server, no account.',
    footerLine: '© {year} Lê Quốc Anh Trần · Vitaeo — free ATS-safe CV builder · no account, no server, no tracking',
    impressum: 'Impressum',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    backToEditor: 'Back to the editor',
    importTitle: 'Import CV data',
    pasteTab: 'Paste string',
    uploadTab: 'Upload PDF',
    backupString: 'Backup string',
    load: 'Load',
    atsViewTitle: 'ATS view — text extracted from your PDF',
    close: 'Close',
    sampleData: 'Sample data',
    sampleAlien: 'Sample (Zorblax Q\'xalax)',
    sampleLorem: 'Lorem ipsum',
    sampleBlank: 'Blank state',
    sampleConfirm: 'Replace the current CV with this sample? Your current data will be overwritten.',
    uiLanguage: 'Language',
    uiAuto: 'Auto (browser)',
    // quick-nav + section titles
    profile: 'Profile',
    appearance: 'Appearance',
    summary: 'Summary',
    work: 'Experience',
    skills: 'Skills',
    education: 'Education',
    languages: 'Languages',
    certifications: 'Certifications',
    addCustomSection: 'Add custom section',
    deleteSection: 'delete section',
    moveUp: 'move section up',
    moveDown: 'move section down',
    // profile fields
    fullName: 'Full name',
    headline: 'Headline',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    website: 'Website',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    photo: 'Photo',
    uploadPhoto: 'Upload photo',
    removePhoto: 'Remove',
    type: 'Type',
    value: 'Value',
    deleteField: 'delete contact field',
    addContactField: 'Add contact field',
    // appearance
    accentColors: 'Accent colors',
    primaryAccent: 'Primary accent — headings & main elements',
    secondaryAccent: 'Secondary accent (optional)',
    enableSecondaryAccent: 'Enable secondary accent',
    sidebarColors: 'Sidebar colors (Sidebar template)',
    sidebarBg: 'Sidebar background',
    sidebarText: 'Sidebar text',
    fontSizes: 'Font sizes (pt)',
    fontSizesHint: 'Leave empty to use the style\'s default size.',
    contactDisplay: 'Contact display',
    layout: 'Layout',
    inline: 'Inline',
    separate: 'Separate lines',
    lanes: 'Two lanes',
    separator: 'Separator',
    showTypeLabels: 'Show type labels (Email: …)',
    contactDisplayHint: 'Applies to Minimal, Classic, Big Type & Edge Strip (Sidebar / Pro Classic have their own layout)',
    labelsPdf: 'Labels (PDF language)',
    cvLanguage: 'CV language',
    labelsAuto: 'Auto-translates headings & contact types. Per-field overrides below win.',
    labelsHint: 'Overrides for the auto-generated section headings and contact types. Empty = default.',
    section: 'Section',
    aboutYouHint: '2–4 sentences. ATS keyword-rich.',
    skillPlaceholder: 'Type a skill and press Enter',
    bullets: 'Bullets (one per line)',
    sectionTitle: 'Section title',
    style: 'Style',
    items: 'Items (one per line)',
    thisSubsection: 'this subsection',
    // summary / work / education / languages / certifications
    aboutYou: 'About you',
    role: 'Role',
    company: 'Company',
    start: 'Start',
    end: 'End',
    entry: 'Entry {n}',
    deleteEntry: 'delete entry',
    degree: 'Degree',
    institution: 'Institution',
    details: 'Details (optional)',
    language: 'Language',
    level: 'Level',
    certName: 'Name',
    issuer: 'Issuer',
    year: 'Year',
    // skills
    skillsIn: 'Skills in "{group}"',
    subsectionName: 'Subsection name',
    addSubsection: 'Add subsection',
    deleteSubsection: 'delete subsection',
    // preview
    renderPdf: 'Render PDF',
    upToDate: 'Preview up to date',
    downloadPdf: 'Download PDF',
    atsView: 'ATS view',
    manual: 'Manual',
    live: 'Live',
  },
  de: {
    tagline: 'ATS-sicherer CV-Builder',
    passphrase: 'Passphrase (optional)',
    passphraseTooltip: 'Verschlüsselt Backup-String und PDF. Vergessene Passphrase = Daten unwiederbringlich verloren.',
    import: 'Importieren',
    export: 'Exportieren',
    copied: 'Kopiert ✓',
    helpTooltip: 'So funktionieren Export, Import & Passphrase',
    helpTitle: 'Backup & Wiederherstellung',
    helpExport:
      'Export kopiert deinen gesamten Lebenslauf als einen einzigen kodierten String (Zwischenablage). Import akzeptiert diesen String — oder ein zuvor heruntergeladenes PDF, das dieselben Daten eingebettet enthält.',
    helpPassphrase:
      'Passphrase: Wenn gesetzt, werden Export & PDF-Backups verschlüsselt (AES-256-GCM). Dieselbe Passphrase wird zum erneuten Import benötigt. Sie wird nie gespeichert — eine vergessene Passphrase bedeutet, dass das Backup nicht wiederhergestellt werden kann.',
    helpLocal: 'Deine Daten bleiben in diesem Browser (lokale Auto-Speicherung). Kein Server, kein Konto.',
    footerLine: '© {year} Lê Quốc Anh Trần · Vitaeo — kostenloser ATS-sicherer CV-Builder · kein Konto, kein Server, kein Tracking',
    impressum: 'Impressum',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    backToEditor: 'Zurück zum Editor',
    importTitle: 'CV-Daten importieren',
    pasteTab: 'String einfügen',
    uploadTab: 'PDF hochladen',
    backupString: 'Backup-String',
    load: 'Laden',
    atsViewTitle: 'ATS-Ansicht — aus dem PDF extrahierter Text',
    close: 'Schließen',
    sampleData: 'Beispieldaten',
    sampleAlien: 'Beispiel (Zorblax Q\'xalax)',
    sampleLorem: 'Lorem ipsum',
    sampleBlank: 'Leerer Zustand',
    sampleConfirm: 'Aktuellen Lebenslauf durch dieses Beispiel ersetzen? Deine aktuellen Daten werden überschrieben.',
    uiLanguage: 'Sprache',
    uiAuto: 'Auto (Browser)',
    profile: 'Profil',
    appearance: 'Darstellung',
    summary: 'Zusammenfassung',
    work: 'Berufserfahrung',
    skills: 'Kenntnisse',
    education: 'Ausbildung',
    languages: 'Sprachen',
    certifications: 'Zertifikate',
    addCustomSection: 'Eigene Sektion hinzufügen',
    deleteSection: 'Sektion löschen',
    moveUp: 'Sektion nach oben',
    moveDown: 'Sektion nach unten',
    fullName: 'Vollständiger Name',
    headline: 'Berufsbezeichnung',
    email: 'E-Mail',
    phone: 'Telefon',
    location: 'Standort',
    website: 'Webseite',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    photo: 'Foto',
    uploadPhoto: 'Foto hochladen',
    removePhoto: 'Entfernen',
    type: 'Typ',
    value: 'Wert',
    deleteField: 'Kontaktfeld löschen',
    addContactField: 'Kontaktfeld hinzufügen',
    accentColors: 'Akzentfarben',
    primaryAccent: 'Primärer Akzent — Überschriften & Hauptelemente',
    secondaryAccent: 'Sekundärer Akzent (optional)',
    enableSecondaryAccent: 'Sekundären Akzent aktivieren',
    sidebarColors: 'Sidebar-Farben (Sidebar-Vorlage)',
    sidebarBg: 'Sidebar-Hintergrund',
    sidebarText: 'Sidebar-Text',
    fontSizes: 'Schriftgrößen (pt)',
    fontSizesHint: 'Leer lassen, um die Standardgröße der Vorlage zu verwenden.',
    contactDisplay: 'Kontaktanzeige',
    layout: 'Layout',
    inline: 'In einer Zeile',
    separate: 'Einzeln untereinander',
    lanes: 'Zwei Spalten',
    separator: 'Trennzeichen',
    showTypeLabels: 'Typ-Labels anzeigen (E-Mail: …)',
    contactDisplayHint:
      'Gilt für Minimal, Classic, Big Type & Edge Strip (Sidebar / Pro Classic haben ein eigenes Layout)',
    labelsPdf: 'Labels (PDF-Sprache)',
    cvLanguage: 'CV-Sprache',
    labelsAuto: 'Übersetzt Überschriften & Kontakttypen automatisch. Einzelne Überschreibungen unten haben Vorrang.',
    labelsHint: 'Überschreibungen für automatisch erzeugte Abschnittsüberschriften und Kontakttypen. Leer = Standard.',
    section: 'Sektion',
    aboutYouHint: '2–4 Sätze, keyword-reich für ATS.',
    skillPlaceholder: 'Kenntnis eingeben und Enter drücken',
    bullets: 'Bullet-Punkte (eine pro Zeile)',
    sectionTitle: 'Titel der Sektion',
    style: 'Stil',
    items: 'Einträge (eine pro Zeile)',
    thisSubsection: 'diese Untergruppe',
    aboutYou: 'Über dich',
    role: 'Rolle',
    company: 'Firma',
    start: 'Beginn',
    end: 'Ende',
    entry: 'Eintrag {n}',
    deleteEntry: 'Eintrag löschen',
    degree: 'Abschluss',
    institution: 'Einrichtung',
    details: 'Details (optional)',
    language: 'Sprache',
    level: 'Niveau',
    certName: 'Name',
    issuer: 'Aussteller',
    year: 'Jahr',
    skillsIn: 'Kenntnisse in "{group}"',
    subsectionName: 'Name der Untergruppe',
    addSubsection: 'Untergruppe hinzufügen',
    deleteSubsection: 'Untergruppe löschen',
    renderPdf: 'PDF rendern',
    upToDate: 'Vorschau aktuell',
    downloadPdf: 'PDF herunterladen',
    atsView: 'ATS-Ansicht',
    manual: 'Manuell',
    live: 'Live',
  },
}

export function detectLang(): UiLang {
  const nav = (navigator.language || 'en').toLowerCase()
  for (const id of UI_LANGS) {
    if (nav === id || nav.startsWith(`${id}-`)) return id
  }
  return 'en'
}

interface UiLangCtx {
  lang: UiLang
  auto: boolean
  setLang: (l: UiLang | null) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<UiLangCtx>({
  lang: 'en',
  auto: true,
  setLang: () => {},
  t: (key) => key,
})

export function UiLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang | null>(() => {
    try {
      const stored = localStorage.getItem(LS_UI_LANG)
      return stored === 'en' || stored === 'de' ? stored : null
    } catch {
      return null
    }
  })
  const effective = lang ?? detectLang()
  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = UI_STRINGS[effective][key] ?? UI_STRINGS.en[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    }
    return s
  }
  const setLang = (l: UiLang | null) => {
    setLangState(l)
    try {
      if (l === null) localStorage.removeItem(LS_UI_LANG)
      else localStorage.setItem(LS_UI_LANG, l)
    } catch {
      // ignore storage errors
    }
  }
  return <Ctx.Provider value={{ lang: effective, auto: lang === null, setLang, t }}>{children}</Ctx.Provider>
}

export const useUiLang = () => useContext(Ctx)
