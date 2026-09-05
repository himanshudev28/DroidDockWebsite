import { motion } from 'motion/react'
import { RELEASE } from '../lib/content'
import { ROUTES, home } from '../lib/paths'
import { inView, settle, stagger } from '../lib/motion'
import { AndroidIcon, AppleIcon, GithubIcon } from '../ui/icons'
import { url } from '../lib/paths'
import { Container, Lamp, Readout, Section } from '../ui/primitives'

export function Footer() {
  return (
    <>
      {/* closing call to action — the page's second-loudest moment */}
      <Section pad="xl" className="relative overflow-hidden bg-panel/40">
        <div
          className="panel-grid pointer-events-none absolute inset-0"
          style={{
            maskImage: 'radial-gradient(80% 100% at 50% 50%, black, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(80% 100% at 50% 50%, black, transparent 78%)',
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
        <Container className="relative">
          <motion.div
            variants={stagger(0, 0.08)}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div variants={settle} className="mb-6 flex items-center justify-center gap-2.5">
              <Lamp size={6} pulse />
              <Readout>Free · no account · source on GitHub</Readout>
            </motion.div>
            <motion.h2 variants={settle} className="display text-[clamp(2rem,5vw,3.5rem)]">
              Put the phone down.
            </motion.h2>
            <motion.p variants={settle} className="mx-auto mt-5 max-w-lg text-[1.0625rem] text-fg-2">
              Pair once and the two stay quietly connected whenever they're on the same Wi-Fi.
            </motion.p>
            <motion.div variants={settle} className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={RELEASE.dmg}
                className="inline-flex items-center gap-2.5 rounded-md bg-amber px-5 py-3.5 font-semibold text-on-amber transition-[background-color,transform] duration-200 hover:bg-amber-hi active:scale-[0.985] motion-reduce:active:scale-100"
              >
                <AppleIcon size={16} />
                Download for macOS
              </a>
              <a
                href={RELEASE.apk}
                className="inline-flex items-center gap-2.5 rounded-md border border-line-2 bg-panel/60 px-5 py-3.5 font-semibold text-fg transition-colors duration-200 hover:border-amber hover:text-amber-ink"
              >
                <AndroidIcon size={16} />
                Get the APK
              </a>
            </motion.div>
            <motion.p variants={settle} className="readout mt-6 text-[9px] text-fg-4">
              v{RELEASE.version} · Apple Silicon · Android 8+ · updates itself from here on
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      <footer className="border-t border-line">
        <Container className="py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <img src={url('/droiddock-icon.png')} alt="" width={26} height={26} className="rounded-[7px]" />
                <span className="text-[0.9375rem] font-bold text-fg">DroidDock</span>
              </div>
              <p className="mt-3 max-w-xs text-[0.875rem] text-fg-3">
                An Android ↔ Mac bridge that runs on your own network. Built with Tauri 2 and
                Jetpack Compose.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3 lg:grid-cols-4" aria-label="Footer">
              {[
                { label: 'Documentation', href: ROUTES.docs },
                { label: 'Capabilities', href: home('capabilities') },
                { label: 'How it works', href: home('protocol') },
                { label: 'Install', href: home('install') },
                { label: 'Limits', href: home('scope') },
                { label: 'Source', href: RELEASE.repo },
                { label: 'Releases', href: RELEASE.releases },
                { label: 'Report a bug', href: RELEASE.issues },
                { label: 'Privacy', href: ROUTES.privacy },
                { label: 'Terms', href: ROUTES.terms },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="py-2 text-[0.875rem] text-fg-2 transition-colors duration-200 hover:text-amber-ink"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-line/70 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <Readout className="text-[9px] text-fg-4">
              Built for a friction-free desk · UPI tips{' '}
              {/* the readout style uppercases; a UPI handle shouldn't be */}
              <span className="normal-case">{RELEASE.upi}</span>
            </Readout>
            <a
              href={RELEASE.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 self-start text-[0.875rem] text-fg-2 transition-colors duration-200 hover:text-amber-ink"
            >
              <GithubIcon size={15} />
              Star it on GitHub
            </a>
          </div>
        </Container>
      </footer>
    </>
  )
}
