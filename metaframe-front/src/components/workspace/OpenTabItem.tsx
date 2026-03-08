// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

interface OpenTabItemProps {
  name: string
  dirty: boolean
}

// The tab label stays tiny because file state detail belongs in the header and status bar.
export function OpenTabItem({ name, dirty }: OpenTabItemProps) {
  return (
    <div className="editor-tab-label">
      <span>{name}</span>
      {dirty ? <span className="editor-tab-label__dot" /> : null}
    </div>
  )
}
