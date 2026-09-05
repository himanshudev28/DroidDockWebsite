import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { url } from '../lib/paths'
import { EASE_EXPO, EASE_QUINT, useLoop, useReducedMotion } from '../lib/motion'
import { Lamp } from '../ui/primitives'

/* ------------------------------------------------------------------ *
 * The hero stage.
 *
 * Everything is laid out against a fixed 780×520 design grid and scaled
 * to fit with a container query, so the routed trace below can be given
 * in real pixels — `offset-path` resolves against the element box, not
 * an SVG viewBox, so a fixed intrinsic size is what keeps the packets
 * glued to the wire at every viewport width.
 * ------------------------------------------------------------------ */
/**
 * Two real layouts, not one layout shrunk.
 *
 * Scaling the wide composition down to a phone puts the device UI at
 * ~44% — legible as texture, useless as information. The compact grid
 * stacks instead and routes the bus down the left gutter, so it renders
 * near 1:1 on a 390px screen.
 *
 * Traffic runs both directions on a single bus because there is
 * genuinely one WebSocket; a packet's direction is its travel sign.
 */
type Layout = {
  w: number
  h: number
  bus: string
  vias: [number, number][]
  mac: { left: number; top: number; width: number; height: number }
  phone: { left: number; top: number; width: number; height: number }
  menuBar: boolean
}

const WIDE: Layout = {
  w: 780,
  h: 480,
  bus: 'M 250 390 V 424 Q 250 452 278 452 H 623 Q 651 452 651 424',
  vias: [
    [250, 452],
    [651, 452],
  ],
  mac: { left: 40, top: 140, width: 420, height: 250 },
  phone: { left: 546, top: 30, width: 210, height: 394 },
  menuBar: true,
}

const COMPACT: Layout = {
  w: 380,
  h: 545,
  bus: 'M 150 196 V 206 Q 150 222 134 222 H 32 Q 16 222 16 238 V 302 Q 16 318 32 318 H 178',
  vias: [
    [16, 222],
    [16, 318],
  ],
  mac: { left: 0, top: 0, width: 318, height: 196 },
  phone: { left: 178, top: 215, width: 182, height: 330 },
  menuBar: false,
}

const COMPACT_BELOW = 640

type Payload = {
  id: number
  kind: string
  label: string
  dir: 'up' | 'down' // up = phone → Mac
  tone?: 'amber' | 'green'
}

const SCRIPT: Omit<Payload, 'id'>[] = [
  { kind: 'clip', label: 'Copied from Chrome', dir: 'up' },
  { kind: 'notif', label: 'Priya · “see you at 8”', dir: 'up' },
  { kind: 'file', label: 'IMG_2841.HEIC · 4.2 MB', dir: 'down' },
  { kind: 'sms', label: 'Reply sent from keyboard', dir: 'down' },
  { kind: 'h264', label: 'Mirror · 1080×2400 · 60fps', dir: 'up', tone: 'green' },
  { kind: 'clip', label: 'sk-live-•••• pasted', dir: 'down' },
]

/* Rows that have already landed in the Mac window. */
type LogRow = { id: number; kind: string; label: string; dir: 'up' | 'down' }

