import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Shell } from '../Shell'
import { RELEASE } from '../lib/content'
import { inView, settle, stagger } from '../lib/motion'
import { home } from '../lib/paths'
import { Container, Readout, Section } from '../ui/primitives'
import { PageIntro } from './PageIntro'
import { Code, Note, PermissionTable, Step } from './docs-parts'

const SECTIONS = [
  { id: 'requirements', title: 'Requirements' },
  { id: 'install-mac', title: 'Install on the Mac' },
  { id: 'install-android', title: 'Install on Android' },
  { id: 'permissions', title: 'Android permissions' },
  { id: 'pairing', title: 'Pairing' },
  { id: 'clipboard', title: 'Clipboard' },
  { id: 'files', title: 'Files & photos' },
  { id: 'alerts', title: 'Notifications, messages, calls' },
  { id: 'mirroring', title: 'Screen mirror & camera' },
  { id: 'reverse', title: 'Controlling the Mac' },
  { id: 'updating', title: 'Updating' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'uninstall', title: 'Uninstalling' },
  { id: 'source', title: 'Building from source' },
]

export function DocsPage() {
  return (
    <Shell>
      <PageIntro
        kicker={`Documentation · v${RELEASE.version}`}
        title="Getting DroidDock working."
        lede="Install, permissions, pairing, and every failure mode worth knowing about — including the ones that look like bugs but are Android and macOS doing what they're designed to do."
        meta={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Readout className="text-fg-4">Applies to v{RELEASE.version} and later</Readout>
            <a
              href={RELEASE.issues}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[0.875rem] text-amber-ink underline decoration-amber-ink/40 underline-offset-4 transition-colors hover:decoration-amber-ink"
            >
              Something missing? Open an issue
            </a>
          </div>
        }
      />

      <Section pad="lg" rule={false}>
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <Toc />
            <div className="prose-doc min-w-0 lg:col-span-8 xl:col-span-9">
              <Requirements />
              <InstallMac />
              <InstallAndroid />
              <Permissions />
              <Pairing />
              <ClipboardDoc />
              <FilesDoc />
              <AlertsDoc />
              <MirroringDoc />
              <ReverseDoc />
              <UpdatingDoc />
              <Troubleshooting />
              <Uninstall />
              <FromSource />
            </div>
          </div>
        </Container>
      </Section>
    </Shell>
  )
}

/* ------------------------------------------------------------------ */
function Toc() {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (shown) setActive(shown.target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <nav aria-label="On this page" className="min-w-0 lg:col-span-4 xl:col-span-3">
      <div className="lg:sticky lg:top-24">
        <Readout className="mb-4 block text-fg-4">On this page</Readout>
        <ol className="space-y-0.5 border-l border-line">
          {SECTIONS.map((s) => {
            const on = active === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? 'true' : undefined}
                  className="-ml-px block border-l-2 py-1.5 pl-4 text-[0.875rem] transition-colors duration-200"
                  style={{
                    borderColor: on ? 'var(--color-amber)' : 'transparent',
                    color: on ? 'var(--color-fg)' : 'var(--color-fg-3)',
                  }}
                >
                  {s.title}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

/* Each block is its own component purely so the page reads in order. */
function H({ id, children }: { id: string; children: string }) {
  return (
    <motion.h2
      id={id}
      variants={settle}
      initial="hidden"
      whileInView="shown"
      viewport={inView}
      className="scroll-mt-24"
    >
      {children}
    </motion.h2>
  )
}

function Requirements() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="requirements">Requirements</H>
      <ul>
        <li>
          <strong>A Mac with Apple Silicon.</strong> The published <code>.dmg</code> is
          <code> aarch64</code>. Intel Macs need a build from source.
        </li>
        <li>
          <strong>An Android phone.</strong> Everything core works on Android 8 and up; clipboard
          capture on Android 13+ and Samsung One UI uses the accessibility service rather than
          clipboard reads, which is handled for you.
        </li>
        <li>
          <strong>Both devices on the same Wi-Fi network.</strong> There is no cloud relay — if
          they can't see each other on the LAN, they can't connect.
        </li>
      </ul>
      <p>
        You do <strong>not</strong> need ADB, scrcpy, Developer Options, USB debugging, a cable, or
        an account. <code>adb</code> is downloaded on demand only if you deliberately use the
        optional power-user paths.
      </p>
    </motion.section>
  )
}

function InstallMac() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="install-mac">Install on the Mac</H>
      <Step n="1">
        Download <code>DroidDock_{RELEASE.version}_aarch64.dmg</code> from the{' '}
        <a href={RELEASE.releases} target="_blank" rel="noreferrer noopener">
          releases page
        </a>
        , open it, and drag <strong>DroidDock.app</strong> into Applications.
      </Step>
      <Step n="2">
        <strong>First launch only:</strong> right-click the app → <strong>Open</strong> → then{' '}
        <strong>Open</strong> in the dialog. A normal double-click will be refused.
      </Step>
      <Note>
        The build is ad-hoc signed rather than notarised, because notarisation requires a paid
        Apple Developer account. That's the whole reason for the right-click dance — it isn't a
        sign anything is wrong with the download. If macOS doesn't offer you an{' '}
        <strong>Open</strong> button at all, clear the quarantine flag instead:
      </Note>
      <Code>xattr -dr com.apple.quarantine /Applications/DroidDock.app</Code>
    </motion.section>
  )
}

