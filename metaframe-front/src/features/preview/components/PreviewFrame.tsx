// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ViewportMode } from '@/types/canonical-model'

interface PreviewFrameProps {
  viewport: ViewportMode
  srcDoc: string
  onLoad: () => void
}

const viewportWidths: Record<ViewportMode, string> = {
  desktop: '100%',
  tablet: '820px',
  mobile: '390px',
}

// PreviewFrame isolates iframe-specific concerns so the preview tab can stay focused on state orchestration.
export function PreviewFrame({ viewport, srcDoc, onLoad }: PreviewFrameProps) {
  return (
    <div className="preview-frame">
      <div className="preview-frame__viewport" style={{ width: viewportWidths[viewport] }}>
        <iframe
          className="preview-frame__iframe"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          title="MetaFrame Preview"
          onLoad={onLoad}
        />
      </div>
    </div>
  )
}
