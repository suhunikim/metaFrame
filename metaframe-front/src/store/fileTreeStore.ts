// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

import { initialFiles } from '@/store/mockProject'
import type { ManagedFileNode } from '@/types/file-tree.types'
import { collectExpandedFolderIds } from '@/utils/fileTree'

interface FileTreeState {
  files: ManagedFileNode[]
  selectedFileId: string | null
  expandedFileIds: string[]
  selectFile: (fileId: string) => void
  replaceFiles: (files: ManagedFileNode[], selectedFileId: string | null) => void
  setExpandedFileIds: (fileIds: string[]) => void
  toggleExpanded: (fileId: string) => void
}

// File tree state is isolated so file navigation does not leak into shell mode changes.
export const useFileTreeStore = create<FileTreeState>((set) => ({
  files: initialFiles,
  selectedFileId: 'page-home',
  expandedFileIds: ['workspace-root', 'src-folder', 'pages-folder', 'layouts-folder'],
  selectFile: (fileId) => set({ selectedFileId: fileId }),
  replaceFiles: (files, selectedFileId) =>
    set({
      files,
      selectedFileId,
      expandedFileIds: collectExpandedFolderIds(files),
    }),
  setExpandedFileIds: (fileIds) => set({ expandedFileIds: fileIds }),
  toggleExpanded: (fileId) =>
    set((state) => ({
      expandedFileIds: state.expandedFileIds.includes(fileId)
        ? state.expandedFileIds.filter((expandedId) => expandedId !== fileId)
        : [...state.expandedFileIds, fileId],
    })),
}))
