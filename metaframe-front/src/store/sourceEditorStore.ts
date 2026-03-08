// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

interface SourceBufferState {
  sourceBuffers: Record<
    string,
    {
      initialValue: string
      value: string
      dirty: boolean
    }
  >
  activeSourceFileId: string | null
  ensureBuffer: (fileId: string, initialValue: string) => void
  updateBuffer: (fileId: string, value: string) => void
  resetBuffer: (fileId: string, nextValue?: string) => void
  setActiveSourceFileId: (fileId: string | null) => void
}

// Source buffers are isolated so Monaco edits do not leak into shell-only view state.
export const useSourceEditorStore = create<SourceBufferState>((set) => ({
  sourceBuffers: {},
  activeSourceFileId: null,
  ensureBuffer: (fileId, initialValue) =>
    set((state) => {
      const existing = state.sourceBuffers[fileId]

      if (!existing) {
        return {
          sourceBuffers: {
            ...state.sourceBuffers,
            [fileId]: {
              initialValue,
              value: initialValue,
              dirty: false,
            },
          },
        }
      }

      if (existing.dirty || existing.initialValue === initialValue) {
        return state
      }

      return {
        sourceBuffers: {
          ...state.sourceBuffers,
          [fileId]: {
            initialValue,
            value: initialValue,
            dirty: false,
          },
        },
      }
    }),
  updateBuffer: (fileId, value) =>
    set((state) => {
      const existing = state.sourceBuffers[fileId]

      if (!existing) {
        return {
          sourceBuffers: {
            ...state.sourceBuffers,
            [fileId]: {
              initialValue: value,
              value,
              dirty: false,
            },
          },
        }
      }

      return {
        sourceBuffers: {
          ...state.sourceBuffers,
          [fileId]: {
            ...existing,
            value,
            dirty: value !== existing.initialValue,
          },
        },
      }
    }),
  resetBuffer: (fileId, nextValue) =>
    set((state) => {
      const existing = state.sourceBuffers[fileId]

      if (!existing) {
        return state
      }

      const baseline = nextValue ?? existing.value

      return {
        sourceBuffers: {
          ...state.sourceBuffers,
          [fileId]: {
            initialValue: baseline,
            value: baseline,
            dirty: false,
          },
        },
      }
    }),
  setActiveSourceFileId: (fileId) => set({ activeSourceFileId: fileId }),
}))
