import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/motion'

/**
 * The instrument grid, lit where the pointer is.
 *
 * Two copies of the same grid: a dim one always on, and a brighter one
 * revealed through a radial mask that follows the cursor. Only the mask
 * position changes, so this is a compositor-only effect — no repaint of
 * the grid itself, and nothing runs at all on touch or reduced motion.
 */
export function SpotlightGrid({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia?.('(pointer: fine)').matches) return
    setOn(true)
  }, [reduced])

  useEffect(() => {
    if (!on) return
    const el = ref.current
    if (!el) return

    let raf = 0
    let pending: { x: number; y: number } | null = null

    const flush = () => {
      raf = 0
      if (!pending) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${pending.x - r.left}px`)
      el.style.setProperty('--my', `${pending.y - r.top}px`)
      pending = null
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pending = { x: e.clientX, y: e.clientY }
      el.style.setProperty('--lit', '1')
      if (!raf) raf = requestAnimationFrame(flush)
    }
    const onLeave = () => el.style.setProperty('--lit', '0')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [on])

  if (!on) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`panel-grid pointer-events-none absolute inset-0 ${className}`}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
          '--lit': '0',
          opacity: 'var(--lit)',
          transition: 'opacity 400ms var(--ease-out-quart)',
          maskImage:
            'radial-gradient(220px 220px at var(--mx) var(--my), black, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(220px 220px at var(--mx) var(--my), black, transparent 70%)',
        } as React.CSSProperties
      }
    />
  )
}
