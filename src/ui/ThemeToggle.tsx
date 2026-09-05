import { motion } from 'motion/react'
import type { ReactElement } from 'react'
import { useTheme, type Theme } from '../lib/theme'

/* A three-position rocker, the way a panel switch would be — System sits
   in the middle because it's the default, not because it's a compromise. */
const OPTIONS: { value: Theme; label: string; icon: ReactElement }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.8" y="4" width="18.4" height="12.5" rx="1.6" />
        <path d="M8.5 20h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 13.4A8.4 8.4 0 1 1 10.6 4a6.8 6.8 0 0 0 9.4 9.4Z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`flex items-center gap-0.5 rounded-md border border-line-2 p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => {
        const active = theme === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => setTheme(o.value)}
            data-cursor="tight"
            className="relative flex h-7 w-7 items-center justify-center rounded transition-colors duration-200"
            style={{ color: active ? 'var(--color-on-amber)' : 'var(--color-fg-3)' }}
          >
            {active && (
              <motion.span
                layoutId="theme-rocker"
                className="absolute inset-0 rounded bg-amber"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.icon}</span>
          </button>
        )
      })}
    </div>
  )
}