function InstallAndroid() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="install-android">Install on Android</H>
      <Step n="1">
        Download <code>DroidDock-Android.apk</code> from the same release and open it.
      </Step>
      <Step n="2">
        Android will ask you to allow installs from unknown apps for whichever app you downloaded
        it with. Grant it, then install.
      </Step>
      <Step n="3">
        Open DroidDock and work through the permission prompts — each one maps to a feature, and
        skipping one just turns that feature off.
      </Step>
      <Note tone="warn">
        Upgrading from <strong>v1.0.0 or earlier</strong> needs a one-time uninstall and reinstall
        of the Android app. Releases up to v1.0.0 shipped a debug-signed APK whose key changed
        every build, and Android refuses to replace an APK with one signed by a different
        certificate. From v2.0.0 the APK is signed with a stable release key and updates in place.
      </Note>
    </motion.section>
  )
}

function Permissions() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="permissions">Android permissions</H>
      <p>
        DroidDock asks for a lot, and it's worth knowing why. Every row below buys exactly one
        feature; deny it and the rest of the app is unaffected.
      </p>
      <PermissionTable />
      <Note tone="warn">
        <strong>Android 13+ blocks the accessibility toggle for sideloaded apps.</strong> If
        “Clipboard &amp; Screen Control” won't turn on, or flips itself back off, go to{' '}
        <strong>Settings → Apps → DroidDock → ⋮ → Allow restricted settings</strong> first, then
        enable it under <strong>Settings → Accessibility → Installed apps</strong>.
      </Note>
    </motion.section>
  )
}

function Pairing() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="pairing">Pairing</H>
      <Step n="1">Put the Mac and the phone on the same Wi-Fi network.</Step>
      <Step n="2">
        On the Mac, open <strong>Pair Device</strong>. It shows a QR code plus the IP and token in
        plain text.
      </Step>
      <Step n="3">
        On the phone, tap <strong>Pair with Mac</strong> and scan the code. If the camera is being
        difficult, tap <strong>Pair Manually</strong> and type the IP and token instead.
      </Step>
      <p>
        After that they reconnect on their own whenever both apps are open on the same network.
        The phone's power icon offers <strong>Pause</strong> for 1 hour, 8 hours, or until you
        resume — that stops reconnect attempts without unpairing. <strong>Forget this Mac</strong>{' '}
        drops the pairing entirely.
      </p>
      <p>
        Reconnection has three routes: the remembered IP, a link-quality probe, and mDNS
        discovery. Full detail on the wire format is on the{' '}
        <a href={home('protocol')}>How it works</a> section of the overview.
      </p>
    </motion.section>
  )
}

function ClipboardDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="clipboard">Clipboard</H>
      <p>
        Mac → phone is automatic. Phone → Mac has an <strong>Auto / Manual</strong> toggle: Auto
        sends the moment you copy, Manual waits for you to press send.
      </p>
      <p>
        Android 13 and One UI block apps from reading the clipboard in the background, so
        DroidDock listens for the accessibility event the system fires when you copy rather than
        polling the clipboard. That's why the accessibility service is required for automatic
        phone → Mac clipboard, and why it stops working the moment that service is switched off.
      </p>
      <p>
        Clipboard history is kept in memory only and capped. It is never written to disk, because
        a persisted clipboard log is a plaintext record of every password and OTP you've copied.
      </p>
    </motion.section>
  )
}

function FilesDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="files">Files &amp; photos</H>
      <ul>
        <li>Drag a file onto the Mac window and it lands on the phone.</li>
        <li>
          Send from the phone's Files tab and it lands in your Mac's <code>Downloads</code> folder.
        </li>
        <li>Browse, download, upload, rename, delete and search phone storage from the Mac.</li>
        <li>
          Photos and videos get a thumbnail grid; open full-res in Preview or QuickTime, or
          download the original.
        </li>
      </ul>
      <p>
        Transfers show live progress with speed and percentage on both ends, and the Android Files
        tab keeps a recent-transfers history with file-type badges and direction.
      </p>
    </motion.section>
  )
}

function AlertsDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="alerts">Notifications, messages and calls</H>
      <p>To get phone notifications on the Mac as native alerts:</p>
      <Step n="1">Open DroidDock on both devices and connect.</Step>
      <Step n="2">
        Grant <strong>Notification access</strong> in the Android app.
      </Step>
      <Step n="3">
        On the Mac, go to <strong>System Settings → Notifications → DroidDock</strong> and turn on
        Allow Notifications.
      </Step>
      <p>
        Alerts support inline reply and dismiss, and individual apps can be muted. SMS threads get
        a two-pane chat on the Mac with search and a live-syncing composer. Incoming calls appear
        with caller ID, and you can place calls from the Mac.
      </p>
    </motion.section>
  )
}

function MirroringDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="mirroring">Screen mirror &amp; camera</H>
      <p>
        Open the Mirror tab on the Mac and pick <strong>Screen</strong> or{' '}
        <strong>Camera</strong>.
      </p>
      <h3>Normal mode</h3>
      <p>
        A notification appears on the phone; tap it to approve the one-time “Allow screen capture”
        prompt. The screen then pops out into a phone-shaped, always-on-top Mac window you can
        tap, swipe, scroll, type into, and drive the nav bar from.
      </p>
      <h3>Auto Mirror (recommended)</h3>
      <p>
        Grant <strong>Display over other apps</strong> once in the Android app's settings. After
        that the capture dialog appears directly with no notification tap, and the camera starts
        instantly. Stopping from the Mac clears the phone's cast indicator completely.
      </p>
      <h3>Desktop mode</h3>
      <p>
        Mirrors a virtual Android display instead of the phone's own screen, so the phone stays
        usable while you work on the Mac.
      </p>
      <Note>
        MediaProjection requires a consent prompt before screen capture — that's an OS rule, not a
        DroidDock choice. Auto Mirror removes the notification tap and reuses the projection
        across reconnects, but the system dialog itself can't be removed.
      </Note>
    </motion.section>
  )
}

function ReverseDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="reverse">Controlling the Mac from the phone</H>
      <p>
        Off unless you enable remote control. Once on, the phone's home screen shows the Mac's
        name, battery and charging state, and what it's playing — with transport keys that drive
        any Mac app, plus volume, brightness, screensaver and lock. The Control tab adds a
        trackpad and keyboard.
      </p>
      <p>
        You can lock the Mac from the phone but not unlock it, and you can lock the phone from the
        Mac but not unlock it — Android exposes no API for the latter.
      </p>
    </motion.section>
  )
}

function UpdatingDoc() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="updating">Updating</H>
      <p>
        From v2.0.0 onward both apps update themselves — the Mac in place, and the Android APK
        too, now that it ships signed with a stable release key.
      </p>
      <Note tone="warn">
        <strong>Updating the Mac app revokes its Accessibility permission,</strong> and macOS
        doesn't tell you. Because the app is ad-hoc signed rather than Developer ID signed, the
        permission is recorded against a hash of the exact binary, and every release is a
        different binary. The row stays in Privacy &amp; Security with the switch still on, but
        the Mac silently ignores every remote click and keystroke. Fix it with{' '}
        <strong>Settings → System → Reset permission</strong> in DroidDock, then tick DroidDock
        when macOS asks. Unticking and re-ticking the stale row usually doesn't help — the row
        itself is dead.
      </Note>
      <p>
        Reinstalling the Android APK switches the accessibility service off again, so re-enable it
        after every Android update.
      </p>
    </motion.section>
  )
}

