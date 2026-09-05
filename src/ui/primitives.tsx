import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_QUINT, inView, settle, stagger } from '../lib/motion'

/* ------------------------------------------------------------------ *
 * Lamp — the amber indicator that runs through the whole site. Same
 * object as the app's status LED. Green is reserved for a link that is
 * genuinely up; it is never used as decoration.
 * ------------------------------------------------------------------ */
export function Lamp({
  on = true,
  tone = 'amber',
  pulse = false,
  size = 7,
}: {
  on?: boolean
  tone?: 'amber' | 'green'
  pulse?: boolean
  size?: number
}) {
  const colour = tone === 'green' ? 'bg-green' : 'bg-amber'
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className={[
          'block rounded-full transition-[background-color,box-shadow] duration-300',
          on ? `${colour} ${tone === 'green' ? 'lamp-green' : 'lamp'}` : 'bg-line-2',
        ].join(' ')}
        style={{ width: size, height: size }}
      />
      {on && pulse && (
        <motion.span
          className={`absolute inset-0 rounded-full ${colour}`}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2.8 }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </span>
  )
}

/* Instrument readout: a mono value strip. Mono is earned — these are
   literal ports, codecs, versions and byte counts. */
export function Readout({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={`readout ${className}`}>{children}</span>
}

/* ------------------------------------------------------------------ *
 * Section shell — owns the page's vertical rhythm and the hairline that
 * separates each band. Spacing deliberately varies by `pad`.
 * ------------------------------------------------------------------ */
export function Section({
  id,
  children,
  className = '',
  pad = 'lg',
  rule = true,
}: {
  id?: string
  children: ReactNode
  className?: string
  pad?: 'sm' | 'lg' | 'xl'
  rule?: boolean
}) {
  const padding =
    pad === 'sm'
      ? 'py-[clamp(3.5rem,7vw,5.5rem)]'
      : pad === 'xl'
        ? 'py-[clamp(6rem,13vw,11rem)]'
        : 'py-[clamp(5rem,10vw,8.5rem)]'

  return (
    <section
      id={id}
      className={`relative ${padding} ${rule ? 'border-t border-line/70' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

export function Container({
  children,
  className = '',
  wide = false,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${wide ? 'max-w-[104rem]' : 'max-w-[82rem]'} ${className}`}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Section heading. Note there is no repeated tiny-uppercase eyebrow —
 * `index` is an optional hard-edged marker used only where the page
 * genuinely benefits from an ordinal, not as scaffolding on every band.
 * ------------------------------------------------------------------ */
export function Heading({
  index,
  title,
  lede,
  className = '',
  align = 'left',
}: {
  index?: string
  title: ReactNode
  lede?: ReactNode
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <motion.div
      variants={stagger()}
      initial="hidden"
      whileInView="shown"
      viewport={inView}
      className={`${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
    >
      {index && (
        <motion.div variants={settle} className="mb-5 flex items-center gap-2.5">
          <Lamp size={6} />
          <Readout className="text-amber-ink">{index}</Readout>
        </motion.div>
      )}
      <motion.h2
        variants={settle}
        className="display text-[clamp(2rem,4.6vw,3.4rem)]"
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          variants={settle}
          className={`measure mt-5 text-[1.0625rem] text-fg-2 ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Buttons. Two weights only. Both are real anchors — nothing on this
 * page is a fake control.
 * ------------------------------------------------------------------ */
type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  icon?: ReactNode
  sub?: string
  className?: string
  external?: boolean
}

export function Button({
  href,
  children,
  variant = 'solid',
  icon,
  sub,
  className = '',
  external = true,
}: ButtonProps) {
  const base =
    'group relative inline-flex items-center gap-2.5 rounded-md px-5 py-3 text-[0.9375rem] font-semibold transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.985] motion-reduce:active:scale-100'

  const skin =
    variant === 'solid'
      ? 'bg-amber text-on-amber hover:bg-amber-hi'
      : variant === 'outline'
        ? 'border border-line-2 text-fg hover:border-amber hover:text-amber-ink bg-panel/60'
        : 'text-fg-2 hover:text-fg'

  return (
    <a
      href={href}
      className={`${base} ${skin} ${className}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span>{children}</span>
        {sub && (
          <span
            className={`readout mt-0.5 text-[0.625rem] ${
              variant === 'solid' ? 'text-on-amber/70' : 'text-fg-4'
            }`}
          >
            {sub}
          </span>
        )}
      </span>
    </a>
  )
}

/* A hairline that draws itself in on scroll — used to separate bands
   without another fade-and-rise block. */
export function DrawRule({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`h-px origin-left bg-line-2 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.85, ease: EASE_QUINT }}
    />
  )
}
