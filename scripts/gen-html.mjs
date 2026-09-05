/* Generates the per-page HTML shells. One template, so the theme script,
   meta tags and font preloads can never drift between pages.
   Run: node scripts/gen-html.mjs */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const SITE = 'DroidDock'
const PAGES = [
  { out: 'index.html', entry: 'src/entries/home.tsx', title: 'DroidDock — dock your Android to your Mac',
    desc: 'Clipboard, notifications, files, messages, calls, screen mirror and camera between your Android phone and your Mac, over your own Wi-Fi. No ADB, no scrcpy, no Developer Options.' },
  { out: 'docs/index.html', entry: 'src/entries/docs.tsx', title: 'Documentation — DroidDock',
    desc: 'Install, permissions, pairing, mirroring and troubleshooting for DroidDock on macOS and Android.' },
  { out: 'privacy/index.html', entry: 'src/entries/privacy.tsx', title: 'Privacy — DroidDock',
    desc: 'What DroidDock collects (nothing), what leaves your network (nothing), and what this website loads.' },
  { out: 'terms/index.html', entry: 'src/entries/terms.tsx', title: 'Terms — DroidDock',
    desc: 'Terms of use for the DroidDock apps and this website, including warranty and licensing status.' },
  { out: '404.html', entry: 'src/entries/notfound.tsx', title: 'Not found — DroidDock', desc: 'That page does not exist.', noindex: true },
]

// Runs before first paint so a pinned theme never flashes the other one.
// Must stay in step with src/lib/theme.ts.
const THEME = `(function(){try{var t=localStorage.getItem('droiddock-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`

const html = (p) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#e3dfda" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#09090f" media="(prefers-color-scheme: dark)" />
    <link rel="icon" type="image/png" href="/droiddock-icon.png" />
    <link rel="apple-touch-icon" href="/droiddock-icon.png" />

    <title>${p.title}</title>
    <meta name="description" content="${p.desc}" />
    ${p.noindex ? '<meta name="robots" content="noindex" />' : ''}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE}" />
    <meta property="og:title" content="${p.title}" />
    <meta property="og:description" content="${p.desc}" />
    <meta property="og:image" content="/droiddock-icon.png" />
    <meta name="twitter:card" content="summary" />

    <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/martian-mono-latin.woff2" as="font" type="font/woff2" crossorigin />

    <script>${THEME}</script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${p.entry}"></script>
  </body>
</html>
`

for (const p of PAGES) {
  const file = resolve(process.cwd(), p.out)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html(p))
  console.log('wrote', p.out)
}
