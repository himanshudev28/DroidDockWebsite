/**
 * A small hand-cut monoline set. One set, one grid (24), one stroke
 * weight (1.6), square-ish joins to match the instrument-panel voice.
 * Deliberately not a library: five glyphs don't justify a dependency,
 * and the generic rounded-icon look is exactly what we're avoiding.
 */
type P = { className?: string; size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true as const,
  focusable: 'false' as const,
})

export const DownloadIcon = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v11.5" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 20h16" />
  </svg>
)

export const GithubIcon = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
    <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.33-.26-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08a10 10 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.21 2.52.11 2.79.67.74 1.08 1.67 1.08 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5Z" />
  </svg>
)

export const ArrowIcon = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const AndroidIcon = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
    <path d="M6.7 9.3h10.6a.7.7 0 0 1 .7.7v6.6a1.7 1.7 0 0 1-1.7 1.7h-.4v2.2a1.4 1.4 0 1 1-2.8 0v-2.2h-2.2v2.2a1.4 1.4 0 1 1-2.8 0v-2.2h-.4A1.7 1.7 0 0 1 6 16.6V10a.7.7 0 0 1 .7-.7ZM4.4 10a1.4 1.4 0 0 1 1.4 1.4v3.9a1.4 1.4 0 0 1-2.8 0v-3.9A1.4 1.4 0 0 1 4.4 10Zm15.2 0a1.4 1.4 0 0 1 1.4 1.4v3.9a1.4 1.4 0 0 1-2.8 0v-3.9a1.4 1.4 0 0 1 1.4-1.4ZM8.9 3.2l.85 1.53a6.3 6.3 0 0 1 4.5 0l.85-1.53a.35.35 0 1 1 .61.34l-.84 1.5A5.4 5.4 0 0 1 17.7 8.4H6.3a5.4 5.4 0 0 1 2.83-3.36l-.84-1.5a.35.35 0 1 1 .61-.34ZM9.4 6.5a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Zm5.2 0a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z" />
  </svg>
)

export const AppleIcon = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
    <path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.15-2.7.8-3.4.8-.7 0-1.8-.78-2.9-.76-1.5.02-2.9.87-3.66 2.2-1.57 2.72-.4 6.74 1.12 8.94.75 1.08 1.63 2.29 2.8 2.25 1.13-.05 1.55-.73 2.92-.73 1.36 0 1.75.73 2.94.7 1.21-.02 1.98-1.1 2.72-2.18.86-1.25 1.21-2.46 1.23-2.52-.03-.01-2.36-.9-2.38-3.6ZM14.2 5.9c.62-.75 1.03-1.8.92-2.84-.89.04-1.97.6-2.6 1.34-.57.66-1.07 1.72-.94 2.74.99.08 2-.5 2.62-1.24Z" />
  </svg>
)

export const MenuIcon = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 7h18" />
    <path d="M3 17h18" />
  </svg>
)

export const CloseIcon = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5 5 14 14" />
    <path d="m19 5-14 14" />
  </svg>
)
