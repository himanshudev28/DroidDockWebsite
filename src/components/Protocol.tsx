import { motion } from 'motion/react'
import { RELEASE } from '../lib/content'
import { inView, settle, stagger, useReducedMotion } from '../lib/motion'
import { Container, Heading, Lamp, Readout, Section } from '../ui/primitives'

const MAC = {
  label: 'Mac',
  sub: 'Tauri 2 · Rust + React',
  parts: ['React UI', `WebSocket server :${RELEASE.port}`, 'ADB — optional fallback'],
}

const PHONE = {
  label: 'Android',
  sub: 'Kotlin · Jetpack Compose',
  parts: ['BridgeService (foreground)', 'ConnectionManager', 'MirrorService · H.264', 'AccessibilityService'],
}

const LANES = [
  {
    id: 'json',
    name: 'JSON control',
    detail: 'request / response, keyed by reqId',
    tone: 'amber' as const,
    both: true,
  },
  {
    id: 'binary',
    name: 'Binary frames',
    detail: 'file chunks · thumbnails · app icons · H.264',
    tone: 'green' as const,
    both: false,
  },
]

const FACTS = [
  { k: 'Transport', v: 'WebSocket over your LAN' },
  { k: 'Auth', v: 'Pairing token, exchanged by QR' },
  { k: 'Discovery', v: 'mDNS, plus remembered IPs' },
  { k: 'Leaves your network', v: 'Nothing' },
]

export function Protocol() {
  const reduced = useReducedMotion()

  return (
    <Section id="protocol" pad="xl" className="bg-panel/40">
      <Container>
        <Heading
          title="One socket, two lanes."
          lede="Both apps speak a token-gated WebSocket on your local network. Control messages are JSON keyed by request id; everything bulk — file chunks, thumbnails, app icons, mirror video — rides a compact binary frame protocol on the same connection."
          className="max-w-3xl"
        />

        <motion.div
          className="mt-[clamp(3rem,6vw,4.5rem)]"
          variants={stagger(0, 0.09)}
          initial="hidden"
          whileInView="shown"
          viewport={inView}
        >
          <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_minmax(0,1.15fr)_1fr]">
            <Endpoint node={MAC} align="left" variants={settle} />

            {/* the lanes */}
            <motion.div variants={settle} className="flex flex-col justify-center gap-6 py-2">
              {LANES.map((lane) => (
                <div key={lane.id}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="text-[0.8125rem] font-semibold text-fg">{lane.name}</span>
                    <Readout className="text-[8.5px] text-fg-4">
                      {lane.both ? 'both ways' : 'phone → mac'}
                    </Readout>
                  </div>

                  <div className="relative h-6">
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-2" />
                    {!reduced &&
                      [0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${
                            lane.tone === 'amber' ? 'bg-amber' : 'bg-green'
                          }`}
                          initial={{ left: lane.both && i % 2 ? '100%' : '0%', opacity: 0 }}
                          animate={{
                            left: lane.both && i % 2 ? '0%' : '100%',
                            opacity: [0, 1, 1, 0],
                          }}
                          transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            delay: i * 0.85,
                            ease: 'linear',
                          }}
                        />
                      ))}
                  </div>

                  <p className="readout mt-2 text-[8.5px] text-fg-4">{lane.detail}</p>
                </div>
              ))}
            </motion.div>

            <Endpoint node={PHONE} align="right" variants={settle} />
          </div>

          <motion.dl
            variants={settle}
            className="mt-10 grid gap-x-8 gap-y-5 border-t border-line-2 pt-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="readout text-[9px] text-fg-4">{f.k}</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-fg">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </Container>
    </Section>
  )
}

function Endpoint({
  node,
  align,
  variants,
}: {
  node: typeof MAC
  align: 'left' | 'right'
  variants: typeof settle
}) {
  return (
    <motion.div
      variants={variants}
      className="etched rounded-xl border border-line-2 bg-panel p-5"
    >
      <div className={`flex items-center gap-2.5 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <Lamp size={6} />
        <div className={align === 'right' ? 'lg:text-right' : ''}>
          <div className="text-[1.0625rem] font-bold text-fg">{node.label}</div>
          <Readout className="text-[9px]">{node.sub}</Readout>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {node.parts.map((p) => (
          <li
            key={p}
            className="rounded-md border border-line/70 bg-panel-2/50 px-3 py-2 text-[0.8125rem] text-fg-2"
          >
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
