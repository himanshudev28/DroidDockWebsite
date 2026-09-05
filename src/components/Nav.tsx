import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { RELEASE } from '../lib/content'
import { EASE_QUINT } from '../lib/motion'
import { ROUTES, home, url } from '../lib/paths'
import { CloseIcon, DownloadIcon, GithubIcon, MenuIcon } from '../ui/icons'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Lamp, Readout } from '../ui/primitives'

/* Absolute hrefs so every link works from /docs/, /privacy/ and /terms/. */
const LINKS = [
  { href: home('app'), label: 'The app' },
  { href: home('capabilities'), label: 'Capabilities' },
  { href: home('protocol'), label: 'How it works' },
  { href: ROUTES.docs, label: 'Docs' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [lifted, setLifted] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 24))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-amber focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ color: "var(--color-on-amber)" }}
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 transition-[background-color,border-color,backdrop-filter] duration-300"
        style={{
          zIndex: 'var(--z-nav)',
          background: lifted
            ? 'color-mix(in oklch, var(--color-ink) 82%, transparent)'
            : 'transparent',
          backdropFilter: lifted ? 'blur(14px) saturate(140%)' : 'none',
          borderBottom: `1px solid ${lifted ? 'var(--color-line)' : 'transparent'}`,
        }}
      >
        <div className="mx-auto flex h-14 w-full max-w-[104rem] items-center gap-3 px-5 sm:px-8">
          <a href={ROUTES.home} className="flex items-center gap-2.5 py-2">
            <img src={url('/droiddock-icon.png')} alt="" width={24} height={24} className="rounded-[6px]" />
            <span className="text-[0.9375rem] font-bold tracking-[-0.01em] text-fg">DroidDock</span>
          </a>

          <a
            href={RELEASE.releases}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-1.5 rounded-full border border-line px-2 py-0.5 transition-colors hover:border-amber xl:flex"
          >
            <Lamp size={5} />
            <Readout className="text-[9px]">v{RELEASE.version}</Readout>
          </a>

          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[0.875rem] text-fg-2 transition-colors duration-200 hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-6">
            <ThemeToggle className="hidden sm:flex" />
            <a
              href={RELEASE.repo}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Source on GitHub"
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-line-2 text-fg-2 transition-colors duration-200 hover:text-fg sm:flex"
            >
              <GithubIcon size={15} />
            </a>
            <a
              href={RELEASE.dmg}
              className="hidden items-center gap-2 rounded-md bg-amber px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors duration-200 hover:bg-amber-hi sm:flex"
              style={{ color: "var(--color-on-amber)" }}
            >
              <DownloadIcon size={15} />
              Download
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line-2 text-fg lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-14 bottom-0 overflow-y-auto border-t border-line bg-ink/97 backdrop-blur-xl lg:hidden"
            style={{ zIndex: 'var(--z-overlay)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.16 } }}
            transition={{ duration: 0.24, ease: EASE_QUINT }}
          >
            <nav className="flex flex-col px-5 py-4" aria-label="Main">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/70 py-4 text-lg text-fg"
                >
                  {l.label}
                </a>
              ))}

              <div className="mt-6 flex items-center justify-between">
                <Readout className="text-fg-4">Theme</Readout>
                <ThemeToggle />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={RELEASE.dmg}
                  className="flex items-center justify-center gap-2 rounded-md bg-amber px-4 py-3.5 font-semibold"
                  style={{ color: "var(--color-on-amber)" }}
                >
                  <DownloadIcon /> Download for macOS
                </a>
                <a
                  href={RELEASE.apk}
                  className="flex items-center justify-center gap-2 rounded-md border border-line-2 px-4 py-3.5 font-semibold text-fg"
                >
                  Get the Android APK
                </a>
                <a
                  href={RELEASE.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-center gap-2 py-2 text-fg-2"
                >
                  <GithubIcon /> View source on GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
