// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

export type ExportLifecycleState = 'idle' | 'inProgress' | 'success' | 'failed'
export type ExportMode = 'project' | 'page'

interface ExportStoreState {
  exportModalOpen: boolean
  exportOptionDraft: {
    mode: ExportMode
  }
  exportState: ExportLifecycleState
  openExportModal: () => void
  closeExportModal: () => void
  setExportMode: (mode: ExportMode) => void
  startExport: () => Promise<void>
}

// Export UI keeps its draft separate so validation and long-running jobs can evolve without header prop drilling.
export const useExportStore = create<ExportStoreState>((set, get) => ({
  exportModalOpen: false,
  exportOptionDraft: {
    mode: 'project',
  },
  exportState: 'idle',
  openExportModal: () =>
    set({
      exportModalOpen: true,
      exportState: 'idle',
    }),
  closeExportModal: () =>
    set({
      exportModalOpen: false,
      exportState: 'idle',
    }),
  setExportMode: (mode) =>
    set((state) => ({
      exportOptionDraft: {
        ...state.exportOptionDraft,
        mode,
      },
    })),
  startExport: async () => {
    set({ exportState: 'inProgress' })

    // Export jobs are still mocked at the UI layer until the backend export pipeline lands.
    await new Promise((resolve) => window.setTimeout(resolve, 450))

    // The draft is intentionally preserved so a second export can reuse the same option.
    set({
      exportState: get().exportOptionDraft.mode ? 'success' : 'failed',
    })
  },
}))
