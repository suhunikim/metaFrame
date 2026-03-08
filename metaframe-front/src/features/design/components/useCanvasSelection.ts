// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useMemo } from 'react'

import { useSelectionStore } from '@/store'

interface UseCanvasSelectionOptions {
  nodeId: string
  readOnly?: boolean
}

// Canvas selection logic is isolated so every node renderer follows the same hover and click rules.
export function useCanvasSelection({ nodeId, readOnly = false }: UseCanvasSelectionOptions) {
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)
  const hoveredNodeId = useSelectionStore((state) => state.hoveredNodeId)
  const selectNode = useSelectionStore((state) => state.selectNode)
  const hoverNode = useSelectionStore((state) => state.hoverNode)

  return useMemo(
    () => ({
      isSelected: selectedNodeId === nodeId,
      isHovered: hoveredNodeId === nodeId,
      onClick: () => {
        if (!readOnly) {
          selectNode(nodeId)
        }
      },
      onMouseEnter: () => {
        if (!readOnly) {
          hoverNode(nodeId)
        }
      },
      onMouseLeave: () => {
        if (!readOnly && hoveredNodeId === nodeId) {
          hoverNode(null)
        }
      },
    }),
    [hoverNode, hoveredNodeId, nodeId, readOnly, selectNode, selectedNodeId],
  )
}