export function LinkStage() {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const step = useRef(0)
  const seq = useRef(0)

  const { layout, scale } = useStageLayout(stageRef)

  const [inFlight, setInFlight] = useState<Payload[]>([])
  const [log, setLog] = useState<LogRow[]>([
    { id: -5, kind: 'notif', label: 'Ride · driver arriving', dir: 'up' },
    { id: -4, kind: 'file', label: 'scan.pdf · 820 KB', dir: 'down' },
    { id: -3, kind: 'clip', label: '“192.168.1.24”', dir: 'up' },
    { id: -2, kind: 'link', label: 'Paired with Pixel 8', dir: 'up' },
  ])

  const send = useCallback(() => {
    const spec = SCRIPT[step.current % SCRIPT.length]
    step.current += 1
    const id = seq.current++
    const packet: Payload = { ...spec, id }

    setInFlight((cur) => [...cur, packet])

    // Land it in the log when it reaches the far end of the wire.
    window.setTimeout(() => {
      setInFlight((cur) => cur.filter((p) => p.id !== id))
      setLog((cur) => [{ id, kind: spec.kind, label: spec.label, dir: spec.dir }, ...cur].slice(0, 5))
    }, 2100)
  }, [])

  useLoop(stageRef, 2500, send, !reduced)

  return (
    <div
      ref={stageRef}
      className="relative w-full"
      style={{ aspectRatio: `${layout.w} / ${layout.h}` }}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: layout.w, height: layout.h, transform: `scale(${scale})` }}
      >
        <Bus layout={layout} reduced={reduced} />

        <AnimatePresence>
          {inFlight.map((p) => (
            <Packet key={p.id} payload={p} bus={layout.bus} />
          ))}
        </AnimatePresence>

        {layout.menuBar && <MenuBarPanel />}
        <MacWindow log={log} rect={layout.mac} />
        <Phone reduced={reduced} rect={layout.phone} />
      </div>
    </div>
  )
}

/**
 * Pick the layout for the space we actually have, then fit it.
 *
 * The fit is measured rather than done in CSS because `scale()` takes a
 * number, and `calc(100cqw / 780)` resolves to a *length* — the
 * declaration is dropped and the stage silently overflows its column.
 * Capped at 1 so the stage never upscales into soft text.
 */
