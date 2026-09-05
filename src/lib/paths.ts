/**
 * Vite rewrites asset URLs it can see at build time, but not strings we
 * build at runtime — so every internal link and every /public asset
 * referenced from JSX goes through here. Without it the site breaks on a
 * GitHub Pages project site, where everything lives under /<repo>/.
 */
const BASE = import.meta.env.BASE_URL || '/'

export function url(path: string): string {
  return `${BASE}${path.replace(/^\/+/, '')}`.replace(/([^:])\/{2,}/g, '$1/')
}

export const ROUTES = {
  home: url('/'),
  docs: url('/docs/'),
  privacy: url('/privacy/'),
  terms: url('/terms/'),
} as const

/** A link to a section of the home page that works from any page. */
export const home = (hash: string) => `${ROUTES.home}#${hash.replace(/^#/, '')}`
