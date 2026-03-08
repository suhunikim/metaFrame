// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { CSSProperties } from 'react'

import { Button, Input } from 'antd'

import { HoverOverlay } from '@/features/design/components/HoverOverlay'
import { SelectionOverlay } from '@/features/design/components/SelectionOverlay'
import { useCanvasSelection } from '@/features/design/components/useCanvasSelection'
import { resolveNodeStyle, summarizeNodeType } from '@/core/canonicalModelUtils'
import type {
  CanonicalNodeModel,
  CanonicalPageModel,
  ResponsiveLayer,
} from '@/types/canonical-model'

interface CanvasRendererProps {
  node: CanonicalNodeModel
  model: CanonicalPageModel
  layer: ResponsiveLayer
  readOnly?: boolean
}

function renderWidgetPreview(node: CanonicalNodeModel) {
  if (node.kind !== 'widget') {
    return null
  }

  if (node.componentName === 'Button') {
    return (
      <Button type={node.props.type === 'primary' ? 'primary' : 'default'}>
        {node.props.text ?? node.name}
      </Button>
    )
  }

  if (node.componentName === 'Input') {
    return <Input readOnly value="" placeholder={String(node.props.placeholder ?? '')} />
  }

  if (node.componentName === 'Card') {
    return <div className="design-canvas__widget-shell">Card container</div>
  }

  return <div className="design-canvas__widget-shell">{node.componentName}</div>
}

// CanvasRenderer recursively renders the current Canonical node tree and decorates it with editor overlays.
export function CanvasRenderer({
  node,
  model,
  layer,
  readOnly = false,
}: CanvasRendererProps) {
  const resolvedStyle = resolveNodeStyle(node, layer) as CSSProperties
  const textContent = typeof node.props.text === 'string' ? node.props.text : null
  const { isSelected, isHovered, onClick, onMouseEnter, onMouseLeave } = useCanvasSelection({
    nodeId: node.id,
    readOnly,
  })

  return (
    <div
      className={`design-canvas__node ${isSelected ? 'design-canvas__node--selected' : ''} ${
        isHovered ? 'design-canvas__node--hovered' : ''
      } ${readOnly ? 'design-canvas__node--readonly' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="presentation"
    >
      {!readOnly && isSelected ? <SelectionOverlay /> : null}
      {!readOnly && !isSelected && isHovered ? <HoverOverlay /> : null}

      <div className="design-canvas__node-header">
        <span>{node.name}</span>
        <span>{summarizeNodeType(node)}</span>
      </div>

      <div className="design-canvas__node-body" style={resolvedStyle}>
        {node.kind === 'html' ? (
          <div className="design-canvas__html-shell">
            <span className="design-canvas__html-tag">{node.tag}</span>
            {textContent ? <span className="design-canvas__html-text">{textContent}</span> : null}
          </div>
        ) : (
          renderWidgetPreview(node)
        )}

        {node.children.length > 0 ? (
          <div className="design-canvas__children">
            {node.children.map((childId) => {
              const childNode = model.nodes[childId]

              if (!childNode) {
                return null
              }

              return (
                <CanvasRenderer
                  key={childNode.id}
                  node={childNode}
                  model={model}
                  layer={layer}
                  readOnly={readOnly}
                />
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
