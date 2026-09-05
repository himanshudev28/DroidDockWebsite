import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { EASE_QUINT, inView, settle, stagger, useReducedMotion } from '../lib/motion'
import { Container, Lamp, Readout, Section } from '../ui/primitives'

type Clip = { id: number; text: string }

const SEED: Clip[] = [
  { id: 0, text: 'https://tauri.app/v2/guides/' },
  { id: -1, text: '2FA 481 902' },
  { id: -2, text: 'himanshu@example.com' },
]

/**
 * A working demo, not a video of one. Type on the phone side and the
 * text crosses to the Mac exactly the way the app does it — including
 * the Auto / Manual distinction, which exists because Android 13+ and
 * One UI block background clipboard reads.
 */
export function Clipboard() {
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [draft, setDraft] = useState('')
  const [clips, setClips] = useState<Clip[]>(SEED)
  const [flying, setFlying] = useState<string | null>(null)
  const seq = useRef(1)
  const timer = useRef<number | undefined>(undefined)

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    setDraft('')
    if (reduced) {
      setClips((c) => [{ id: seq.current++, text: value }, ...c].slice(0, 4))
      return
    }
    setFlying(value)
    window.setTimeout(() => {
      setFlying(null)
      setClips((c) => [{ id: seq.current++, text: value }, ...c].slice(0, 4))
    }, 700)
  }

  // Auto mode fires shortly after you stop typing, the way the real
  // accessibility-event listener does when a "copied" toast appears.
  useEffect(() => {
    window.clearTimeout(timer.current)
    if (mode !== 'auto' || !draft.trim()) return
    timer.current = window.setTimeout(() => send(draft), 900)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, mode])

  return (
    <Section id="clipboard" pad="xl">
      <Container>
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12 lg:items-center">
          <motion.div
            className="lg:col-span-4"
            variants={stagger()}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            <motion.div variants={settle} className="mb-5 flex items-center gap-2.5">
              <Lamp size={6} />
              <Readout className="text-amber-ink">Clipboard</Readout>
            </motion.div>
            <motion.h2 variants={settle} className="display text-[clamp(1.9rem,4vw,2.9rem)]">
              Copy there. Paste here.
            </motion.h2>
            <motion.p variants={settle} className="measure mt-5 text-fg-2">
              Mac to phone happens automatically. Phone to Mac is your choice: <b className="font-semibold text-fg">Auto</b>{' '}
              sends the moment you copy, <b className="font-semibold text-fg">Manual</b> waits for you to press send.
            </motion.p>
            <motion.p variants={settle} className="measure mt-4 text-[0.9375rem] text-fg-3">
              Android 13 and One UI block apps from reading the clipboard in the background, so
              DroidDock listens for the accessibility event the system fires when you copy — it
              never polls the clipboard itself.
            </motion.p>
            <motion.p variants={settle} className="measure mt-4 text-[0.9375rem] text-fg-3">
              History is kept in memory only and capped on purpose. Writing it to disk would
              produce a plaintext log of every password and OTP you ever copied.
            </motion.p>
          </motion.div>

          {/* ---------------- live demo ---------------- */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: EASE_QUINT }}
          >
            <div className="relative grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-0">
              {/* phone side */}
              <div className="etched rounded-xl border border-line-2 bg-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="readout text-fg-3">Pixel 8</span>
                  <ModeToggle mode={mode} onChange={setMode} />
                </div>

                <label htmlFor="clip-input" className="mt-5 block text-[0.8125rem] text-fg-2">
                  Copy something on your phone
                </label>
                <input
                  id="clip-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      window.clearTimeout(timer.current)
                      send(draft)
                    }
                  }}
                  placeholder="Type here, then watch the Mac →"
                  maxLength={70}
                  className="mt-2 w-full rounded-md border border-line-2 bg-ink px-3 py-2.5 text-[0.9375rem] text-fg placeholder:text-fg-3 focus:border-amber focus:outline-none"
                />

                {mode === 'manual' ? (
                  <button
                    type="button"
                    onClick={() => send(draft)}
                    disabled={!draft.trim()}
                    className="mt-3 w-full rounded-md bg-amber px-4 py-2.5 text-[0.875rem] font-semibold text-on-amber transition-[background-color,opacity] duration-200 hover:bg-amber-hi disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send to Mac
                  </button>
                ) : (
                  <p className="readout mt-3 text-[9px] text-fg-4">
                    {draft.trim() ? 'Sending…' : 'Sends automatically on copy'}
                  </p>
                )}
              </div>

              {/* the wire between them (desktop only — on mobile the two
                  panels stack and the arrival animation carries it) */}
              <div className="relative hidden w-28 items-center justify-center md:flex">
                <span className="h-px w-full bg-line-2" />
                <span className="absolute h-1.5 w-1.5 rounded-full bg-amber lamp" />
                <AnimatePresence>
                  {flying && (
                    <motion.span
                      className="absolute z-10 max-w-[7rem] truncate rounded-full border border-amber/50 bg-panel-2 px-2.5 py-1 text-[10px] text-fg"
                      initial={{ x: -56, opacity: 0, scale: 0.85 }}
                      animate={{ x: 56, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.7, ease: [0.5, 0, 0.5, 1] }}
                    >
                      {flying}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* mac side */}
              <div className="etched rounded-xl border border-line-2 bg-panel p-5">
                <div className="flex items-center justify-between">
                  <span className="readout text-fg-3">MacBook Air · clipboard</span>
                  <span className="flex items-center gap-1.5">
                    <Lamp tone="green" size={5} />
                    <span className="readout text-[8px] text-green">linked</span>
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  <AnimatePresence initial={false}>
                    {clips.map((c, i) => (
                      <motion.li
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: -8, backgroundColor: 'oklch(0.795 0.152 74 / 0.16)' }}
                        animate={{ opacity: 1, y: 0, backgroundColor: 'oklch(0.235 0.0125 285 / 0.5)' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.5, ease: EASE_QUINT, backgroundColor: { duration: 1.1 } }}
                        className="flex items-center gap-3 overflow-hidden rounded-md border border-line/70 px-3 py-2.5"
                      >
                        <span className="readout shrink-0 text-[9px] text-fg-4">
                          {i === 0 ? 'now' : `${i * 4 + 2}m`}
                        </span>
                        <span className="truncate text-[0.875rem] text-fg">{c.text}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {clips.length === 0 && (
                  <p className="mt-5 text-[0.875rem] text-fg-3">Nothing copied this session.</p>
                )}

                <p className="readout mt-4 border-t border-line/70 pt-3 text-[9px] text-fg-4">
                  Session only · never written to disk
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: 'auto' | 'manual'
  onChange: (m: 'auto' | 'manual') => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Phone to Mac clipboard mode"
      className="flex rounded-full border border-line-2 bg-ink p-0.5"
    >
      {(['auto', 'manual'] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className="relative rounded-full px-3.5 py-2 text-[11px] font-medium capitalize transition-colors duration-200"
          style={{ color: mode === m ? 'var(--color-on-amber)' : 'var(--color-fg-3)' }}
        >
          {mode === m && (
            <motion.span
              layoutId="clip-mode"
              className="absolute inset-0 rounded-full bg-amber"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative">{m}</span>
        </button>
      ))}
    </div>
  )
}
