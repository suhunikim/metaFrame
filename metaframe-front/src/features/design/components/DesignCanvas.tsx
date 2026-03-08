// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { CanvasRenderer } from '@/features/design/components/CanvasRenderer'
import { useDesignCanvasStore, useSelectionStore } from '@/store'
import type { CanonicalPageModel, ResponsiveLayer } from '@/types/canonical-model'

import '@/assets/css/design-canvas.css'

interface DesignCanvasProps {
  model: CanonicalPageModel
  layer: ResponsiveLayer
  readOnly?: boolean
}

// DesignCanvas owns the shell around CanvasRenderer and reports a small render summary back to the IDE.
export function DesignCanvas({ model, layer, readOnly = false }: DesignCanvasProps) {
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)
  const hoveredNodeId = useSelectionStore((state) => state.hoveredNodeId)
  const setRenderedCanvasState = useDesignCanvasStore((state) => state.setRenderedCanvasState)
  const rootNode = model.nodes[model.rootNodeId]

  useEffect(() => {
    setRenderedCanvasState({
      rootNodeId: model.rootNodeId,
      nodeCount: Object.keys(model.nodes).length,
      selectedNodeId,
      hoveredNodeId,
    })
  }, [hoveredNodeId, model.nodes, model.rootNodeId, selectedNodeId, setRenderedCanvasState])

  if (!rootNode) {
    return (
      <EmptyState
        title="No managed root node"
        description="The Canonical Model has not produced a renderable root node yet."
      />
    )
  }

  return (
    <div className={`design-canvas ${readOnly ? 'design-canvas--readonly' : ''}`}>
      <div className="design-canvas__surface">
        <CanvasRenderer node={rootNode} model={model} layer={layer} readOnly={readOnly} />
      </div>
    </div>
  )
}
