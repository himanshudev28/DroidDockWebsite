import { Shell } from '../Shell'
import { RELEASE } from '../lib/content'
import { ROUTES } from '../lib/paths'
import { Container, Section } from '../ui/primitives'
import { PageIntro } from './PageIntro'

const UPDATED = '6 September 2026'

export function TermsPage() {
  return (
    <Shell>
      <PageIntro
        kicker="Terms"
        title="Free, as-is, and honest about it."
        lede="DroidDock is a personal project given away for nothing. These terms are short because the arrangement is simple."
        meta={<p className="readout text-fg-4">Last updated {UPDATED}</p>}
      />

      <Section pad="lg" rule={false}>
        <Container>
          <div className="prose-doc min-w-0 max-w-none lg:max-w-[68ch]">
            <h2>The software is provided as-is</h2>
            <p>
              DroidDock is supplied without warranty of any kind, express or implied, including
              but not limited to merchantability, fitness for a particular purpose and
              non-infringement. You run it at your own risk. To the maximum extent permitted by
              law, the author is not liable for any claim, damages, data loss or other liability
              arising from the software or its use.
            </p>
            <p>
              That is not boilerplate hedging: the app requests accessibility control, notification
              access, SMS and all-files permissions on your phone. Read{' '}
              <a href={ROUTES.docs}>the documentation</a> and grant only what you want.
            </p>

            <h2>Licence status</h2>
            <p>
              The source is public at{' '}
              <a href={RELEASE.repo} target="_blank" rel="noreferrer noopener">
                github.com/himanshudev28/MacDroid
              </a>
              .{' '}
              <strong>
                The repository does not currently include a LICENSE file, so no licence is
                granted and the author retains all rights by default.
              </strong>{' '}
              You are welcome to read the code, build it for your own use, and open issues or pull
              requests. Redistribution, modification or reuse in another project needs the
              author's permission until an explicit open-source licence is added to the
              repository.
            </p>
            <p>
              If you are reading this after a licence has been added, that file governs and takes
              precedence over this paragraph.
            </p>

            <h2>Contributions</h2>
            <p>
              Issues and pull requests are welcome, and contributors are credited in the release
              notes. By opening a pull request you agree that your contribution may be included in
              the project and distributed under whatever licence the project adopts.
            </p>

            <h2>Downloads</h2>
            <p>
              Builds are distributed through GitHub Releases. The macOS build is ad-hoc signed
              rather than notarised, which is why macOS asks you to confirm the first launch — see{' '}
              <a href={ROUTES.docs}>the install guide</a>. Only download from the official
              releases page; builds obtained anywhere else are not ours.
            </p>

            <h2>No affiliation</h2>
            <p>
              DroidDock is an independent personal project. It is not affiliated with, endorsed by
              or sponsored by Apple, Google, Samsung, or any other company whose products it
              interoperates with. Product names and trademarks belong to their respective owners.
            </p>
            <p>
              It is also unrelated to any other commercial product marketed under a similar name.
              The GitHub repository is named <code>MacDroid</code> for historical reasons; the
              application is called DroidDock.
            </p>

            <h2>Support</h2>
            <p>
              There is no support commitment. Bugs and feature requests go to{' '}
              <a href={RELEASE.issues} target="_blank" rel="noreferrer noopener">
                GitHub issues
              </a>
              , and are handled when time allows. Tips via UPI ({RELEASE.upi}) are appreciated,
              entirely optional, and buy no entitlement to support or features.
            </p>

            <h2>Changes</h2>
            <p>
              These terms may change; the date at the top will change with them. See also the{' '}
              <a href={ROUTES.privacy}>privacy policy</a>.
            </p>
          </div>
        </Container>
      </Section>
    </Shell>
  )
}
