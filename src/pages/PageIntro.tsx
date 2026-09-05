import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { settle, stagger } from '../lib/motion'
import { Container, Lamp, Readout } from '../ui/primitives'

/** The masthead every non-home page shares. */
export function PageIntro({
  kicker,
  title,
  lede,
  meta,
}: {
  kicker: string
  title: string
  lede: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="relative overflow-hidden border-b border-line/70 pt-28 pb-[clamp(2.5rem,5vw,4rem)] lg:pt-32">
      <div
        className="panel-grid pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(90% 70% at 30% 20%, black, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(90% 70% at 30% 20%, black, transparent 72%)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      <Container className="relative">
        <motion.div variants={stagger(0.05, 0.07)} initial="hidden" animate="shown">
          <motion.div variants={settle} className="mb-6 flex items-center gap-2.5">
            <Lamp size={6} />
            <Readout className="text-amber-ink">{kicker}</Readout>
          </motion.div>
          <motion.h1 variants={settle} className="display text-[clamp(2.1rem,4.6vw,3.5rem)]">
            {title}
          </motion.h1>
          <motion.p variants={settle} className="measure mt-5 text-[1.0625rem] text-fg-2">
            {lede}
          </motion.p>
          {meta && (
            <motion.div variants={settle} className="mt-7 border-t border-line/70 pt-5">
              {meta}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  )
}
