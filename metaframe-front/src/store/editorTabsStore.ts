// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

interface EditorTabsState {
  openFileIds: string[]
  activeFileId: string | null
  hydrateTabs: (payload: { openFileIds: string[]; activeFileId: string | null }) => void
  openFile: (fileId: string) => void
  closeFile: (fileId: string) => void
}

// Tabs track file navigation only, which keeps workspace chrome separate from document data.
export const useEditorTabsStore = create<EditorTabsState>((set) => ({
  openFileIds: ['page-home', 'layout-main'],
  activeFileId: 'page-home',
  hydrateTabs: ({ openFileIds, activeFileId }) =>
    set({
      openFileIds,
      activeFileId,
    }),
  openFile: (fileId) =>
    set((state) => ({
      activeFileId: fileId,
      openFileIds: state.openFileIds.includes(fileId)
        ? state.openFileIds
        : [...state.openFileIds, fileId],
    })),
  closeFile: (fileId) =>
    set((state) => {
      const remaining = state.openFileIds.filter((openFileId) => openFileId !== fileId)
      const nextActive =
        state.activeFileId === fileId ? (remaining.at(-1) ?? null) : state.activeFileId

      return {
        openFileIds: remaining,
        activeFileId: nextActive,
      }
    }),
}))
