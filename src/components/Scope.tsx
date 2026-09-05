import { motion } from 'motion/react'
import { RELEASE, SCOPE } from '../lib/content'
import { inView, settle, stagger } from '../lib/motion'
import { Container, Heading, Readout, Section } from '../ui/primitives'

/**
 * The limits, stated plainly. This section exists because the README
 * states them plainly, and because a page that only lists strengths is
 * not describing software anyone actually shipped.
 */
export function Scope() {
  return (
    <Section id="scope" pad="xl">
      <Container>
        <Heading
          title="What it doesn't do."
          lede="Known limits, in the same words the README uses. None of these are secrets, and none of them are being worked around with careful phrasing."
          className="max-w-2xl"
        />

        <motion.dl
          className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-x-12 md:grid-cols-2"
          variants={stagger(0, 0.06)}
          initial="hidden"
          whileInView="shown"
          viewport={inView}
        >
          {SCOPE.map((s, i) => (
            <motion.div
              key={s.title}
              variants={settle}
              className="border-t border-line-2 py-6"
            >
              <dt className="flex items-baseline gap-3">
                <Readout className="shrink-0 text-[9px] text-fg-4 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </Readout>
                <span className="text-[1.0625rem] font-semibold text-fg">{s.title}</span>
              </dt>
              <dd className="mt-2.5 pl-8 text-[0.9375rem] leading-relaxed text-fg-3">{s.body}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.p
          variants={settle}
          initial="hidden"
          whileInView="shown"
          viewport={inView}
          className="measure mt-10 border-t border-line-2 pt-7 text-fg-2"
        >
          Found another one?{' '}
          <a
            href={RELEASE.issues}
            target="_blank"
            rel="noreferrer noopener"
            className="text-amber-ink underline decoration-amber-ink/40 underline-offset-4 transition-colors hover:decoration-amber-ink"
          >
            Open an issue
          </a>{' '}
          with your Android and macOS versions. Everyone who contributes gets credited in the
          release notes.
        </motion.p>
      </Container>
    </Section>
  )
}
