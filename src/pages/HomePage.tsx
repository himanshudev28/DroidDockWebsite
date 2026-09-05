import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Shell } from '../Shell'
import { Clipboard } from '../components/Clipboard'
import { FeatureIndex } from '../components/FeatureIndex'
import { Friction } from '../components/Friction'
import { Hero } from '../components/Hero'
import { Install } from '../components/Install'
import { Mirror } from '../components/Mirror'
import { Notifications } from '../components/Notifications'
import { Protocol } from '../components/Protocol'
import { Scope } from '../components/Scope'
import { Showcase } from '../components/Showcase'

export function HomePage() {
  return (
    <>
      <ScrollRail />
      <Shell>
        <Hero />
        <Friction />
        <Showcase />
        <Mirror />
        <Clipboard />
        <Notifications />
        <FeatureIndex />
        <Protocol />
        <Install />
        <Scope />
      </Shell>
    </>
  )
}

/**
 * The hero's trace, continued down the page as a position indicator: a
 * wire that fills as you travel it, with a lamp riding the head. Hidden
 * below 1460px, where the container leaves it no margin to sit in, and
 * aria-hidden because it duplicates the scrollbar.
 */
function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.0005 })
  const headTop = useTransform(fill, (p) => `calc(${(p * 100).toFixed(3)}% - 3.5px)`)

  return (
    <div
      className="pointer-events-none fixed top-24 bottom-24 left-7 hidden w-px [@media(min-width:1460px)]:block"
      style={{ zIndex: 'var(--z-rail)' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-line-2/70" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-amber-ink"
        style={{ scaleY: fill }}
      />
      <motion.span
        className="lamp absolute -left-[3px] block h-[7px] w-[7px] rounded-full bg-amber-ink"
        style={{ top: headTop }}
      />
    </div>
  )
}
