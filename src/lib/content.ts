/**
 * Every fact here comes from the DroidDock README or its GitHub releases.
 * Nothing is invented — if it isn't true of the shipping app, it isn't on
 * the page. Update RELEASE on each tag.
 */

export const RELEASE = {
  version: '2.2.0',
  repo: 'https://github.com/himanshudev28/MacDroid',
  dmg: 'https://github.com/himanshudev28/MacDroid/releases/download/v2.2.0/DroidDock_2.2.0_aarch64.dmg',
  apk: 'https://github.com/himanshudev28/MacDroid/releases/download/v2.2.0/DroidDock-Android.apk',
  releases: 'https://github.com/himanshudev28/MacDroid/releases',
  issues: 'https://github.com/himanshudev28/MacDroid/issues/new',
  port: '48484',
  upi: '9120741461@ybl',
} as const

/** The "what it doesn't need" strip. Each of these is a real prerequisite
 *  of every other Android-on-Mac workflow, and none of them apply here —
 *  paired with what DroidDock uses in its place. */
export const NOT_NEEDED = [
  { term: 'adb devices', instead: 'the same Wi-Fi link everything else uses' },
  { term: 'scrcpy', instead: 'MediaProjection encoded to H.264, decoded by WebCodecs' },
  { term: 'Developer Options', instead: 'a QR scan, once' },
  { term: 'USB debugging', instead: 'nothing — there is no cable' },
  { term: 'a cloud account', instead: 'a pairing token that never leaves your network' },
] as const

export type FeatureGroup = {
  id: string
  title: string
  note: string
  items: { name: string; detail: string }[]
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'sync',
    title: 'Sync',
    note: 'Moves on its own, both directions',
    items: [
      {
        name: 'Clipboard',
        detail:
          'Mac → phone automatically; phone → Mac on auto or manual. Reads copied text from accessibility events, so it works on Android 13+ and One UI where background clipboard reads are blocked.',
      },
      {
        name: 'Notifications',
        detail:
          'Phone notifications arrive as native macOS alerts with inline reply and dismiss. Per-app muting. Incoming calls show caller ID.',
      },
      {
        name: 'Messages',
        detail:
          'Two-pane SMS chat — conversation list with avatar initials, search, day dividers, composer. Threads sync live.',
      },
      {
        name: 'Contacts',
        detail: "Browse and search the phone's address book from the Mac.",
      },
      {
        name: 'Calls',
        detail: 'Place calls from the Mac. Incoming-call alerts with caller ID.',
      },
      {
        name: 'Media remote',
        detail: 'Now-Playing card with transport controls and volume.',
      },
      {
        name: 'Clipboard history',
        detail:
          "This session's clips, both directions. Memory-only and capped on purpose — persisting it would be a plaintext log of passwords and OTPs.",
      },
    ],
  },
  {
    id: 'files',
    title: 'Files',
    note: 'Drag either way, no cable',
    items: [
      {
        name: 'Transfer',
        detail:
          'Drag onto the Mac window and it lands on the phone. Send from the phone and it lands in Downloads. Live progress, transfer speed, recent-transfer history.',
      },
      {
        name: 'Storage browser',
        detail: 'Browse, download, upload, rename, delete and search phone storage.',
      },
      {
        name: 'Photos & video',
        detail: 'Thumbnail grid, full-res in Preview or QuickTime, download originals.',
      },
      {
        name: 'Upload queue',
        detail:
          'The Android Files tab shows a live queue with progress bars, speed and percentage, plus colour-coded file-type badges.',
      },
    ],
  },
  {
    id: 'control',
    title: 'Control',
    note: 'The part that usually needs ADB',
    items: [
      {
        name: 'Screen mirror',
        detail:
          'MediaProjection + H.264 on the phone, WebCodecs on the Mac. Pops out into a phone-shaped always-on-top window.',
      },
      {
        name: 'Input injection',
        detail:
          'Tap, swipe, scroll, type and use the nav bar from your Mac, injected back through the accessibility service.',
      },
      {
        name: 'Phone camera',
        detail: "Front or back camera as a live Mac feed, switchable mid-stream.",
      },
      {
        name: 'Desktop mode',
        detail: 'Mirror a virtual Android display — the phone itself stays usable.',
      },
      {
        name: 'Auto Mirror',
        detail:
          'Grant "Display over other apps" once and the Mac starts screen or camera with no per-session tap on the phone.',
      },
      {
        name: 'Apps grid',
        detail:
          'Every launchable app with its real icon and prefix-ranked search. Launch it, or open it in its own Mac window.',
      },
    ],
  },
  {
    id: 'link',
    title: 'Link',
    note: 'Pair once, then forget about it',
    items: [
      {
        name: 'QR pairing',
        detail:
          'A custom scan screen with amber corner brackets, or manual IP and token entry if the camera is being difficult.',
      },
      {
        name: 'Reconnect',
        detail:
          'Auto-reconnect, a link-quality probe, and mDNS discovery as a third fallback.',
      },
      {
        name: 'Device management',
        detail: 'Remembered Macs, Quick Connect, switch between Macs, forget a Mac.',
      },
      {
        name: 'Pause',
        detail: 'Stop reconnect attempts for 1 hour, 8 hours, or until you resume — without unpairing.',
      },
      {
        name: 'Quick Settings tiles',
        detail: 'Toggle the connection and the accessibility service from the Android shade.',
      },
      {
        name: 'Self-updating',
        detail:
          'The Mac app updates in place. The APK is signed with a stable release key, so it updates too.',
      },
    ],
  },
]

