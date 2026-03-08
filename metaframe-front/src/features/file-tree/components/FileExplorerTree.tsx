// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { Key } from 'react'

import {
  FileProtectOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  LayoutOutlined,
  LockOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Tree } from 'antd'
import type { DataNode, EventDataNode } from 'antd/es/tree'

import { useEditorTabsStore, useFileTreeStore } from '@/store'
import type { ManagedFileNode } from '@/types/file-tree.types'
import { flattenFileTree } from '@/utils/fileTree'

function getNodeIcon(node: ManagedFileNode, expanded: boolean) {
  if (node.kind === 'folder') {
    return expanded ? <FolderOpenOutlined /> : <FolderOutlined />
  }

  if (node.isProtected) {
    return <FileProtectOutlined />
  }

  if (node.managedType === 'page') {
    return <ProfileOutlined />
  }

  if (node.managedType === 'layout') {
    return <LayoutOutlined />
  }

  if (node.managedType === 'system') {
    return <SettingOutlined />
  }

  return <FileTextOutlined />
}

function getNodeMetaLabel(node: ManagedFileNode) {
  if (node.kind === 'folder') {
    return `${node.children?.length ?? 0} items`
  }

  if (node.isProtected) {
    return 'protected'
  }

  return node.managedType
}

function buildTreeData(nodes: ManagedFileNode[], expandedFileIds: string[]): DataNode[] {
  return nodes.map((node) => {
    const expanded = expandedFileIds.includes(node.id)

    return {
      key: node.id,
      isLeaf: node.kind === 'file',
      title: (
        <div className="file-explorer__node">
          <span className="file-explorer__name-group">
            <span className="file-explorer__node-icon">{getNodeIcon(node, expanded)}</span>
            <span className="file-explorer__name">{node.name}</span>
          </span>
          <span className="file-explorer__meta">
            {node.isProtected ? <LockOutlined /> : null}
            <span>{getNodeMetaLabel(node)}</span>
          </span>
        </div>
      ),
      children: node.children ? buildTreeData(node.children, expandedFileIds) : undefined,
    }
  })
}

interface FileExplorerTreeProps {
  files: ManagedFileNode[]
}

// The tree is kept small on purpose so CRUD flows can be layered on top without replacing the renderer.
export function FileExplorerTree({ files }: FileExplorerTreeProps) {
  const selectedFileId = useFileTreeStore((state) => state.selectedFileId)
  const expandedFileIds = useFileTreeStore((state) => state.expandedFileIds)
  const setExpandedFileIds = useFileTreeStore((state) => state.setExpandedFileIds)
  const selectFile = useFileTreeStore((state) => state.selectFile)
  const openFile = useEditorTabsStore((state) => state.openFile)

  const flattened = flattenFileTree(files)

  const handleSelect = (_selectedKeys: Key[], info: { node: EventDataNode<DataNode> }) => {
    const fileId = String(info.node.key)
    const selectedNode = flattened.find((node) => node.id === fileId)

    if (!selectedNode || selectedNode.kind !== 'file') {
      return
    }

    selectFile(fileId)
    openFile(fileId)
  }

  return (
    <Tree
      className="file-explorer__tree"
      blockNode
      selectedKeys={selectedFileId ? [selectedFileId] : []}
      expandedKeys={expandedFileIds}
      onExpand={(keys) => setExpandedFileIds(keys.map(String))}
      onSelect={handleSelect}
      treeData={buildTreeData(files, expandedFileIds)}
    />
  )
}
