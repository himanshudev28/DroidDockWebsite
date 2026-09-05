import { motion } from 'motion/react'
import { RELEASE } from '../lib/content'
import { EASE_QUINT, settle, stagger } from '../lib/motion'
import { AndroidIcon, AppleIcon, DownloadIcon, GithubIcon } from '../ui/icons'
import { SpotlightGrid } from '../ui/SpotlightGrid'
import { Container, Lamp, Readout } from '../ui/primitives'
import { LinkStage } from './LinkStage'

export function Hero() {
  return (
    <div id="top" className="relative overflow-hidden pt-28 pb-[clamp(2.5rem,5vw,4rem)] lg:pt-32">
      {/* Instrument-panel ground. Masked so it fades out well before it
          reaches the type — a grid you can read through, not a texture. */}
      <div
        className="panel-grid pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(120% 80% at 62% 32%, black, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(120% 80% at 62% 32%, black, transparent 72%)',
          opacity: 0.55,
        }}
        aria-hidden="true"
      />
      {/* the same grid again, but lit under the pointer */}
      <SpotlightGrid />

      {/* a single warm bloom behind the phone, standing in for the lamp
          on the desk this thing lives on */}
      <div
        className="pointer-events-none absolute top-[-10%] right-[-10%] h-[70vh] w-[70vw] max-w-[900px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-amber) 11%, transparent), transparent 62%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-x-10 gap-y-14 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-6"
            variants={stagger(0.1, 0.08)}
            initial="hidden"
            animate="shown"
          >
            <motion.div variants={settle} className="mb-7 flex items-center gap-2.5">
              <Lamp size={6} pulse />
              <Readout>Android ↔ macOS · over your own Wi-Fi</Readout>
            </motion.div>

            <motion.h1
              variants={settle}
              className="display text-[clamp(2.3rem,4.6vw,3.9rem)]"
            >
              Stop reaching
              <br />
              for your phone.
            </motion.h1>

            <motion.p variants={settle} className="measure mt-7 text-[1.125rem] text-fg-2">
              DroidDock puts your Android's clipboard, notifications, messages, files, calls,
              screen and camera on your Mac. It runs entirely on your own network — there is no
              account, no server, and nothing to sign into.
            </motion.p>

            <motion.div variants={settle} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={RELEASE.dmg}
                className="group inline-flex items-center gap-3 rounded-md bg-amber px-5 py-3.5 font-semibold text-on-amber transition-[background-color,transform] duration-200 hover:bg-amber-hi active:scale-[0.985] motion-reduce:active:scale-100"
              >
                <DownloadIcon size={17} />
                <span className="flex flex-col items-start leading-tight">
                  <span>Download for macOS</span>
                  <span className="readout mt-0.5 text-[9px] text-on-amber/70">
                    v{RELEASE.version} · Apple Silicon · ~6 MB
                  </span>
                </span>
              </a>

              <a
                href={RELEASE.apk}
                className="inline-flex items-center gap-2.5 rounded-md border border-line-2 bg-panel/60 px-5 py-3.5 font-semibold text-fg transition-colors duration-200 hover:border-amber hover:text-amber-ink"
              >
                <AndroidIcon size={17} />
                <span className="flex flex-col items-start leading-tight">
                  <span>Get the APK</span>
                  <span className="readout mt-0.5 text-[9px] text-fg-4">Sideload · Android 8+</span>
                </span>
              </a>
            </motion.div>

            <motion.div
              variants={settle}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-5"
            >
              {[
                { icon: <AppleIcon size={13} />, text: 'Tauri 2 · native Rust, not a browser' },
                { icon: <GithubIcon size={13} />, text: 'Source on GitHub' },
              ].map((m) => (
                <span key={m.text} className="flex items-center gap-2 text-fg-3">
                  {m.icon}
                  <Readout>{m.text}</Readout>
                </span>
              ))}
              <a
                href={RELEASE.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="readout py-2 text-amber-ink underline decoration-amber-ink/40 underline-offset-4 transition-colors hover:decoration-amber-ink"
              >
                Read the source
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 lg:-mr-10 xl:-mr-[7vw]"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE_QUINT }}
          >
            <LinkStage />
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
