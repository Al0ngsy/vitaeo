# Vitaeo

**Live: https://vitaeo.pages.dev/**

Personal, self-hosted CV PDF builder. Edit your CV, download ATS-optimized PDFs in multiple styles, and never lose your data — it round-trips three lossless ways:

1. **Autosave** — debounced write to `localStorage`. Close the tab, come back, everything is there.
2. **Backup string** — one click copies the whole CV as a compact portable string (`cv0$` = compressed, `cv1$` = AES-256-GCM encrypted with a passphrase). Paste it back any time to restore.
3. **PDF round-trip** — every downloaded PDF carries its own data in its metadata. Upload it back and edit: no generic PDF parsing needed.

100% client-side: Vite + React + TypeScript + MUI, `@react-pdf/renderer` for PDFs, native WebCrypto + CompressionStream for the string format. No backend, no database.

## Dev

```bash
yarn          # install
yarn dev      # local dev server
yarn test     # vitest (encoding round-trips)
yarn build    # tsc -b && vite build
```

## Adding a style

Create `src/components/styles/<Name>.tsx` exporting a `CvStyleComponent` (a react-pdf `Document`), then add one line to the `CV_STYLES` registry in `src/components/styles/index.ts`. Pass `keywords={backupString}` to `<Document>` so the style keeps the PDF round-trip working. ATS rules: single column, Helvetica only, real text, no tables/images.
