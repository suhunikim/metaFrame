// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

export type PreviewLifecycleState = 'idle' | 'loading' | 'ready' | 'error'

interface PreviewStoreState {
  previewState: PreviewLifecycleState
  previewError: string | null
  lastRenderedAt: string | null
  setPreviewLoading: () => void
  setPreviewReady: () => void
  setPreviewError: (message: string) => void
  clearPreviewError: () => void
}

// Preview state stays separate so iframe lifecycle does not leak into document selection state.
export const usePreviewStore = create<PreviewStoreState>((set) => ({
  previewState: 'idle',
  previewError: null,
  lastRenderedAt: null,
  setPreviewLoading: () =>
    set({
      previewState: 'loading',
      previewError: null,
    }),
  setPreviewReady: () =>
    set({
      previewState: 'ready',
      previewError: null,
      lastRenderedAt: new Date().toISOString(),
    }),
  setPreviewError: (previewError) =>
    set({
      previewState: 'error',
      previewError,
    }),
  clearPreviewError: () =>
    set({
      previewState: 'idle',
      previewError: null,
    }),
}))
