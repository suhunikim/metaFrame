// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ApiFileNode } from '@/shared/api/metaframeApi'

export type ProjectDeletedMode = 'active' | 'deleted' | 'all'
export type ProjectSort = 'updated_desc' | 'updated_asc' | 'name_asc' | 'created_desc' | 'recent_opened'

export interface ProjectSummary {
  projectId: string
  projectName: string
  projectDescription: string | null
  templateType: string
  schemaVersion: string
  versionPreset: string
  reactVersion: string
  viteVersion: string
  layoutPreset: string
  ownerUserId: string
  ownerEmail: string
  currentUserRole: string
  autosaveEnabled: boolean
  collaborationMode: string
  isDeleted: boolean
  deletedAt: string | null
  deletedBy: string | null
  lastOpenedAt: string | null
  createdAt: string
  updatedAt: string
  pageCount: number
  layoutCount: number
}

export interface ProjectDetail extends ProjectSummary {
  files: ApiFileNode[]
}

export interface ProjectFilter {
  query: string
  sort: ProjectSort
  deletedMode: ProjectDeletedMode
}

export interface VersionPreset {
  key: string
  label: string
  description: string
  reactVersion: string
  viteVersion: string
  recommended: boolean
}

export interface ProjectTemplateOption {
  key: string
  label: string
  description: string
  defaultLayoutPreset: string
}

export interface LayoutPresetOption {
  key: string
  label: string
  description: string
}

export interface VersionCatalog {
  presets: VersionPreset[]
  templates: ProjectTemplateOption[]
  layoutPresets: LayoutPresetOption[]
}

export interface NewProjectDraft {
  projectName: string
  projectDescription: string
  templateType: string
  versionPreset: string
  reactVersion: string
  viteVersion: string
  layoutPreset: string
}
