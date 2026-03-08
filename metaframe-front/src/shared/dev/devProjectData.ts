// - Role: Defines local-development project data for offline shell testing.
// - Notes: This file lets the login, home, and IDE flows run without a live backend.

import { initialFiles, initialPagesByFileId, initialProject } from '@/store/mockProject'
import type { ApiFileNode, ApiManagedPage } from '@/shared/api/metaframeApi'
import type {
  LayoutPresetOption,
  NewProjectDraft,
  ProjectDetail,
  ProjectFilter,
  ProjectSummary,
  ProjectTemplateOption,
  VersionCatalog,
  VersionPreset,
} from '@/types/project.types'

interface DevProjectRecord {
  detail: ProjectDetail
  page: ApiManagedPage
}

const versionPresets: VersionPreset[] = [
  {
    key: 'stable',
    label: 'Stable',
    description: 'Recommended local preset for the managed IDE shell.',
    reactVersion: '18.3.1',
    viteVersion: '5.4.19',
    recommended: true,
  },
]

const templateOptions: ProjectTemplateOption[] = [
  {
    key: 'stable-recommended',
    label: 'Stable Recommended',
    description: 'Balanced preset for managed React admin and dashboard screens.',
    defaultLayoutPreset: 'main-layout',
  },
]

const layoutPresets: LayoutPresetOption[] = [
  {
    key: 'main-layout',
    label: 'Main Layout',
    description: 'Header, left navigation, center workspace, and inspector layout.',
  },
]

const devVersionCatalog: VersionCatalog = {
  presets: versionPresets,
  templates: templateOptions,
  layoutPresets,
}

const devProjects = new Map<string, DevProjectRecord>()

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function nowIso() {
  return new Date().toISOString()
}

function buildApiFileNodes(
  nodes: typeof initialFiles,
  projectId: string,
  parentId: string | null = null,
): ApiFileNode[] {
  return nodes.flatMap((node, index) => {
    const currentNode: ApiFileNode = {
      fileId: node.id,
      projectId,
      parentId,
      name: node.name,
      path: node.path,
      nodeType: node.kind,
      managedType: node.managedType,
      extension: node.extension,
      isProtected: node.isProtected,
      isDeleted: node.isDeleted,
      nodeOrder: index,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    return [
      currentNode,
      ...(node.children ? buildApiFileNodes(node.children, projectId, node.id) : []),
    ]
  })
}

function buildManagedPage(projectId: string): ApiManagedPage {
  const page = cloneValue(initialPagesByFileId['page-home'])

  return {
    pageId: page.pageId,
    fileId: page.fileId,
    projectId,
    pageName: 'HomePage',
    routePath: page.routePath,
    linkedLayoutId: page.layoutId,
    revisionHeadId: `revision-${projectId}`,
    schemaVersion: page.schemaVersion,
    editabilityState: 'editable',
    exportState: page.stateFlags.nonExportable ? 'blocked' : 'ready',
    snapshot: page as unknown as Record<string, unknown>,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

function buildProjectDetail(input?: Partial<NewProjectDraft> & { projectId?: string }): ProjectDetail {
  const projectId = input?.projectId ?? initialProject.projectId
  const projectName = input?.projectName?.trim() || initialProject.name
  const updatedAt = nowIso()

  return {
    projectId,
    projectName,
    projectDescription: input?.projectDescription?.trim() || 'Local development workspace',
    templateType: input?.templateType ?? initialProject.templateType,
    schemaVersion: '1.0.0',
    versionPreset: input?.versionPreset ?? 'stable',
    reactVersion: input?.reactVersion ?? '18.3.1',
    viteVersion: input?.viteVersion ?? '5.4.19',
    layoutPreset: input?.layoutPreset ?? 'main-layout',
    ownerUserId: 'local-dev-user',
    ownerEmail: 'local-dev@metaframe.app',
    currentUserRole: 'owner',
    autosaveEnabled: true,
    collaborationMode: 'single-user',
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    lastOpenedAt: updatedAt,
    createdAt: updatedAt,
    updatedAt,
    pageCount: 1,
    layoutCount: 1,
    files: buildApiFileNodes(cloneValue(initialFiles), projectId),
  }
}

function ensureSeedProject() {
  if (devProjects.has(initialProject.projectId)) {
    return
  }

  const detail = buildProjectDetail()
  devProjects.set(detail.projectId, {
    detail,
    page: buildManagedPage(detail.projectId),
  })
}

function sortedProjects(filter: ProjectFilter) {
  ensureSeedProject()

  const rows = Array.from(devProjects.values()).map((entry) => entry.detail)
  const normalizedQuery = filter.query.trim().toLowerCase()

  return rows
    .filter((project) => {
      if (filter.deletedMode === 'active' && project.isDeleted) {
        return false
      }

      if (filter.deletedMode === 'deleted' && !project.isDeleted) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return (
        project.projectName.toLowerCase().includes(normalizedQuery) ||
        (project.projectDescription ?? '').toLowerCase().includes(normalizedQuery)
      )
    })
    .sort((left, right) => {
      switch (filter.sort) {
        case 'name_asc':
          return left.projectName.localeCompare(right.projectName)
        case 'created_desc':
          return right.createdAt.localeCompare(left.createdAt)
        case 'updated_asc':
          return left.updatedAt.localeCompare(right.updatedAt)
        case 'recent_opened':
          return (right.lastOpenedAt ?? '').localeCompare(left.lastOpenedAt ?? '')
        default:
          return right.updatedAt.localeCompare(left.updatedAt)
      }
    })
}

export function listDevProjects(filter: ProjectFilter): ProjectSummary[] {
  return sortedProjects(filter).map((project) => ({ ...project }))
}

export function getDevProject(projectId: string): ProjectDetail {
  ensureSeedProject()
  const project = devProjects.get(projectId)

  if (!project) {
    throw new Error('The local development project could not be found.')
  }

  return cloneValue(project.detail)
}

export function getDevManagedPage(projectId: string, fileId: string): ApiManagedPage {
  ensureSeedProject()
  const project = devProjects.get(projectId)

  if (!project || project.page.fileId !== fileId) {
    throw new Error('The local development managed page could not be found.')
  }

  return cloneValue(project.page)
}

export function createDevProject(input: NewProjectDraft): ProjectDetail {
  ensureSeedProject()
  const projectId = `project-${Date.now()}`
  const detail = buildProjectDetail({
    ...input,
    projectId,
  })

  devProjects.set(projectId, {
    detail,
    page: buildManagedPage(projectId),
  })

  return cloneValue(detail)
}

export function trashDevProject(projectId: string) {
  ensureSeedProject()
  const existing = devProjects.get(projectId)

  if (!existing) {
    return
  }

  const deletedAt = nowIso()
  existing.detail = {
    ...existing.detail,
    isDeleted: true,
    deletedAt,
    deletedBy: 'local-dev-user',
    updatedAt: deletedAt,
  }
}

export function restoreDevProject(projectId: string) {
  ensureSeedProject()
  const existing = devProjects.get(projectId)

  if (!existing) {
    return
  }

  existing.detail = {
    ...existing.detail,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: nowIso(),
  }
}

export function getDevVersionCatalog(): VersionCatalog {
  return cloneValue(devVersionCatalog)
}
