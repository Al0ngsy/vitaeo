import type { CvData } from './types'

// Fictional demo data — keeps every section shape populated so all templates
// and the ATS view render representative content. Not a real person.
export const SAMPLE_CV: CvData = {
  schema: 1,
  accent: '#1a4f8b',
  sectionOrder: [
    'summary',
    'work',
    'skills',
    'education',
    'languages',
    'certifications',
    'custom-hobbies',
  ],
  profile: {
    fullName: "Zorblax Q'xalax",
    headline: 'Gravitational Systems Engineer',
    email: 'zorblax@reddust.example',
    phone: '+55 017 0042-1337',
    location: 'Valles Marineris, Mars',
    website: 'https://zorblax.mars/',
    linkedin: 'linkedin.com/in/zorblax',
    github: 'github.com/zorblax',
  },
  summary:
    'Gravitational Systems Engineer with eight Martian cycles of experience designing antigravity propulsion and terraforming infrastructure. Strong focus on plasma welding, atmospheric processing, and quantum communications, as well as the construction of high-capacity oxygen generation units for off-world habitats. Experienced in evolving large-scale settlement platforms with broad ownership across multiple engineering domains, including dust-storm prediction, rover telemetry, and solar array optimization. Additionally experienced in AI-assisted habitat automation using neural cores and machine learning pipelines.',
  skills: [
    'Antigravity Systems',
    'Plasma Welding',
    'Atmospheric Processing',
    'Dust Storm Prediction',
    'Quantum Communications',
    'Hydroponics',
    'Terraforming',
    'Oxygen Generation',
    'Rover Telemetry',
    'Solar Arrays',
    'Neural Cores',
    'Machine Learning',
    'Zero-G Construction',
    'Water Extraction',
  ],
  work: [
    {
      role: 'Senior Propulsion Engineer',
      company: 'Red Dust Dynamics',
      location: 'Olympus Mons, Mars',
      start: '2120-03',
      end: '2126-08',
      bullets: [
        'Designed and implemented an antigravity propulsion unit for inter-crater cargo shuttles using plasma thrusters and quantum stabilizers, including AI-assisted flight control and automated trajectory correction.',
        'Led the conversion of a legacy methane refinery into a fully automated oxygen generation plant after repeated dust-storm shutdowns affected habitat stability. Developed a solution with self-sealing ducts, atmospheric sensors, and performance optimizations, significantly reducing downtime and improving oxygen output.',
        'Contributed terraforming features to the Olympus Terraform platform, including atmospheric injection logic and remote sensor integration.',
        'Maintained and extended the crater-wide solar array network, including power distribution, thermal management, and load-balancing optimizations.',
        'Developed automated diagnostics using neural cores to ensure quality across propulsion, life support, and power systems.',
        'Created and maintained plasma welding protocols and zero-G construction procedures for off-world habitat expansions.',
      ],
    },
    {
      role: 'Terraforming Technician',
      company: 'Olympus Terraform Corp',
      location: 'Valles Marineris, Mars',
      start: '2114-01',
      end: '2120-02',
      bullets: [
        'Atmospheric Processing: operated and extended atmospheric processors, including CO2 conversion loops and pressure-regulation workflows.',
        'Hydroponics: development and maintenance of greenhouse automation systems using soil sensors and nutrient dosing, supporting over 100,000 plants per growing cycle.',
        'Water Extraction: extension and maintenance of ice-mining rigs, data modeling for aquifer mapping, and optimization of extraction yields.',
        'Telemetry: development of operational and scientific telemetry dashboards for surface rovers.',
        'Public Sensor Network: design, development, and maintenance of a shared weather-data feed for settlement partners.',
      ],
    },
  ],
  education: [
    {
      degree: 'Ph.D. Applied Xenology',
      institution: 'University of Olympus Mons',
      location: 'Olympus Mons, Mars',
      start: '2120-09',
      end: '2126-06',
      details:
        'Focus areas: antigravity field theory, exoplanetary geology, habitat engineering, and AI-assisted resource management. Thesis: [Field Stability](https://example.edu/thesis).',
    },
    {
      degree: 'B.Sc. Planetary Engineering',
      institution: 'Crater City Institute of Technology',
      location: 'Crater City, Mars',
      start: '2110-09',
      end: '2114-06',
    },
  ],
  languages: [
    { name: 'Xylosian', level: 'Native' },
    { name: 'Galactic Common', level: 'Fluent' },
    { name: 'Earth English', level: 'Intermediate' },
  ],
  certifications: [],
  customSections: [
    {
      id: 'custom-hobbies',
      title: 'Hobbies & Interests',
      style: 'paragraph',
      items: [
        '**Zero-G Sports** — zero-gravity racquetball league champion of Olympus Mons, three cycles running.',
        '- [Timelapse gallery](https://example.mars/timelapses) — collecting high-resolution timelapses of Martian dust storms.',
        '- Restoring vintage Earth rovers in the garage.',
        '**Holographic Chess** — competitive holo-chess against neural cores and fellow engineers.',
      ],
    },
  ],
}

// Lorem ipsum placeholder — same section shapes, meaningless text.
export const LOREM_CV: CvData = {
  ...SAMPLE_CV,
  profile: {
    ...SAMPLE_CV.profile,
    fullName: 'Lorem Ipsum',
    headline: 'Dolor Sit Amet',
    email: 'lorem.ipsum@example.com',
    phone: '+00 000 000-0000',
    location: 'Consectetur Adipiscing, Elit',
    website: 'https://example.com/',
    linkedin: 'linkedin.com/in/lorem-ipsum',
    github: 'github.com/loremipsum',
  },
  summary:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  skills: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit'],
  work: SAMPLE_CV.work.map((w, i) => ({
    ...w,
    role: i === 0 ? 'Lorem Ipsum Engineer' : 'Dolor Sit Technician',
    company: 'Adipiscing Labs',
    location: 'Consectetur City',
    bullets: w.bullets.map(() =>
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    ),
  })),
  education: SAMPLE_CV.education.map((e, i) => ({
    ...e,
    degree: i === 0 ? 'Ph.D. Lorem Ipsum' : 'B.Sc. Dolor Sit',
    institution: 'University of Amet',
    location: 'Elit, Consectetur',
  })),
  languages: [
    { name: 'Lorem', level: 'Native' },
    { name: 'Ipsum', level: 'Fluent' },
  ],
  customSections: [
    {
      id: 'custom-hobbies',
      title: 'Hobbies & Interests',
      style: 'paragraph',
      items: [
        '**Lorem ipsum** — dolor sit amet, consectetur adipiscing elit.',
        '- Sed do eiusmod tempor incididunt ut labore.',
        '- Duis aute irure dolor in reprehenderit in voluptate.',
      ],
    },
  ],
}

// Blank state — structure only, no content.
export const BLANK_CV: CvData = {
  schema: 1,
  accent: '#1a4f8b',
  sectionOrder: ['summary', 'work', 'skills', 'education', 'languages', 'certifications'],
  profile: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  skills: [],
  work: [],
  education: [],
  languages: [],
  certifications: [],
  customSections: [],
}

export const CV_PRESETS: { id: string; cv: CvData }[] = [
  { id: 'sample', cv: SAMPLE_CV },
  { id: 'lorem', cv: LOREM_CV },
  { id: 'blank', cv: BLANK_CV },
]
