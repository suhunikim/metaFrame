// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

interface SelectionState {
  selectedNodeId: string | null
  hoveredNodeId: string | null
  selectNode: (nodeId: string | null) => void
  hoverNode: (nodeId: string | null) => void
}

// Node selection is its own store so canvas, inspector, and status bar can subscribe independently.
export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNodeId: 'search-toolbar',
  hoveredNodeId: null,
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  hoverNode: (nodeId) => set({ hoveredNodeId: nodeId }),
}))