const FAULTS = [
  {
    q: 'The phone connects, the mirror shows video, but taps and typing do nothing.',
    a: 'The accessibility service is off. Video streams over MediaProjection, but every tap, swipe and nav press is injected through the accessibility service — with it off they are silently discarded. Re-enable “Clipboard & Screen Control”, and remember that reinstalling the APK turns it off again.',
  },
  {
    q: "Remote clicks stopped working on the Mac after an update.",
    a: 'macOS revoked Accessibility because the binary hash changed. Use Settings → System → Reset permission in DroidDock, then approve it again. See Updating above.',
  },
  {
    q: 'No phone can connect, but the Mac app looks healthy.',
    a: `Something else is holding port ${RELEASE.port} — almost always a second copy of DroidDock. Only one instance can accept a phone; the loser now says so instead of looking fine and doing nothing. Quit the other copy.`,
  },
  {
    q: "The accessibility toggle won't stay on.",
    a: 'Android 13+ blocks it for sideloaded apps. Settings → Apps → DroidDock → ⋮ → Allow restricted settings, then enable it under Settings → Accessibility → Installed apps.',
  },
  {
    q: "macOS won't open the app at all.",
    a: 'Right-click → Open → Open, first launch only. If no Open button is offered, run the xattr command in Install on the Mac to clear the quarantine flag.',
  },
  {
    q: 'Phone notifications never reach the Mac.',
    a: 'Two switches, both required: Notification access in the Android app, and System Settings → Notifications → DroidDock → Allow Notifications on the Mac.',
  },
  {
    q: 'Clipboard works Mac → phone but not phone → Mac.',
    a: 'That direction depends on the accessibility service, and it may be set to Manual. Check the Auto / Manual toggle first, then the service.',
  },
  {
    q: "The Android app won't install over the old one.",
    a: 'You are on v1.0.0 or earlier, which shipped a debug-signed APK. Uninstall it and install the new one — a one-time break.',
  },
  {
    q: 'The link drops when the phone screen turns off.',
    a: 'Set the battery setting for DroidDock to Unrestricted. Android is suspending the foreground service.',
  },
]

function Troubleshooting() {
  return (
    <motion.section variants={stagger(0, 0.05)} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="troubleshooting">Troubleshooting</H>
      <div className="not-prose mt-6 space-y-px">
        {FAULTS.map((f) => (
          <motion.details
            key={f.q}
            variants={settle}
            className="group border-t border-line-2 py-4 last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-start gap-3 text-[1rem] font-semibold text-fg [&::-webkit-details-marker]:hidden">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line-2 transition-colors group-open:bg-amber"
                aria-hidden="true"
              />
              {f.q}
            </summary>
            <p className="mt-2.5 pl-[1.125rem] text-[0.9375rem] leading-relaxed text-fg-3">
              {f.a}
            </p>
          </motion.details>
        ))}
      </div>
    </motion.section>
  )
}

function Uninstall() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="uninstall">Uninstalling</H>
      <p>
        On the Mac, drag <strong>DroidDock.app</strong> to the Trash, then remove its row from{' '}
        <strong>System Settings → Privacy &amp; Security → Accessibility</strong> and from{' '}
        <strong>Notifications</strong>.
      </p>
      <p>
        On the phone, uninstall as normal. There is no account to delete and no server-side data,
        because there is no server — see <a href="../privacy/">Privacy</a>.
      </p>
    </motion.section>
  )
}

function FromSource() {
  return (
    <motion.section variants={stagger()} initial="hidden" whileInView="shown" viewport={inView}>
      <H id="source">Building from source</H>
      <p>
        You need <a href="https://rustup.rs">Rust</a> (stable) and Node 22+ for the Mac app, and
        JDK 17 for Android.
      </p>
      <Code>{`# Mac app — Tauri 2, Rust backend + React frontend
cd droiddock-tauri/app
npm install
npm run tauri dev      # hot-reloads the frontend
npm run tauri build    # .app + .dmg in src-tauri/target/release/bundle/

# Android app
cd droiddock-android
./gradlew installDebug`}</Code>
      <p>
        The first <code>tauri dev</code> compiles the whole Rust dependency tree and takes a few
        minutes; later runs are incremental. Releases are built by CI on a pushed tag — the
        version in the artifact filenames comes from{' '}
        <code>droiddock-tauri/app/src-tauri/tauri.conf.json</code>, so bump that to match the tag
        before releasing.
      </p>
    </motion.section>
  )
}
