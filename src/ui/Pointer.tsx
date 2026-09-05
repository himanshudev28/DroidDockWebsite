import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/motion'

const INTERACTIVE = 'a[href], button, [role="radio"], [role="tab"], summary'
const TEXTUAL = 'input, textarea, select, [contenteditable="true"]'

type Mode = 'dot' | 'frame' | 'text'
type Frame = { x: number; y: number; w: number; h: number; r: number }

/**
 * The reticle.
 *
 * A dot that tracks the pointer exactly, plus corner brackets that snap
 * around whatever is under it — the same framing device as the app's QR
 * scan screen, which is where the idea comes from.
 *
 * It only exists for a fine pointer (mouse/trackpad) on a device that
 * hasn't asked for reduced motion. Touch, pen, and reduced-motion users
 * keep the native cursor and never load any of this behaviour. The
 * native cursor is only hidden once the reticle is actually live, so a
 * failure here can't leave anyone without a pointer.
 */
export function Pointer() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('dot')
  const [visible, setVisible] = useState(false)

  // raw pointer position — the dot rides this with no lag
  const px = useMotionValue(-100)
  const py = useMotionValue(-100)

  // the bracket box, spring-followed so it snaps rather than teleports
  const fx = useSpring(-100, { stiffness: 700, damping: 46, mass: 0.55 })
  const fy = useSpring(-100, { stiffness: 700, damping: 46, mass: 0.55 })
  const fw = useSpring(26, { stiffness: 620, damping: 44 })
  const fh = useSpring(26, { stiffness: 620, damping: 44 })
  const fr = useSpring(13, { stiffness: 620, damping: 44 })

  const target = useRef<Element | null>(null)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia?.('(pointer: fine)').matches) return
    setEnabled(true)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-reticle')
    return () => document.documentElement.classList.remove('has-reticle')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const put = (f: Frame) => {
      fx.set(f.x)
      fy.set(f.y)
      fw.set(f.w)
      fh.set(f.h)
      fr.set(f.r)
    }

    const frameFor = (el: Element): Frame => {
      const r = el.getBoundingClientRect()
      const pad = el.getAttribute('data-cursor') === 'tight' ? 3 : 6
      const radius = parseFloat(getComputedStyle(el).borderRadius) || 6
      return {
        x: r.left - pad,
        y: r.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
        r: radius + pad,
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px.set(e.clientX)
      py.set(e.clientY)
      setVisible(true)

      const el = e.target as Element | null
      const text = el?.closest?.(TEXTUAL) ?? null
      if (text) {
        target.current = null
        setMode('text')
        return
      }

      const hit = el?.closest?.(INTERACTIVE) ?? null
      if (hit) {
        target.current = hit
        setMode('frame')
        put(frameFor(hit))
      } else {
        target.current = null
        setMode('dot')
        put({ x: e.clientX - 13, y: e.clientY - 13, w: 26, h: 26, r: 13 })
      }
    }

    // The brackets are position: fixed, so a scroll under a held hover
    // would leave them behind.
    const onScroll = () => {
      const el = target.current
      if (!el) return
      if (!el.isConnected) {
        target.current = null
        setMode('dot')
        return
      }
      put(frameFor(el))
    }

    const hide = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled, px, py, fx, fy, fw, fh, fr])

  if (!enabled) return null

  const framed = mode === 'frame'
  const armLen = framed ? 9 : 5

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 'var(--z-pointer)' }}
    >
      {/* the corner brackets */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: fx, y: fy, width: fw, height: fh }}
        animate={{ opacity: visible && mode !== 'text' ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ borderRadius: framed ? 8 : 999 }}
          transition={{ duration: 0.2 }}
        >
          {(
            [
              ['top-0 left-0', 'border-t-2 border-l-2', 'rounded-tl-[6px]'],
              ['top-0 right-0', 'border-t-2 border-r-2', 'rounded-tr-[6px]'],
              ['bottom-0 left-0', 'border-b-2 border-l-2', 'rounded-bl-[6px]'],
              ['bottom-0 right-0', 'border-b-2 border-r-2', 'rounded-br-[6px]'],
            ] as const
          ).map(([pos, edges, round]) => (
            <motion.span
              key={pos}
              className={`absolute border-amber-ink ${pos} ${edges} ${round}`}
              animate={{ width: armLen, height: armLen, opacity: framed ? 1 : 0.75 }}
              transition={{ type: 'spring', stiffness: 620, damping: 40 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* the dot — no lag, so the pointer never feels rubbery */}
      <motion.span
        className="absolute top-0 left-0 block rounded-full bg-amber-ink"
        style={{ x: px, y: py, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible && mode === 'dot' ? 1 : 0,
          width: 5,
          height: 5,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  )
}
