// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { apiRequest } from '@/shared/api/apiClient'
import { DEV_LOGIN_BYPASS_ENABLED } from '@/shared/dev/devMode'
import {
  createDevProject,
  getDevProject,
  listDevProjects,
  restoreDevProject,
  trashDevProject,
} from '@/shared/dev/devProjectData'
import type {
  NewProjectDraft,
  ProjectDetail,
  ProjectFilter,
  ProjectSummary,
} from '@/types/project.types'

function buildProjectListQuery(filter: ProjectFilter) {
  const params = new URLSearchParams()
  params.set('deletedMode', filter.deletedMode)
  params.set('sort', filter.sort)
  if (filter.query.trim()) {
    params.set('query', filter.query.trim())
  }
  return params.toString()
}

export function listProjects(filter: ProjectFilter) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    return Promise.resolve(listDevProjects(filter))
  }

  return apiRequest<ProjectSummary[]>(`/api/projects?${buildProjectListQuery(filter)}`)
}

export function createProject(payload: NewProjectDraft) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    return Promise.resolve(createDevProject(payload))
  }

  return apiRequest<ProjectDetail>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getProject(projectId: string) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    return Promise.resolve(getDevProject(projectId))
  }

  return apiRequest<ProjectDetail>(`/api/projects/${projectId}`)
}

export function trashProject(projectId: string) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    trashDevProject(projectId)
    return Promise.resolve()
  }

  return apiRequest<void>(`/api/projects/${projectId}/trash`, {
    method: 'POST',
  })
}

export function restoreProject(projectId: string) {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    restoreDevProject(projectId)
    return Promise.resolve()
  }

  return apiRequest<void>(`/api/projects/${projectId}/restore`, {
    method: 'POST',
  })
}
