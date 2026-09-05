import { useCallback, useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'
export const THEME_KEY = 'droiddock-theme'

/**
 * The exact script that runs in each page's <head>, before first paint,
 * so a pinned theme never flashes the other one. Kept here next to the
 * hook that has to agree with it — see scripts/theme-snippet.js, which
 * writes it into the HTML files.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

function read(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* private mode / blocked storage — fall through to system */
  }
  return 'system'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  // The <head> script already applied the stored value; sync React to it
  // after mount so the markup the server/build produced isn't contradicted.
  useEffect(() => setThemeState(read()), [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
    try {
      if (next === 'system') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, next)
    } catch {
      /* nothing to recover from — the choice just won't persist */
    }
  }, [])

  // Keep tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_KEY) return
      const next = read()
      setThemeState(next)
      applyTheme(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { theme, setTheme }
}
