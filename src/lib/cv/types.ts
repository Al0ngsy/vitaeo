export interface WorkEntry {
  role: string
  company: string
  location: string
  start: string // 'YYYY-MM' or 'YYYY'
  end: string // 'YYYY-MM', 'YYYY', or 'Present'
  bullets: string[]
}

export interface EducationEntry {
  degree: string
  institution: string
  location: string
  start: string
  end: string
  details?: string
}

export interface LanguageEntry {
  name: string
  level: string // e.g. 'C2'
}

export interface CertificationEntry {
  name: string
  issuer: string
  year: string
}

export type SectionStyle = 'bullets' | 'line' | 'paragraph'

export interface FontSizes {
  name?: number // header name
  headline?: number
  section?: number // section headings
  title?: number // entry titles
  body?: number // bullets / summary / skills
  meta?: number // dates, company line, contact
}

export const FONT_SIZE_FIELDS: { key: keyof FontSizes; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'headline', label: 'Headline' },
  { key: 'section', label: 'Section headings' },
  { key: 'title', label: 'Entry titles' },
  { key: 'body', label: 'Body text' },
  { key: 'meta', label: 'Meta / dates' },
]

export interface CustomSection {
  id: string // 'custom-<uuid>'
  title: string
  style: SectionStyle
  items: string[]
}

export interface SkillGroup {
  name: string // user-defined subsection label, e.g. 'Frameworks'
  skills: string[]
}

export interface CustomContact {
  type: string // label shown before the value, e.g. 'Discord', 'Mastodon'
  value: string
}

// Overrides for auto-generated PDF strings (section headings, contact type
// labels) — e.g. German labels. Empty/missing = English default.
export interface CvLabels {
  work?: string
  education?: string
  skills?: string
  languages?: string
  certifications?: string
  profile?: string // 'Profile' heading (ProClassic)
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
}

export const LABEL_FIELDS: { key: keyof CvLabels; label: string; fallback: string }[] = [
  { key: 'work', label: 'Work experience', fallback: 'Work Experience' },
  { key: 'education', label: 'Education', fallback: 'Education' },
  { key: 'skills', label: 'Skills', fallback: 'Skills' },
  { key: 'languages', label: 'Languages', fallback: 'Languages' },
  { key: 'certifications', label: 'Certifications', fallback: 'Certifications' },
  { key: 'profile', label: 'Profile / summary', fallback: 'Profile' },
  { key: 'email', label: 'Email', fallback: 'Email' },
  { key: 'phone', label: 'Phone', fallback: 'Phone' },
  { key: 'location', label: 'Location', fallback: 'Location' },
  { key: 'website', label: 'Website', fallback: 'Website' },
  { key: 'linkedin', label: 'LinkedIn', fallback: 'LinkedIn' },
  { key: 'github', label: 'GitHub', fallback: 'GitHub' },
]

// Built-in label translations; 'en' = empty (English defaults are the fallbacks).
// Manual CvData.labels overrides always win over these.
// ponytail: only Latin-1-safe languages here — PDFKit's base-14 Helvetica
// cannot encode e.g. Vietnamese diacritics. Add an embedded Unicode font
// (Font.register + ttf) before adding scripts beyond Latin-1.
export const LABEL_LANGS: Record<string, CvLabels> = {
  en: {},
  de: {
    work: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Kenntnisse',
    languages: 'Sprachen',
    certifications: 'Zertifikate',
    profile: 'Profil',
    email: 'E-Mail',
    phone: 'Telefon',
    location: 'Standort',
    website: 'Webseite',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  fr: {
    work: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    certifications: 'Certifications',
    profile: 'Profil',
    email: 'E-mail',
    phone: 'Téléphone',
    location: 'Localisation',
    website: 'Site web',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  es: {
    work: 'Experiencia laboral',
    education: 'Formación',
    skills: 'Habilidades',
    languages: 'Idiomas',
    certifications: 'Certificaciones',
    profile: 'Perfil',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    location: 'Ubicación',
    website: 'Sitio web',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  it: {
    work: 'Esperienza lavorativa',
    education: 'Istruzione',
    skills: 'Competenze',
    languages: 'Lingue',
    certifications: 'Certificazioni',
    profile: 'Profilo',
    email: 'Email',
    phone: 'Telefono',
    location: 'Posizione',
    website: 'Sito web',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  nl: {
    work: 'Werkervaring',
    education: 'Opleiding',
    skills: 'Vaardigheden',
    languages: 'Talen',
    certifications: 'Certificeringen',
    profile: 'Profiel',
    email: 'E-mail',
    phone: 'Telefoon',
    location: 'Locatie',
    website: 'Website',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  pt: {
    work: 'Experiência profissional',
    education: 'Formação',
    skills: 'Competências',
    languages: 'Idiomas',
    certifications: 'Certificações',
    profile: 'Perfil',
    email: 'E-mail',
    phone: 'Telefone',
    location: 'Localização',
    website: 'Site',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
}

export const LABEL_LANG_OPTIONS: { id: string; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'de', name: 'Deutsch' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
  { id: 'it', name: 'Italiano' },
  { id: 'nl', name: 'Nederlands' },
  { id: 'pt', name: 'Português' },
]

export interface CvData {
  schema: 1
  accent: string // hex color, e.g. '#1a4f8b' — primary accent (headings, main elements)
  accent2?: string // optional hex — secondary accent; absent = inactive (styles fall back to accent)
  sidebarBg?: string // Sidebar template: rail background; absent = default light gray
  sidebarText?: string // Sidebar template: rail text color; absent = style defaults
  fontSizes?: FontSizes // optional per-component font size overrides (pt); absent = style defaults
  contactLayout?: 'inline' | 'separate' | 'lanes' // how contact info renders in inline-header templates; absent = inline
  contactSeparator?: string // separator used when contactLayout is inline; absent = style default
  contactTypes?: boolean // prefix each contact with its type label ('Email: ...'); absent = bare values
  labels?: CvLabels // per-field overrides for auto-generated PDF strings (headings, contact types)
  labelLang?: string // language id from LABEL_LANGS; auto-translates labels (manual labels win)
  sectionOrder: string[] // content section ids in display order (profile/header is always first)
  profile: {
    fullName: string
    headline: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
    photo?: string // dataURL (resized JPEG)
  }
  summary: string
  skills: string[]
  skillGroups?: SkillGroup[] // optional user-named subsections, rendered after the flat list
  customContacts?: CustomContact[] // user-defined contact fields (type + value), rendered after the built-ins
  work: WorkEntry[]
  education: EducationEntry[]
  languages: LanguageEntry[]
  certifications: CertificationEntry[]
  customSections: CustomSection[]
}

export const DEFAULT_ACCENT = '#1a4f8b'

export const BUILTIN_SECTION_IDS = [
  'summary',
  'skills',
  'work',
  'education',
  'languages',
  'certifications',
] as const

export const EMPTY_CV: CvData = {
  schema: 1,
  accent: DEFAULT_ACCENT,
  sectionOrder: [...BUILTIN_SECTION_IDS],
  profile: { fullName: '', headline: '', email: '', phone: '', location: '' },
  summary: '',
  skills: [],
  work: [],
  education: [],
  languages: [],
  certifications: [],
  customSections: [],
}
