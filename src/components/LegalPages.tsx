// Legal pages: Impressum (§5 DDG), Terms of Use, Privacy Policy.
// NOTE: English drafts for launch — not legal advice. Have them reviewed
// (and ideally translated to German) before going public in Germany.
import { Box, Button, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useUiLang } from '../lib/i18n'

export type LegalPageName = 'impressum' | 'terms' | 'privacy'

const Heading = ({ children }: { children: string }) => (
  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
    {children}
  </Typography>
)

function Impressum() {
  return (
    <>
      <Heading>Impressum</Heading>
      <Typography variant="body2" color="text.secondary">
        Angaben gemäß § 5 DDG
      </Typography>
      <Typography variant="body2">
        <strong>Lê Quốc Anh Trần</strong>
        <br />
        Glogauer Str. 11
        <br />
        90473 Nürnberg
        <br />
        Germany
      </Typography>
      <Typography variant="body2">
        <strong>Contact</strong>
        <br />
        Email: lequocanhtr@gmail.com
      </Typography>
      <Typography variant="body2">
        <strong>VAT ID</strong>
        <br />
        Not applicable (operated as a private individual).
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Responsible for the content of this site per § 18 Abs. 2 MStV: Lê Quốc Anh Trần (address as above).
      </Typography>
    </>
  )
}

function Terms() {
  return (
    <>
      <Heading>Terms of Use</Heading>
      <Typography variant="body2">
        Vitaeo is a free, browser-based tool for creating CV PDFs. By using it you agree to these terms.
      </Typography>
      <Heading>1. Service &amp; availability</Heading>
      <Typography variant="body2">
        The tool is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind
        (express or implied), including fitness for a particular purpose or uninterrupted availability.
      </Typography>
      <Heading>2. Your data</Heading>
      <Typography variant="body2">
        Vitaeo has no backend, no database and no accounts. All CV data stays in your own browser
        (localStorage) and is never transmitted. You are responsible for backing up your data (e.g. via the
        Export function) and for clearing it from your browser.
      </Typography>
      <Heading>3. Your responsibility</Heading>
      <Typography variant="body2">
        You are solely responsible for the accuracy of the content you enter and for how you use the generated
        PDFs, including in job applications.
      </Typography>
      <Heading>4. No outcome guarantee</Heading>
      <Typography variant="body2">
        Vitaeo does not guarantee any results from using the tool, including application outcomes, ATS
        compatibility of any specific system, interviews, or job offers.
      </Typography>
      <Heading>5. Liability</Heading>
      <Typography variant="body2">
        To the extent permitted by law, the operator is not liable for damages arising from the use of the tool
        or from generated documents.
      </Typography>
      <Heading>6. Law</Heading>
      <Typography variant="body2">
        These terms are governed by the laws of the Federal Republic of Germany.
      </Typography>
    </>
  )
}

function Privacy() {
  return (
    <>
      <Heading>Privacy Policy</Heading>
      <Typography variant="body2">
        This page explains what data Vitaeo processes. Short version: <strong>nothing is collected or stored
        by us</strong> — your CV never leaves your browser.
      </Typography>
      <Heading>1. No server, no database, no account</Heading>
      <Typography variant="body2">
        Vitaeo is a static website with no backend and no database. There is no registration, no user accounts,
        and no personal data is transmitted to us. The CV data you enter is stored only in your own browser
        (localStorage) and remains under your control. Clearing your browser data deletes it.
      </Typography>
      <Heading>2. Passphrase</Heading>
      <Typography variant="body2">
        If you set an optional passphrase, backups are encrypted in your browser (AES-256-GCM). The passphrase
        is never sent anywhere and is not stored by us. It cannot be recovered if forgotten.
      </Typography>
      <Heading>3. Cookies, analytics, tracking</Heading>
      <Typography variant="body2">
        The site sets no cookies and uses no analytics, advertising or tracking services.
      </Typography>
      <Heading>4. Hosting</Heading>
      <Typography variant="body2">
        The site is served via Cloudflare Pages, a static hosting provider. Cloudflare may process technical
        connection data (e.g. IP address, request time) in accordance with its own privacy policy for
        delivering and securing the site. We do not receive or use this data for any purpose.
      </Typography>
      <Heading>5. Contact</Heading>
      <Typography variant="body2">
        Questions about this policy: lequocanhtr@gmail.com
      </Typography>
    </>
  )
}

export function LegalPage({ page, onBack }: { page: LegalPageName; onBack: () => void }) {
  const { t } = useUiLang()
  return (
    <Box sx={{ minHeight: '100vh', px: 2, pb: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mt: 2 }}>
        {t('backToEditor')}
      </Button>
      <Box sx={{ maxWidth: 760, mx: 'auto', mt: 1 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {page === 'impressum' ? t('impressum') : page === 'terms' ? t('terms') : t('privacy')}
        </Typography>
        <Stack sx={{ '& p': { maxWidth: 640 } }}>
          {page === 'impressum' && <Impressum />}
          {page === 'terms' && <Terms />}
          {page === 'privacy' && <Privacy />}
        </Stack>
      </Box>
    </Box>
  )
}
