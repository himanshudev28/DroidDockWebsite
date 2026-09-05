import { motion } from 'motion/react'
import { FEATURE_GROUPS } from '../lib/content'
import { inView, settle, stagger } from '../lib/motion'
import { Container, Heading, Readout, Section } from '../ui/primitives'

/**
 * The full capability list, as an index rather than a grid of identical
 * cards. Every row shows its detail at rest — nothing here is locked
 * behind a hover, because a hover is not an affordance on a phone.
 */
export function FeatureIndex() {
  return (
    <Section id="capabilities" pad="xl">
      <Container>
        <Heading
          title={<>Everything it carries.</>}
          lede="Four groups, one link. Everything listed here is in the shipping build; what isn't built yet is named further down, under the limits."
          className="max-w-3xl"
        />

        <div className="mt-[clamp(3rem,6vw,5rem)] space-y-px">
          {FEATURE_GROUPS.map((group, gi) => (
            <motion.div
              key={group.id}
              variants={stagger(0, 0.045)}
              initial="hidden"
              whileInView="shown"
              viewport={inView}
              className="grid gap-x-10 gap-y-6 border-t border-line-2 py-[clamp(2rem,4vw,3.25rem)] lg:grid-cols-12"
            >
              <motion.div variants={settle} className="lg:col-span-3">
                <div className="flex items-baseline gap-3">
                  <span
                    className="display text-[2.5rem] leading-none text-fg-4 tabular-nums"
                    aria-hidden="true"
                  >
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display text-[1.5rem]">{group.title}</h3>
                </div>
                <p className="mt-2 text-[0.9375rem] text-fg-3">{group.note}</p>
                <Readout className="mt-4 block text-[9px] text-fg-4">
                  {group.items.length} capabilities
                </Readout>
              </motion.div>

              <div className="lg:col-span-9">
                <dl className="grid gap-x-10 gap-y-0 md:grid-cols-2">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.name}
                      variants={settle}
                      className="group border-b border-line/60 py-4 last:border-b-0 md:last:border-b md:[&:nth-last-child(-n+1)]:border-b-0"
                    >
                      <dt className="flex items-center gap-2.5">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-2 transition-colors duration-300 group-hover:bg-amber"
                          aria-hidden="true"
                        />
                        <span className="text-[1rem] font-semibold text-fg">{item.name}</span>
                      </dt>
                      <dd className="mt-1.5 pl-4 text-[0.875rem] leading-relaxed text-fg-3">
                        {item.detail}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
