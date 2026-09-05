import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/motion'

/**
 * A muted, looping product clip.
 *
 * Autoplays only when the user hasn't asked for reduced motion — otherwise
 * it holds on the poster until they press play. Either way there's a real
 * control, because silently autoplaying video with no way to stop it is
 * the thing everyone hates about product pages.
 */
export function Clip({
  src,
  poster,
  width,
  height,
  label,
  className = '',
}: {
  src: string
  poster: string
  width: number
  height: number
  label: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(!reduced)

  // Don't burn a decoder on a clip nobody is looking at.
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => setPlaying(false))
        else el.pause()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }

  return (
    <div className={`on-dark group relative overflow-hidden rounded-xl border border-line-2 bg-ink shadow-[0_40px_90px_-40px_rgb(0_0_0/0.95)] ${className}`}>
      <video
        ref={ref}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        autoPlay={!reduced}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full"
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
        className="absolute right-3 bottom-3 flex h-9 items-center gap-2 rounded-full border border-line-2 bg-ink/85 px-3.5 text-[0.75rem] font-medium text-fg-2 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:opacity-100"
      >
        <span aria-hidden="true" className="text-amber-ink">
          {playing ? '❚❚' : '▶'}
        </span>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}
