import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { UiLangProvider } from './lib/i18n'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f59e0b', contrastText: '#0b0e13' },
    secondary: { main: '#8b93a7' },
    background: { default: '#0b0e13', paper: '#131823' },
    text: { primary: '#e8edf5', secondary: '#8b93a7' },
    divider: 'rgba(232, 237, 245, 0.08)',
    success: { main: '#4ade80' },
  },
  shape: { borderRadius: 14 },
  typography: {
    button: { textTransform: 'none', fontWeight: 600 },
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'border-color 150ms ease',
          '&:hover': { borderColor: 'rgba(245, 158, 11, 0.35)' },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiToggleButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, boxShadow: 'none' },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UiLangProvider>
        <App />
      </UiLangProvider>
    </ThemeProvider>
  </StrictMode>,
)
