import { motion } from 'motion/react'
import { EASE_QUINT, inView, settle, stagger } from '../lib/motion'
import { Clip } from '../ui/Clip'
import { url } from '../lib/paths'
import { Container, Lamp, Readout, Section } from '../ui/primitives'

/* The real pipeline, named in the order it actually runs. */
const PIPELINE = ['MediaProjection', 'MediaCodec H.264', 'LAN WebSocket', 'WebCodecs', 'canvas']

export function Mirror() {
  return (
    <Section id="mirror" pad="xl">
      <Container>
        <div className="grid items-center gap-x-14 gap-y-14 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-6"
            variants={stagger()}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            <motion.div variants={settle} className="mb-5 flex items-center gap-2.5">
              <Lamp size={6} />
              <Readout className="text-amber-ink">Screen mirror &amp; control</Readout>
            </motion.div>

            <motion.h2 variants={settle} className="display text-[clamp(2rem,4.4vw,3.2rem)]">
              Mirror it.
              <br /> Then actually use it.
            </motion.h2>

            <motion.p variants={settle} className="measure mt-6 text-fg-2">
              The phone encodes its screen with MediaProjection and MediaCodec; the Mac decodes it
              with WebCodecs and paints it to a canvas. Tap, swipe, scroll, type and press the nav
              bar — every input is injected back through the accessibility service. It pops out
              into a phone-shaped, always-on-top window that sits beside your work.
            </motion.p>

            <motion.p variants={settle} className="measure mt-4 text-fg-2">
              Grant <span className="text-fg">Display over other apps</span> once and Auto Mirror
              skips the per-session tap on the phone entirely. Desktop mode mirrors a virtual
              display instead, so the phone itself stays usable while you work on the Mac.
            </motion.p>

            <motion.div variants={settle} className="mt-9">
              <Readout className="text-fg-4">Signal path</Readout>
              <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                {PIPELINE.map((stage, i) => (
                  <li key={stage} className="flex items-center gap-2">
                    <span className="readout rounded border border-line-2 bg-panel px-2 py-1 text-[9.5px] text-fg-2">
                      {stage}
                    </span>
                    {i < PIPELINE.length - 1 && (
                      <span className="text-amber-ink/60" aria-hidden="true">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>

          {/* The real thing: consent prompt, window opens, live home screen. */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_QUINT }}
          >
            <Clip
              src={url('/clips/mirror')}
              poster={url('/shots/mac-mirror.webp')}
              width={1120}
              height={720}
              label="Screen recording: DroidDock asks the phone to approve capture, then the mirror window opens and shows the live Android home screen"
            />
            <p className="readout mt-4 text-[9px] text-fg-4">
              Recorded on a MacBook Air M1 · Galaxy S21 FE · no ADB, no scrcpy
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