/** Reverse direction — the phone gets the Mac, not just the other way round. */
export const REVERSE = [
  { k: 'Battery & charging', v: "The Mac's level and charge state on the phone's home screen" },
  { k: 'Now Playing', v: 'Album art and working transport keys that drive any Mac app' },
  { k: 'Volume & brightness', v: 'Both driven from the phone' },
  { k: 'Screensaver & lock', v: 'Put the Mac to sleep from across the room' },
]

export const INSTALL_STEPS = [
  {
    n: '01',
    title: 'Install on the Mac',
    body: `Download the .dmg and drag DroidDock to Applications. First launch only: right-click the app → Open → Open.`,
    aside: `The build is ad-hoc signed, not notarised — that needs a paid Apple Developer account. If right-click → Open doesn't offer you a button, clear the download flag instead.`,
    code: 'xattr -dr com.apple.quarantine /Applications/DroidDock.app',
  },
  {
    n: '02',
    title: 'Install on the phone',
    body: `Download the APK and sideload it. Android will ask you to allow installs from unknown apps.`,
    aside: `Grant notification access, SMS/contacts/calls, all-files access, the "Clipboard & Screen Control" accessibility service, and unrestricted battery when the app asks. Each one maps to a feature; skip one and that feature is off.`,
    code: null,
  },
  {
    n: '03',
    title: 'Pair them',
    body: `Put both on the same Wi-Fi. On the Mac, open Pair Device — it shows a QR code. On the phone, tap Pair with Mac and scan it.`,
    aside: `They auto-reconnect from then on. There is no account to make and nothing leaves your network.`,
    code: null,
  },
]

/** The honesty section. AI-written landing pages never ship one of these,
 *  which is exactly why it belongs here. All of it is in the README. */
export const SCOPE = [
  {
    title: 'Encryption is opt-in, and partial',
    body: 'The LAN link is a WebSocket gated by a pairing token. AES-256-GCM (Settings → Security, off by default) covers JSON control messages only — file chunks, thumbnails, app icons and mirror video stay in the clear, because wrapping them means surgery on the hot transfer loops. This is not end-to-end encryption of everything, and nothing in the app claims it is. Full TLS is on the roadmap.',
  },
  {
    title: 'Updating the Mac app revokes Accessibility',
    body: "macOS records the permission against a hash of the exact binary, and every release is a different binary. The row stays in Privacy & Security with the switch still on, but the Mac ignores remote clicks. Fix it with Settings → System → Reset permission. Only a Developer ID signature removes this for good.",
  },
  {
    title: 'One copy at a time',
    body: `Two instances compete for port ${RELEASE.port} and the loser can never accept a phone. The app now tells you instead of looking healthy and doing nothing.`,
  },
  {
    title: 'MediaProjection asks once per session',
    body: 'Android requires a consent prompt before screen capture. Auto Mirror mode works around the notification tap and reuses the projection across reconnects, but the OS dialog itself cannot be removed.',
  },
  {
    title: 'Apple Silicon only',
    body: 'The published .dmg is aarch64. Intel Macs need a build from source.',
  },
  {
    title: 'No audio streaming yet',
    body: 'Mac ↔ phone audio is on the roadmap, not in the build.',
  },
]
