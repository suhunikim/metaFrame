// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

export type SaveLifecycleState = 'idle' | 'saving' | 'success' | 'failed'

export interface DirtyScopeSummary {
  key: string
  label: string
  detail: string
}

interface SaveStoreState {
  saveModalOpen: boolean
  dirtyScopes: DirtyScopeSummary[]
  saveState: SaveLifecycleState
  saveAllState: SaveLifecycleState
  syncDirtyScopes: (scopes: DirtyScopeSummary[]) => void
  openSaveModal: () => void
  closeSaveModal: () => void
  runSave: (saveAll?: boolean) => Promise<void>
}

// Save modal state is centralized so header, status bar, and later autosave can share one lifecycle.
export const useSaveStore = create<SaveStoreState>((set) => ({
  saveModalOpen: false,
  dirtyScopes: [],
  saveState: 'idle',
  saveAllState: 'idle',
  syncDirtyScopes: (dirtyScopes) => set({ dirtyScopes }),
  openSaveModal: () =>
    set({
      saveModalOpen: true,
      saveState: 'idle',
      saveAllState: 'idle',
    }),
  closeSaveModal: () =>
    set({
      saveModalOpen: false,
      saveState: 'idle',
      saveAllState: 'idle',
    }),
  runSave: async (saveAll = false) => {
    set({
      saveState: saveAll ? 'idle' : 'saving',
      saveAllState: saveAll ? 'saving' : 'idle',
    })

    // This package closes the UI contract first; the real revision engine replaces the timeout.
    await new Promise((resolve) => window.setTimeout(resolve, 350))

    set({
      saveState: saveAll ? 'idle' : 'success',
      saveAllState: saveAll ? 'success' : 'idle',
    })
  },
}))
