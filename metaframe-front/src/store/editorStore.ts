// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

import { initialProject, initialPagesByFileId } from '@/store/mockProject'
import type {
  CanonicalPageModel,
  EditorMode,
  ResponsiveLayer,
  ViewportMode,
} from '@/types/canonical-model'

export interface CollaborationSummary {
  activeEditors: number
  lockState: 'none' | 'soft' | 'hard'
  revisionBehind: boolean
}

interface EditorState {
  currentProjectName: string
  viewport: ViewportMode
  responsiveLayer: ResponsiveLayer
  mode: EditorMode
  pagesByFileId: Record<string, CanonicalPageModel>
  collaboration: CollaborationSummary
  projectLoading: boolean
  editorShellReady: boolean
  setViewport: (viewport: ViewportMode) => void
  setResponsiveLayer: (layer: ResponsiveLayer) => void
  setMode: (mode: EditorMode) => void
  hydrateProject: (payload: {
    projectName: string
    pagesByFileId: Record<string, CanonicalPageModel>
  }) => void
  setProjectLoading: (loading: boolean) => void
}

function deriveLayerFromViewport(viewport: ViewportMode): ResponsiveLayer {
  if (viewport === 'desktop') {
    return 'base'
  }

  return viewport
}

// Shell-level editor state stays here so viewport and mode changes do not re-shape tab state.
export const useEditorStore = create<EditorState>((set) => ({
  currentProjectName: initialProject.name,
  viewport: 'desktop',
  responsiveLayer: 'base',
  mode: 'design',
  pagesByFileId: initialPagesByFileId,
  collaboration: {
    activeEditors: 2,
    lockState: 'soft',
    revisionBehind: true,
  },
  projectLoading: false,
  editorShellReady: true,
  setViewport: (viewport) =>
    set(() => ({
      viewport,
      responsiveLayer: deriveLayerFromViewport(viewport),
    })),
  setResponsiveLayer: (layer) => set({ responsiveLayer: layer }),
  setMode: (mode) => set({ mode }),
  hydrateProject: (payload) =>
    set(() => ({
      currentProjectName: payload.projectName,
      pagesByFileId: payload.pagesByFileId,
      mode: 'design',
      viewport: 'desktop',
      responsiveLayer: 'base',
      collaboration: {
        activeEditors: 1,
        lockState: 'none',
        revisionBehind: false,
      },
      projectLoading: false,
      editorShellReady: true,
    })),
  setProjectLoading: (projectLoading) => set({ projectLoading, editorShellReady: !projectLoading }),
}))
