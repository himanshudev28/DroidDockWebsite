import { motion } from 'motion/react'
import { useState } from 'react'
import { url } from '../lib/paths'
import { EASE_QUINT, inView, settle, stagger } from '../lib/motion'
import { Container, Heading, Lamp, Readout, Section } from '../ui/primitives'

/* Real captures from the shipping build — not mockups. */
const MAC_VIEWS = [
  {
    id: 'dashboard',
    tab: 'Dashboard',
    file: 'mac-dashboard',
    caption:
      "The phone card stays pinned beside whatever tab you're in — wallpaper, live clock, battery, and one-tap Files, Messages and Mirror.",
    alt: "DroidDock on macOS: a phone card showing the Samsung's wallpaper and a 12:56 clock beside a panel reading 73% battery and Android 16",
  },
  {
    id: 'apps',
    tab: 'Apps',
    file: 'mac-apps',
    caption:
      'Every launchable app with its real icon, pulled from the phone. Prefix-ranked search, and any app can open in its own Mac window.',
    alt: "DroidDock's Apps tab: a dense grid of real Android app icons read off the connected phone",
  },
  {
    id: 'notifications',
    tab: 'Notifications',
    file: 'mac-notifications',
    caption:
      'Phone notifications land on the Mac with their app icon and body text. Reply inline, dismiss, or mute the app that keeps interrupting.',
    alt: 'DroidDock Notifications tab listing mirrored Android notifications with app icons and timestamps',
  },
  {
    id: 'mirror',
    tab: 'Mirror',
    file: 'mac-mirror',
    caption:
      "The pop-out mirror window, always on top and shaped like the phone. The Android home screen here is live — it's taking clicks from the Mac.",
    alt: 'A phone-shaped always-on-top window on the Mac showing the live Android home screen with its wallpaper and dock',
  },
] as const

const PHONE_VIEWS = [
  {
    file: 'phone-home',
    title: 'Home',
    body: "The Mac's status on your phone: connected, its IP, its battery, and what it's playing — with transport keys that actually drive it.",
    alt: "DroidDock's Android home screen showing MacBook Air M1 connected at 192.168.1.31:48484, 46% battery, and a Playing on your Mac card",
  },
  {
    file: 'phone-clipboard',
    title: 'Clipboard',
    body: "This session's clips in both directions, held in memory and cleared when the app closes.",
    alt: "DroidDock's Android Clipboard tab with a History toggle and an empty shared-clips list",
  },
  {
    file: 'phone-control',
    title: 'Control',
    body: 'A trackpad and a full keyboard for the Mac — useful from across the room, or when the Mac is on a shelf.',
    alt: "DroidDock's Android Control tab showing a trackpad area above arrow keys and Enter, Esc, Space and Tab keys",
  },
] as const

export function Showcase() {
  const [active, setActive] = useState(0)
  const view = MAC_VIEWS[active]

  return (
    <Section id="app" pad="xl" className="bg-panel/40">
      <Container>
        <Heading
          title="This is the actual app."
          lede="Screenshots from the shipping build, not renders. The Mac client is a native Rust binary in a ~6 MB bundle — the whole window below is Tauri, not a packaged browser."
          className="max-w-3xl"
        />

        {/* ---------------- Mac ---------------- */}
        <motion.div
          className="mt-[clamp(2.5rem,5vw,4rem)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease: EASE_QUINT }}
        >
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
            {/* A vertical rail of views, echoing the app's own sidebar. */}
            <div
              role="tablist"
              aria-label="DroidDock for macOS"
              aria-orientation="vertical"
              className="flex gap-1.5 overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-4 lg:flex-col lg:overflow-visible lg:pr-0 lg:[mask-image:none]"
            >
              {MAC_VIEWS.map((v, i) => (
                <button
                  key={v.id}
                  role="tab"
                  type="button"
                  id={`shot-tab-${v.id}`}
                  aria-selected={i === active}
                  aria-controls={`shot-panel-${v.id}`}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-left text-[0.875rem] font-medium transition-colors duration-200 lg:shrink ${
                    i === active
                      ? 'border-amber/40 bg-amber/10 text-fg'
                      : 'border-transparent text-fg-3 hover:text-fg-2'
                  }`}
                >
                  <Lamp on={i === active} size={5} />
                  {v.tab}
                </button>
              ))}
              <p className="measure mt-4 hidden text-[0.875rem] leading-relaxed text-fg-3 lg:block">
                {view.caption}
              </p>
            </div>

            <div
              role="tabpanel"
              id={`shot-panel-${view.id}`}
              aria-labelledby={`shot-tab-${view.id}`}
              className="on-dark overflow-hidden rounded-xl border border-line-2 bg-ink shadow-[0_40px_90px_-40px_rgb(0_0_0/0.95)] lg:col-span-8"
            >
              {/* All four stay mounted and stacked so switching is instant
                  and never flashes an empty frame. ~25-70 KB each. */}
              <div className="relative" style={{ aspectRatio: '1120 / 720' }}>
                {MAC_VIEWS.map((v, i) => (
                  <motion.img
                    key={v.id}
                    src={url(`/shots/${v.file}.webp`)}
                    srcSet={`${url(`/shots/${v.file}.webp`)} 560w, ${url(`/shots/${v.file}@2x.webp`)} 1120w`}
                    sizes="(min-width: 1024px) 54vw, 92vw"
                    width={1120}
                    height={720}
                    alt={v.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    animate={{ opacity: i === active ? 1 : 0 }}
                    transition={{ duration: 0.32, ease: EASE_QUINT }}
                    aria-hidden={i !== active}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="measure mt-5 text-[0.9375rem] text-fg-3 lg:hidden">{view.caption}</p>
        </motion.div>

        {/* ---------------- Phone ---------------- */}
        <motion.div
          className="mt-[clamp(3.5rem,7vw,6rem)]"
          variants={stagger(0, 0.08)}
          initial="hidden"
          whileInView="shown"
          viewport={inView}
        >
          <motion.div variants={settle} className="mb-8 flex items-center gap-2.5">
            <Lamp size={6} />
            <Readout className="text-amber-ink">And on the phone</Readout>
          </motion.div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {PHONE_VIEWS.map((v) => (
              <motion.figure key={v.file} variants={settle} className="m-0">
                <div className="on-dark mx-auto max-w-[240px] rounded-[26px] border border-line-2 bg-panel p-[6px] shadow-[0_28px_60px_-30px_rgb(0_0_0/0.9)]">
                  <img
                    src={url(`/shots/${v.file}.webp`)}
                    srcSet={`${url(`/shots/${v.file}.webp`)} 360w, ${url(`/shots/${v.file}@2x.webp`)} 720w`}
                    sizes="240px"
                    width={720}
                    height={1560}
                    alt={v.alt}
                    loading="lazy"
                    decoding="async"
                    className="block w-full rounded-[21px]"
                  />
                </div>
                <figcaption className="mt-5">
                  <h3 className="text-[1rem] font-semibold text-fg">{v.title}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-fg-3">{v.body}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