function useStageLayout(ref: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ layout: WIDE, scale: 1 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const layout = w < COMPACT_BELOW ? COMPACT : WIDE
      setState({ layout, scale: Math.min(1, w / layout.w) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return state
}

/* ------------------------------------------------------------------ *
 * The wire
 * ------------------------------------------------------------------ */
function Bus({ layout, reduced }: { layout: Layout; reduced: boolean }) {
  return (
    <svg
      className="absolute inset-0 overflow-visible"
      width={layout.w}
      height={layout.h}
      fill="none"
    >
      {/* faint parallel guides — a bus, not a lone hairline */}
      <path d={layout.bus} stroke="var(--color-line)" strokeWidth={9} strokeLinecap="round" opacity={0.5} />
      <motion.path
        d={layout.bus}
        stroke="var(--color-amber-ink)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={reduced ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ duration: 1.5, delay: 0.5, ease: EASE_EXPO }}
      />
      {/* solder vias at the two bends */}
      {layout.vias.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={4.5} fill="var(--color-ink)" stroke="var(--color-line-2)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={1.5} fill="var(--color-amber-ink)" opacity={0.8} />
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * A packet riding the wire
 * ------------------------------------------------------------------ */
function Packet({ payload, bus }: { payload: Payload; bus: string }) {
  const { kind, label, dir, tone = 'amber' } = payload
  const from = dir === 'up' ? '100%' : '0%'
  const to = dir === 'up' ? '0%' : '100%'

  return (
    <motion.div
      className="absolute top-0 left-0 flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2.5 text-[11px] whitespace-nowrap backdrop-blur-[2px]"
      style={{
        offsetPath: `path("${bus}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center',
        background: 'color-mix(in oklch, var(--color-panel-2) 92%, transparent)',
        borderColor:
          tone === 'green'
            ? 'color-mix(in oklch, var(--color-green) 45%, transparent)'
            : 'color-mix(in oklch, var(--color-amber) 45%, transparent)',
        boxShadow: '0 6px 20px -6px rgb(0 0 0 / 0.8)',
      }}
      initial={{ offsetDistance: from, opacity: 0, scale: 0.9 }}
      animate={{
        offsetDistance: to,
        opacity: [0, 1, 1, 0],
        scale: 1,
        transition: {
          offsetDistance: { duration: 2.1, ease: [0.5, 0, 0.5, 1] },
          opacity: { duration: 2.1, times: [0, 0.14, 0.8, 1], ease: 'linear' },
          scale: { duration: 0.3, ease: EASE_QUINT },
        },
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.22 } }}
    >
      <span
        className={`readout rounded-full px-1.5 py-px text-[9px] ${
          tone === 'green' ? 'bg-green/15 text-green' : 'bg-amber/15 text-amber-ink'
        }`}
      >
        {kind}
      </span>
      <span className="font-medium text-fg">{label}</span>
      <span className={`${tone === 'green' ? 'text-green' : 'text-amber-ink'} text-[10px]`}>
        {dir === 'up' ? '↑' : '↓'}
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Mac window — receives, and shows what landed
 * ------------------------------------------------------------------ */
const TABS = ['Files', 'Photos', 'Messages', 'Mirror', 'Apps'] as const

type Rect = { left: number; top: number; width: number; height: number }

function MacWindow({ log, rect }: { log: LogRow[]; rect: Rect }) {
  return (
    <div
      className="on-dark etched absolute overflow-hidden rounded-xl border border-line-2 bg-panel"
      style={rect}
    >
      {/* title bar */}
      <div className="flex h-9 items-center gap-2 border-b border-line/80 bg-panel-2/70 px-3">
        <span className="flex gap-1.5">
          {['#3f3f47', '#3f3f47', '#3f3f47'].map((c, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className="readout ml-1 text-[10px] text-fg-2">DroidDock</span>
        <span className="ml-auto flex items-center gap-1.5">
          <Lamp tone="green" size={5} />
          <span className="readout text-[9px] text-fg-3">Pixel 8</span>
        </span>
      </div>

      {/* tab strip */}
      <div className="flex items-center gap-4 border-b border-line/70 px-3">
        {TABS.map((t, i) => (
          <span
            key={t}
            className={`relative py-2 text-[11px] ${i === 0 ? 'text-fg' : 'text-fg-4'}`}
          >
            {t}
            {i === 0 && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber" />}
          </span>
        ))}
      </div>

      {/* live arrivals */}
      <div className="px-3 py-2">
        <div className="readout mb-2 text-[9px] text-fg-4">Activity</div>
        <ul className="space-y-1 overflow-hidden" style={{ height: rect.height - 108 }}>
          <AnimatePresence initial={false}>
            {log.map((row) => (
              <motion.li
                key={row.id}
                layout
                initial={{ opacity: 0, x: row.dir === 'up' ? 18 : -18, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 26 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: EASE_QUINT }}
                className="flex items-center gap-2 overflow-hidden rounded border border-line/60 bg-panel-2/50 px-2 text-[11px]"
              >
                <span className="readout w-11 shrink-0 text-[9px] text-amber-ink">{row.kind}</span>
                <span className="truncate text-fg-2">{row.label}</span>
                <span className="readout ml-auto shrink-0 text-[9px] text-fg-4">
                  {row.dir === 'up' ? 'in' : 'out'}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Phone — the source
 * ------------------------------------------------------------------ */
function Phone({ reduced, rect }: { reduced: boolean; rect: Rect }) {
  // At the compact width the transport keys crowd the track title out of
  // existence; the card still carries the point without them.
  const roomy = rect.width >= 200

  return (
    <div
      className="on-dark absolute rounded-[30px] border border-line-2 bg-panel p-[7px] shadow-[0_28px_60px_-24px_rgb(0_0_0/0.9)]"
      style={rect}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-ink">
        {/* ambient wallpaper wash — the app renders the real wallpaper here */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(110% 70% at 50% 0%, color-mix(in oklch, var(--color-amber) 13%, transparent), transparent 62%)',
          }}
        />

        {/* status bar + pill */}
        <div className="relative flex items-center justify-between px-4 pt-3">
          <span className="readout text-[9px] text-fg-2">9:41</span>
          <span className="absolute left-1/2 h-4 w-14 -translate-x-1/2 rounded-full bg-ink" />
          <span className="readout flex items-center gap-1 text-[9px] text-fg-2">
            <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={i * 3}
                  y={6 - (i + 1) * 1.5}
                  width="2"
                  height={(i + 1) * 1.5}
                  rx="0.5"
                  fill="currentColor"
                />
              ))}
            </svg>
            82
          </span>
        </div>

        {/* connection hero card — mirrors the Android app's home screen */}
        <div className="relative mx-3 mt-5 rounded-2xl border border-green/25 bg-panel-2/70 p-3">
          <div className="flex items-center gap-2">
            <Lamp tone="green" size={6} pulse={!reduced} />
            <span className="text-[11px] font-semibold text-fg">MacBook Air</span>
          </div>
          <div className="readout mt-1.5 text-[8.5px] text-fg-3">Connected · 2 ms</div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-green"
              initial={{ width: '0%' }}
              animate={{ width: '78%' }}
              transition={{ duration: 1.4, delay: 1, ease: EASE_EXPO }}
            />
          </div>
          <div className="readout mt-1.5 flex justify-between text-[8px] text-fg-4">
            <span>Mac battery</span>
            <span>78%</span>
          </div>
        </div>

        {/* the Mac's now-playing, on the phone */}
        <div className="relative mx-3 mt-2.5 flex items-center gap-2.5 rounded-2xl border border-line/70 bg-panel/60 p-2.5">
          <span className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-amber/70 to-amber-dim/40" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10px] font-medium text-fg">Weightless</span>
            <span className="readout block truncate text-[8px] text-fg-4">Marconi Union</span>
          </span>
          {roomy && (
            <span className="flex shrink-0 gap-1.5 text-fg-3">
              {['◀◀', '❚❚', '▶▶'].map((g) => (
                <span key={g} className="text-[8px]">
                  {g}
                </span>
              ))}
            </span>
          )}
        </div>

        {/* quick tiles */}
        <div className="relative mx-3 mt-2.5 grid grid-cols-2 gap-2">
          {[
            ['Clipboard', 'Auto'],
            ['Mirror', 'Ready'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-line/70 bg-panel/50 px-2.5 py-2">
              <div className="text-[9.5px] text-fg-2">{k}</div>
              <div className="readout mt-0.5 text-[8px] text-amber-ink">{v}</div>
            </div>
          ))}
        </div>

        {/* nav bar */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <span className="h-1 w-20 rounded-full bg-line-2" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * The menu-bar panel — battery, now-playing and notifications without
 * opening the app. It fills the stage's upper-left, and it's a real
 * feature rather than decoration put there to balance the composition.
 * ------------------------------------------------------------------ */
function MenuBarPanel() {
  return (
    <div
      className="on-dark etched absolute overflow-hidden rounded-lg border border-line-2 bg-panel-2/95 backdrop-blur-sm"
      style={{ left: 0, top: 0, width: 258, height: 118 }}
    >
      <div className="flex items-center gap-2 border-b border-line/70 px-3 py-1.5">
        <img src={url('/droiddock-icon.png')} alt="" width={13} height={13} className="rounded-[3px]" />
        <span className="readout text-[8px] text-fg-2">Menu bar</span>
        <span className="ml-auto flex items-center gap-1">
          <Lamp tone="green" size={4} />
          <span className="readout text-[7px] text-green">Pixel 8</span>
        </span>
      </div>

      <div className="px-3 py-2">
        {/* phone battery, read from the other device */}
        <div className="flex items-center gap-2">
          <span className="readout w-12 shrink-0 text-[7.5px] text-fg-4">Battery</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full w-[82%] rounded-full bg-green" />
          </span>
          <span className="readout text-[7.5px] text-fg-2">82%</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="readout w-12 shrink-0 text-[7.5px] text-fg-4">Link</span>
          <span className="readout text-[7.5px] text-fg-2">LAN · 2 ms · strong</span>
        </div>

        <div className="mt-2.5 flex items-center gap-2 rounded border border-line/70 bg-panel/60 px-2 py-1.5">
          <span className="h-5 w-5 shrink-0 rounded bg-green/70" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[9px] text-fg">Priya · 2 messages</span>
            <span className="readout block text-[7px] text-fg-4">tap to reply</span>
          </span>
        </div>
      </div>
    </div>
  )
}
