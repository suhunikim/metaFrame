// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

interface RenderedCanvasState {
  rootNodeId: string | null
  nodeCount: number
  selectedNodeId: string | null
  hoveredNodeId: string | null
}

interface DesignCanvasStoreState {
  renderedCanvasState: RenderedCanvasState
  setRenderedCanvasState: (state: RenderedCanvasState) => void
}

// Canvas render metrics are useful to the shell without coupling layout components to node traversal.
export const useDesignCanvasStore = create<DesignCanvasStoreState>((set) => ({
  renderedCanvasState: {
    rootNodeId: null,
    nodeCount: 0,
    selectedNodeId: null,
    hoveredNodeId: null,
  },
  setRenderedCanvasState: (renderedCanvasState) => set({ renderedCanvasState }),
}))
