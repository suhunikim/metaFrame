// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { CanonicalNodeModel, CanonicalPageModel } from '@/types/canonical-model'
import type { ManagedFileNode } from '@/types/file-tree.types'

// - Role: Keep file tree traversal and path helpers in one shared module.
// - Notes: Left panel, status bar, and command palette reuse the same recursive rules here.
export function flattenFileTree(nodes: ManagedFileNode[]): ManagedFileNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenFileTree(node.children) : [])])
}

export function findFileNodeById(
  nodes: ManagedFileNode[],
  fileId: string | null,
): ManagedFileNode | null {
  if (!fileId) {
    return null
  }

  for (const node of nodes) {
    if (node.id === fileId) {
      return node
    }

    if (node.children) {
      const matched = findFileNodeById(node.children, fileId)

      if (matched) {
        return matched
      }
    }
  }

  return null
}

export function buildFilePath(nodes: ManagedFileNode[], fileId: string | null): ManagedFileNode[] {
  if (!fileId) {
    return []
  }

  function visit(children: ManagedFileNode[], trail: ManagedFileNode[]): ManagedFileNode[] | null {
    for (const node of children) {
      const nextTrail = [...trail, node]

      if (node.id === fileId) {
        return nextTrail
      }

      if (node.children) {
        const result = visit(node.children, nextTrail)

        if (result) {
          return result
        }
      }
    }

    return null
  }

  return visit(nodes, []) ?? []
}

export function buildNodePath(
  model: CanonicalPageModel | null,
  nodeId: string | null,
): CanonicalNodeModel[] {
  if (!model || !nodeId) {
    return []
  }

  const parents = new Map<string, string | null>()
  Object.values(model.nodes).forEach((node) => {
    node.children.forEach((childId) => {
      parents.set(childId, node.id)
    })
  })

  const trail: CanonicalNodeModel[] = []
  let cursor: string | null = nodeId

  while (cursor) {
    const node = model.nodes[cursor]

    if (!node) {
      break
    }

    trail.unshift(node)
    cursor = parents.get(cursor) ?? null
  }

  return trail
}

export function collectExpandedFolderIds(nodes: ManagedFileNode[]): string[] {
  return nodes.flatMap((node) => {
    if (node.kind !== 'folder') {
      return []
    }

    return [node.id, ...(node.children ? collectExpandedFolderIds(node.children) : [])]
  })
}
