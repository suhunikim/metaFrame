// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Typography } from 'antd'

import { useEditorStore, useFileTreeStore } from '@/store'
import { FileExplorerTree } from '@/features/file-tree/components/FileExplorerTree'
import { flattenFileTree } from '@/utils/fileTree'

const { Text } = Typography

// Files panel shows managed counts and the active project name before file CRUD arrives.
export function FileExplorerPanel() {
  const files = useFileTreeStore((state) => state.files)
  const currentProjectName = useEditorStore((state) => state.currentProjectName)

  const flattened = flattenFileTree(files)
  const fileCount = flattened.filter((node) => node.kind === 'file').length
  const managedCount = flattened.filter(
    (node) =>
      node.kind === 'file' && (node.managedType === 'page' || node.managedType === 'layout'),
  ).length

  return (
    <div className="file-explorer">
      <div className="file-explorer__header">
        <Text className="file-explorer__title">Managed Files</Text>
        <Text className="file-explorer__project">{currentProjectName}</Text>
      </div>

      <div className="file-explorer__summary">
        <div className="file-explorer__summary-card">
          <span className="file-explorer__summary-value">{fileCount}</span>
          <span className="file-explorer__summary-label">Tracked files</span>
        </div>
        <div className="file-explorer__summary-card">
          <span className="file-explorer__summary-value">{managedCount}</span>
          <span className="file-explorer__summary-label">Managed pages</span>
        </div>
      </div>

      <FileExplorerTree files={files} />
    </div>
  )
}
