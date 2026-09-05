import { useEffect, useState } from 'react'
import type { Transition, Variants } from 'motion/react'

/* Exponential ease-outs, mirroring the CSS tokens. No bounce, no elastic. */
export const EASE_QUART = [0.25, 1, 0.5, 1] as const
export const EASE_QUINT = [0.22, 1, 0.36, 1] as const
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const

export const springy: Transition = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }

/**
 * The site's one repeated entrance. Deliberately small — 14px of travel,
 * not the 60px "fade-and-rise on every section" that reads as AI grammar.
 * It exists to settle content, not to announce it.
 */
export const settle: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_QUINT },
  },
}

export const stagger = (delayChildren = 0, staggerChildren = 0.055): Variants => ({
  hidden: {},
  shown: { transition: { delayChildren, staggerChildren } },
})

/**
 * Shared viewport config so reveals fire at a consistent point.
 *
 * `amount: 'some'` rather than a fraction on purpose. Several of these
 * wrappers (the capability groups, the limits list) are taller than the
 * viewport, and a fractional threshold on a very tall element can be
 * skipped entirely by a fast flick-scroll — leaving the section stuck at
 * opacity 0 because the reveal is `once`. "Any part visible" is always
 * satisfiable; the negative bottom margin still delays the trigger until
 * the block has genuinely started entering.
 */
export const inView = { once: true, amount: 'some', margin: '0px 0px -10% 0px' } as const

/**
 * Live-updating reduced-motion flag. Motion's own hook only reads the
 * value at mount in some versions; this one tracks changes, which matters
 * because the ambient loops (packets, lamps) need to stop the moment a
 * user flips the OS setting.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Runs `tick` on a cadence, but only while the element is on screen and
 * the tab is visible. Ambient loops that keep running in a background tab
 * are the reason "pretty" landing pages drain batteries.
 */
export function useLoop(
  ref: React.RefObject<Element | null>,
  intervalMs: number,
  tick: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    let timer: number | undefined
    let onScreen = false

    const start = () => {
      if (timer !== undefined) return
      timer = window.setInterval(() => {
        if (document.visibilityState === 'visible') tick()
      }, intervalMs)
    }
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer)
      timer = undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        onScreen ? start() : stop()
      },
      { threshold: 0.15 },
    )
    io.observe(el)

    const onVis = () => {
      if (document.visibilityState === 'hidden') stop()
      else if (onScreen) start()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      stop()
    }
  }, [ref, intervalMs, tick, enabled])
}
