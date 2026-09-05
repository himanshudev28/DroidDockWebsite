import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Pointer } from './ui/Pointer'

/**
 * Everything every page shares. `reducedMotion="user"` strips transform
 * animations for anyone who asked the OS for less motion, leaving a
 * crossfade — the CSS media query in index.css can't do that on its own,
 * because it has no effect on JS-driven animation.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Pointer />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </MotionConfig>
  )
}
