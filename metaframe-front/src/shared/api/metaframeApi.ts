// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ManagedFileNode } from '@/types/file-tree.types'
import type { CanonicalPageModel } from '@/types/canonical-model'
import { DEV_LOGIN_BYPASS_ENABLED } from '@/shared/dev/devMode'
import { getDevManagedPage } from '@/shared/dev/devProjectData'
import type { ProjectDetail } from '@/types/project.types'
import { apiRequest } from '@/shared/api/apiClient'

export interface ApiFileNode {
  fileId: string
  projectId: string
  parentId: string | null
  name: string
  path: string
  nodeType: 'file' | 'folder'
  managedType: 'folder' | 'general' | 'page' | 'layout' | 'system'
  extension: string | null
  isProtected: boolean
  isDeleted: boolean
  nodeOrder: number
  createdAt: string
  updatedAt: string
}

export interface ApiManagedPage {
  pageId: string
  fileId: string
  projectId: string
  pageName: string
  routePath: string
  linkedLayoutId: string
  revisionHeadId: string
  schemaVersion: string
  editabilityState: string
  exportState: string
  snapshot: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export function getManagedPage(projectId: string, fileId: string) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    return Promise.resolve(getDevManagedPage(projectId, fileId))
  }

  return apiRequest<ApiManagedPage>(`/api/projects/${projectId}/pages/${fileId}`)
}

function buildTree(nodes: ApiFileNode[], parentId: string | null): ManagedFileNode[] {
  return nodes
    .filter((node) => node.parentId === parentId)
    .sort((left, right) => left.nodeOrder - right.nodeOrder || left.path.localeCompare(right.path))
    .map((node) => ({
      id: node.fileId,
      name: node.name,
      path: node.path,
      extension: node.extension,
      kind: node.nodeType,
      managedType: node.managedType,
      isProtected: node.isProtected,
      isDeleted: node.isDeleted,
      children: node.nodeType === 'folder' ? buildTree(nodes, node.fileId) : undefined,
    }))
}

export function buildManagedTree(nodes: ApiFileNode[]) {
  return buildTree(nodes, null)
}

export function toCanonicalPageModel(page: ApiManagedPage): CanonicalPageModel {
  const snapshot = page.snapshot as Partial<CanonicalPageModel>

  // - Role: Keep a safe Canonical fallback shape even when snapshot fields are still partial.
  return {
    pageId: page.pageId,
    fileId: page.fileId,
    routePath: page.routePath,
    layoutId: page.linkedLayoutId,
    schemaVersion: page.schemaVersion,
    revision: snapshot.revision ?? 1,
    stateFlags:
      snapshot.stateFlags ?? {
        dirty: false,
        synced: true,
        warning: false,
        locked: false,
        conflict: false,
        parseError: false,
        exportable: true,
        nonExportable: false,
        readOnly: false,
        recoveryAvailable: false,
      },
    rootNodeId: snapshot.rootNodeId ?? '',
    nodes: snapshot.nodes ?? {},
  }
}

export function buildProjectHydrationPayload(project: ProjectDetail, page: ApiManagedPage) {
  const files = buildManagedTree(project.files)
  const layoutFile = project.files.find((file) => file.managedType === 'layout')
  const canonicalPage = toCanonicalPageModel(page)

  // - Role: Hydrate every editor store from one normalized workspace payload.
  return {
    files,
    selectedFileId: page.fileId,
    editor: {
      projectName: project.projectName,
      pagesByFileId: {
        [page.fileId]: canonicalPage,
      },
      openFileIds: layoutFile ? [page.fileId, layoutFile.fileId] : [page.fileId],
      activeFileId: page.fileId,
      selectedNodeId: canonicalPage.rootNodeId,
    },
  }
}
