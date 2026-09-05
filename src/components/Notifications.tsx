import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { REVERSE } from '../lib/content'
import { EASE_QUINT, inView, settle, stagger, useLoop, useReducedMotion } from '../lib/motion'
import { Container, Lamp, Readout, Section } from '../ui/primitives'

type Alert = {
  id: number
  app: string
  hue: number
  title: string
  body: string
  kind: 'reply' | 'call' | 'plain'
}

const FEED: Omit<Alert, 'id'>[] = [
  { app: 'Messages', hue: 148, title: 'Priya', body: 'Landing at 7 — still on for dinner?', kind: 'reply' },
  { app: 'Phone', hue: 210, title: 'Incoming call', body: 'Mum · mobile', kind: 'call' },
  { app: 'Ride', hue: 74, title: 'Driver arriving', body: 'Silver Swift · 2 min away', kind: 'plain' },
  { app: 'Bank', hue: 262, title: '₹840 debited', body: 'UPI · Blue Tokai Coffee', kind: 'plain' },
]

export function Notifications() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const step = useRef(3)
  const seq = useRef(0)
  const [alerts, setAlerts] = useState<Alert[]>([
    { ...FEED[0], id: -1 },
    { ...FEED[1], id: -2 },
    { ...FEED[2], id: -3 },
  ])

  const push = useCallback(() => {
    const spec = FEED[step.current++ % FEED.length]
    setAlerts((cur) => [{ ...spec, id: seq.current++ }, ...cur].slice(0, 3))
  }, [])

  useLoop(ref, 3200, push, !reduced)

  return (
    <Section id="notifications" pad="xl" className="bg-panel/40">
      <Container>
        <div className="grid items-center gap-x-14 gap-y-14 lg:grid-cols-12">
          {/* the stack */}
          <motion.div
            ref={ref}
            className="order-2 lg:order-1 lg:col-span-6"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: EASE_QUINT }}
          >
            {/* a slice of desktop for the alerts to land on */}
            <div className="relative min-h-[340px] rounded-xl border border-line/70 bg-ink/60 p-4">
              <div className="panel-grid absolute inset-0 rounded-xl opacity-20" aria-hidden="true" />
              <div className="relative mb-4 flex items-center justify-between">
                <Readout className="text-[9px] text-fg-4">macOS Notification Centre</Readout>
                <Readout className="text-[9px] text-fg-4">via DroidDock</Readout>
              </div>

              <div className="relative flex flex-col gap-2.5">
                <AnimatePresence initial={false}>
                  {alerts.map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, x: 40, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 40, scale: 0.96 }}
                      transition={{ duration: 0.42, ease: EASE_QUINT }}
                      className="rounded-xl border border-line-2 bg-panel-2/90 p-3 shadow-[0_14px_34px_-16px_rgb(0_0_0/0.85)] backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 h-7 w-7 shrink-0 rounded-[9px]"
                          style={{ background: `oklch(0.56 0.13 ${a.hue})` }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-[0.8125rem] font-semibold text-fg">
                              {a.title}
                            </span>
                            <span className="readout ml-auto shrink-0 text-[8px] text-fg-4">
                              {a.app}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[0.8125rem] text-fg-2">{a.body}</p>

                          {a.kind === 'reply' && (
                            <div className="mt-2.5 flex items-center gap-2 rounded-md border border-line-2 bg-ink px-2.5 py-1.5">
                              <span className="text-[0.75rem] text-fg-3">Reply…</span>
                              <span className="readout ml-auto text-[8px] text-amber-ink">↵ send</span>
                            </div>
                          )}

                          {a.kind === 'call' && (
                            <div className="mt-2.5 flex gap-2">
                              <span className="rounded-md bg-green/15 px-2.5 py-1 text-[0.75rem] font-medium text-green">
                                Answer
                              </span>
                              <span className="rounded-md border border-line-2 px-2.5 py-1 text-[0.75rem] text-fg-3">
                                Decline
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* copy */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-6"
            variants={stagger()}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            <motion.div variants={settle} className="mb-5 flex items-center gap-2.5">
              <Lamp size={6} />
              <Readout className="text-amber-ink">Notifications, messages, calls</Readout>
            </motion.div>
            <motion.h2 variants={settle} className="display text-[clamp(1.9rem,4.2vw,3rem)]">
              Answer from the keyboard you're already using.
            </motion.h2>
            <motion.p variants={settle} className="measure mt-6 text-fg-2">
              Phone notifications arrive as real macOS alerts — not a panel inside an app window.
              Reply inline, dismiss, or mute a noisy app for good. Incoming calls come through with
              caller ID, and you can answer or place a call without picking the phone up.
            </motion.p>
            <motion.p variants={settle} className="measure mt-4 text-fg-2">
              SMS threads get a proper two-pane chat on the Mac: conversation list, search, day
              dividers, avatar initials, and a composer that syncs live.
            </motion.p>
          </motion.div>
        </div>

        {/* ---- and the other way round ---- */}
        <motion.div
          className="mt-[clamp(4rem,8vw,7rem)] border-t border-line/70 pt-10"
          variants={stagger(0, 0.07)}
          initial="hidden"
          whileInView="shown"
          viewport={inView}
        >
          <motion.h3 variants={settle} className="display text-[1.5rem]">
            And the other way round.
          </motion.h3>
          <motion.p variants={settle} className="measure mt-3 text-fg-2">
            The phone's home screen shows the Mac — off unless you turn remote control on.
          </motion.p>
          <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {REVERSE.map((r) => (
              <motion.div key={r.k} variants={settle} className="border-t border-line-2 pt-4">
                <div className="text-[0.9375rem] font-semibold text-fg">{r.k}</div>
                <p className="mt-1.5 text-[0.875rem] text-fg-3">{r.v}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
