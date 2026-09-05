import { Shell } from '../Shell'
import { RELEASE } from '../lib/content'
import { ROUTES } from '../lib/paths'
import { Container, Section } from '../ui/primitives'
import { PageIntro } from './PageIntro'

const UPDATED = '6 September 2026'

export function PrivacyPage() {
  return (
    <Shell>
      <PageIntro
        kicker="Privacy"
        title="There is no server to send anything to."
        lede="DroidDock is two apps that talk to each other over your own Wi-Fi. No account, no backend, no telemetry. This page says exactly what that does and doesn't cover."
        meta={<p className="readout text-fg-4">Last updated {UPDATED}</p>}
      />

      <Section pad="lg" rule={false}>
        <Container>
          <div className="prose-doc min-w-0 max-w-none lg:max-w-[68ch]">
            <h2>The apps</h2>
            <p>
              <strong>Nothing is collected and nothing is transmitted off your network.</strong>{' '}
              There is no analytics SDK, no crash reporting service, no account system and no
              server operated by anyone. The Mac app and the Android app exchange data directly
              with each other over a WebSocket on your LAN, gated by a pairing token you generate
              yourself when you scan the QR code.
            </p>
            <p>
              Everything the apps handle — clipboard contents, notifications, SMS, contacts, call
              metadata, files, photos, screen frames, camera frames — moves between your two
              devices and is stored only where it already lived. The Mac keeps files you transfer
              in your <code>Downloads</code> folder; the phone keeps files you send in its own
              storage. Neither app uploads any of it anywhere.
            </p>
            <p>
              Clipboard history is deliberately memory-only and capped. It is never written to
              disk, because a persisted clipboard log is a plaintext record of every password and
              one-time code you have copied.
            </p>

            <h2>What the link actually protects</h2>
            <p>
              The LAN WebSocket is gated by a pairing token. Optional{' '}
              <strong>AES-256-GCM</strong> (Settings → Security, off by default) encrypts JSON
              control messages, keyed off that token.
            </p>
            <p>
              <strong>The scope, stated plainly:</strong> binary frames — file chunks, thumbnails,
              app icons and mirror video — stay in the clear even with encryption on, because
              wrapping them means surgery on the hot transfer and mirror loops. This is{' '}
              <strong>not</strong> end-to-end encryption of everything, and nothing in the app
              claims it is. Full TLS on the link is on the roadmap and is not in the build. Treat
              the link as appropriate for a network you trust, not a hostile one.
            </p>

            <h2>This website</h2>
            <p>
              This site is static. It sets no cookies, runs no analytics, embeds no trackers, and
              has no comment system, contact form or newsletter.
            </p>
            <ul>
              <li>
                <strong>Fonts are self-hosted.</strong> The site makes no request to Google Fonts
                or any other font CDN, so no third party sees your IP address in order to render
                the type.
              </li>
              <li>
                <strong>Browser storage.</strong> One key, <code>droiddock-theme</code>, remembers
                whether you picked light or dark. It stays in your browser, is readable only by
                this site, and is never sent anywhere. Choosing “System” deletes it.
              </li>
              <li>
                <strong>No server logs are used by us.</strong> Whoever hosts this page will see
                ordinary web-server request data; we neither collect nor analyse it.
              </li>
            </ul>

            <h2>Third parties you reach from here</h2>
            <p>
              The download buttons and source links point at <strong>GitHub</strong>. When you
              follow one, GitHub receives your request and its own privacy policy applies — we
              have no involvement in and no access to that. The same is true of any other outbound
              link on this site.
            </p>

            <h2>Children</h2>
            <p>
              The apps are general-purpose developer-adjacent tools and are not directed at
              children. Since nothing is collected from anyone, no data about children is
              collected either.
            </p>

            <h2>Changes</h2>
            <p>
              If this policy changes, the date at the top of the page changes with it. Material
              changes will also show up in the release notes, since the policy only ever describes
              what the shipped build does.
            </p>

            <h2>Contact</h2>
            <p>
              Questions or corrections:{' '}
              <a href={RELEASE.issues} target="_blank" rel="noreferrer noopener">
                open an issue on GitHub
              </a>
              . See also the <a href={ROUTES.terms}>terms</a> and the{' '}
              <a href={ROUTES.docs}>documentation</a>.
            </p>
          </div>
        </Container>
      </Section>
    </Shell>
  )
}
