import { motion } from 'motion/react'
import { useState } from 'react'
import { INSTALL_STEPS, RELEASE } from '../lib/content'
import { EASE_QUINT, inView, settle, stagger, useReducedMotion } from '../lib/motion'
import { AndroidIcon, AppleIcon, DownloadIcon } from '../ui/icons'
import { Container, Heading, Lamp, Readout, Section } from '../ui/primitives'

export function Install() {
  return (
    <Section id="install" pad="xl">
      <Container>
        <Heading
          title="Three steps, no account."
          lede="Both apps are prebuilt on the releases page. There is nothing to compile unless you want to."
          className="max-w-2xl"
        />

        <div className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-x-14 gap-y-14 lg:grid-cols-12">
          <motion.ol
            className="min-w-0 lg:col-span-7"
            variants={stagger(0, 0.1)}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            {INSTALL_STEPS.map((step) => (
              <motion.li
                key={step.n}
                variants={settle}
                className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-line-2 py-7 first:border-t-0 first:pt-0"
              >
                <span
                  className="display text-[1.75rem] leading-none text-amber-ink tabular-nums"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div className="min-w-0">
                  <h3 className="display text-[1.25rem]">{step.title}</h3>
                  <p className="measure mt-2.5 text-fg-2">{step.body}</p>
                  <p className="measure mt-3 text-[0.875rem] text-fg-3">{step.aside}</p>
                  {step.code && <CodeLine code={step.code} />}
                </div>
              </motion.li>
            ))}

            <motion.li variants={settle} className="border-t border-line-2 pt-7">
              <div className="flex flex-wrap gap-3">
                <a
                  href={RELEASE.dmg}
                  className="inline-flex max-w-full items-center gap-2.5 rounded-md bg-amber px-4 py-3 text-[0.8125rem] font-semibold break-all text-on-amber transition-colors duration-200 hover:bg-amber-hi sm:text-[0.875rem]"
                >
                  <AppleIcon size={15} />
                  DroidDock_{RELEASE.version}_aarch64.dmg
                </a>
                <a
                  href={RELEASE.apk}
                  className="inline-flex max-w-full items-center gap-2.5 rounded-md border border-line-2 px-4 py-3 text-[0.8125rem] font-semibold break-all text-fg transition-colors duration-200 hover:border-amber hover:text-amber-ink sm:text-[0.875rem]"
                >
                  <AndroidIcon size={15} />
                  DroidDock-Android.apk
                </a>
                <a
                  href={RELEASE.releases}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-1 py-3 text-[0.875rem] text-fg-2 underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg"
                >
                  <DownloadIcon size={14} />
                  All releases
                </a>
              </div>
            </motion.li>
          </motion.ol>

          <motion.div
            className="min-w-0 lg:col-span-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: EASE_QUINT }}
          >
            <PairPanel />
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

function CodeLine({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked (insecure context / permission) — the text is
         still selectable, so there's nothing to recover from */
    }
  }

  return (
    <div className="mt-4 flex items-stretch overflow-hidden rounded-md border border-line-2 bg-ink">
      <code className="min-w-0 flex-1 overflow-x-auto px-3 py-2.5 font-mono text-[0.75rem] whitespace-pre text-fg-2">
        {code}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 border-l border-line-2 px-3 text-[0.6875rem] font-semibold text-fg-3 transition-colors duration-200 hover:bg-panel hover:text-amber-ink"
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}

/* The pairing screen, rebuilt — amber corner brackets and the animated
   status pill are the Android app's real scan UI. */
function PairPanel() {
  const reduced = useReducedMotion()

  return (
    <div className="etched sticky top-24 rounded-xl border border-line-2 bg-panel p-6">
      <div className="flex items-center justify-between">
        <Readout className="text-fg-3">Pair device</Readout>
        <span className="flex items-center gap-1.5 rounded-full border border-green/30 bg-green/10 px-2 py-0.5">
          <Lamp tone="green" size={5} pulse={!reduced} />
          <span className="readout text-[8px] text-green">same network</span>
        </span>
      </div>

      <div className="relative mx-auto mt-7 aspect-square w-full max-w-[240px]">
        {/* corner brackets */}
        {[
          'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
          'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
          'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
          'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
        ].map((cls) => (
          <span key={cls} className={`absolute h-8 w-8 border-amber ${cls}`} aria-hidden="true" />
        ))}

        <div className="absolute inset-4 overflow-hidden rounded bg-white p-2.5">
          <QrGlyph />
          {!reduced && (
            <motion.span
              className="absolute inset-x-0 h-16"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, color-mix(in oklch, var(--color-amber) 45%, transparent), transparent)',
              }}
              initial={{ y: '-100%' }}
              animate={{ y: '400%' }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <dl className="mt-7 space-y-2.5 border-t border-line/70 pt-5">
        {[
          ['Host', '192.168.1.24'],
          ['Port', RELEASE.port],
          ['Token', '9f2c ···· ···· 4a71'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <dt className="readout text-[9px] text-fg-4">{k}</dt>
            <dd className="readout text-[10px] text-fg-2">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-[0.8125rem] text-fg-3">
        Camera being difficult? Type the host and token in by hand instead.
      </p>
    </div>
  )
}

/** A deterministic decorative QR-like glyph. It encodes nothing — it is a
 *  picture of the pairing screen, and labelling it that way is more
 *  honest than shipping a scannable code that goes nowhere. */
function QrGlyph() {
  const N = 25
  const cells: { x: number; y: number }[] = []
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)

  // xorshift-ish hash so the pattern is stable across renders
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue
      const h = (x * 73856093) ^ (y * 19349663) ^ ((x + y) * 83492791)
      if ((h >>> 3) % 100 < 46) cells.push({ x, y })
    }
  }

  const Finder = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width={7} height={7} fill="none" stroke="#0d0d12" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#0d0d12" />
    </>
  )

  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="h-full w-full" role="img" aria-label="Pairing QR code shown by the Mac app">
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1} height={1} fill="#0d0d12" />
      ))}
      <Finder x={0.5} y={0.5} />
      <Finder x={N - 7.5} y={0.5} />
      <Finder x={0.5} y={N - 7.5} />
    </svg>
  )
}
