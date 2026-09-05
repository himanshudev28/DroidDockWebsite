import { Shell } from '../Shell'
import { ROUTES } from '../lib/paths'
import { Container, Lamp, Readout, Section } from '../ui/primitives'

export function NotFoundPage() {
  return (
    <Shell>
      <Section pad="xl" rule={false} className="pt-36">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-6 flex items-center justify-center gap-2.5">
              <Lamp on={false} size={6} />
              <Readout className="text-fg-4">404 · no route to host</Readout>
            </div>
            <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)]">This page isn't paired.</h1>
            <p className="mx-auto mt-5 max-w-md text-fg-2">
              The address you followed doesn't exist here. The link may be old, or it may have a
              typo in it.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={ROUTES.home}
                className="rounded-md bg-amber px-5 py-3 font-semibold text-on-amber transition-colors duration-200 hover:bg-amber-hi"
                style={{ color: "var(--color-on-amber)" }}
              >
                Back to the overview
              </a>
              <a
                href={ROUTES.docs}
                className="rounded-md border border-line-2 px-5 py-3 font-semibold text-fg transition-colors duration-200 hover:border-amber hover:text-amber-ink"
              >
                Read the docs
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </Shell>
  )
}
