import { useState, type ReactNode } from 'react'

export function Step({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="not-prose mb-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
      <span className="readout mt-1 text-amber-ink tabular-nums" aria-hidden="true">
        {n}
      </span>
      <p className="m-0 max-w-[62ch] text-fg-2">{children}</p>
    </div>
  )
}

export function Note({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: 'info' | 'warn'
}) {
  const warn = tone === 'warn'
  return (
    <aside
      className={`not-prose my-6 max-w-[70ch] rounded-lg border p-4 text-[0.9375rem] leading-relaxed ${
        warn ? 'border-amber/35 bg-amber/8' : 'border-line-2 bg-panel/60'
      }`}
    >
      <p className="readout mb-2 text-[9px] text-amber-ink">
        {warn ? 'Known gotcha' : 'Note'}
      </p>
      <div className="max-w-[62ch] text-fg-2 [&_strong]:font-semibold [&_strong]:text-fg">
        {children}
      </div>
    </aside>
  )
}

export function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* blocked clipboard — the text is still selectable */
    }
  }
  return (
    <div className="not-prose my-5 min-w-0 overflow-hidden rounded-md border border-line-2 bg-panel-2">
      <div className="flex items-center justify-between border-b border-line/70 px-3 py-1.5">
        <span className="readout text-[9px] text-fg-4">shell</span>
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-1 text-[0.6875rem] font-semibold text-fg-3 transition-colors duration-200 hover:text-amber-ink"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-3 py-3">
        <code className="font-mono text-[0.75rem] leading-relaxed text-fg-2">{children}</code>
      </pre>
    </div>
  )
}

const PERMISSIONS = [
  ['Notification access', 'Mirrors phone notifications to the Mac, with inline reply'],
  ['SMS · Contacts · Calls', 'Messages, the contact list, and caller ID on incoming calls'],
  ['All-files access', 'The file browser and two-way transfer'],
  ['Accessibility service', 'Automatic phone → Mac clipboard, and every Mac-side tap, swipe and nav press'],
  ['Display over other apps', 'Auto Mirror — starts capture with no per-session tap'],
  ['Battery — Unrestricted', 'Keeps the link alive while the screen is off'],
]

export function PermissionTable() {
  return (
    <div className="not-prose my-6 min-w-0 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line-2">
            <th scope="col" className="readout py-2 pr-6 text-[9px] font-medium text-fg-4">
              Permission
            </th>
            <th scope="col" className="readout py-2 text-[9px] font-medium text-fg-4">
              What it buys
            </th>
          </tr>
        </thead>
        <tbody>
          {PERMISSIONS.map(([k, v]) => (
            <tr key={k} className="border-b border-line/60 align-top">
              <th scope="row" className="py-3 pr-6 text-[0.875rem] font-semibold text-fg">
                {k}
              </th>
              <td className="py-3 text-[0.875rem] text-fg-3">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
