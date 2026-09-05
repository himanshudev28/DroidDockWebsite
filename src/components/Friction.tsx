import { motion } from 'motion/react'
import { NOT_NEEDED } from '../lib/content'
import { EASE_QUINT, inView, settle, stagger } from '../lib/motion'
import { Container, Section } from '../ui/primitives'

/**
 * Every other way of getting Android onto a Mac starts with a
 * prerequisite. This band is the argument, and it's the whole reason the
 * product exists — so it gets its own fold rather than a bullet.
 */
export function Friction() {
  return (
    <Section id="why" pad="lg" className="overflow-hidden">
      <Container>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-5"
            variants={stagger()}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            <motion.h2 variants={settle} className="display text-[clamp(1.9rem,4vw,2.9rem)]">
              What it doesn't need.
            </motion.h2>
            <motion.p variants={settle} className="measure mt-5 text-fg-2">
              Screen mirroring on a Mac has always meant a terminal, a toolchain, and a phone put
              into developer mode. DroidDock does the mirroring, the input injection and the file
              transfer over the same Wi-Fi link the rest of the app already uses.
            </motion.p>
          </motion.div>

          <motion.ul
            className="lg:col-span-7 lg:pt-2"
            variants={stagger(0.15, 0.09)}
            initial="hidden"
            whileInView="shown"
            viewport={inView}
          >
            {NOT_NEEDED.map((item) => (
              <motion.li
                key={item.term}
                variants={settle}
                className="grid grid-cols-1 items-baseline gap-x-6 gap-y-1.5 border-b border-line/70 py-5 last:border-b-0 sm:grid-cols-[1fr_1.1fr]"
              >
                <span className="relative justify-self-start text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium text-fg-3">
                  {item.term}
                  {/* the strike is the point — draw it, don't just render it */}
                  <motion.span
                    className="absolute top-1/2 left-0 h-[2px] w-full origin-left bg-amber-ink"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.45, ease: EASE_QUINT, delay: 0.18 }}
                  />
                </span>
                <span className="text-[0.9375rem] text-fg-3">
                  <span className="readout mr-2 text-[9px] text-amber-ink">instead</span>
                  {item.instead}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </Section>
  )
}
