// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  buildProjectHydrationPayload,
  getManagedPage,
} from '@/shared/api/metaframeApi'
import { createProject, getProject, listProjects } from '@/features/project-home/api/projectApi'
import type { NewProjectDraft, ProjectDetail } from '@/types/project.types'

export async function listOpenableProjects() {
  // - Role: Keep the IDE entry list on one stable active-project query.
  // - Notes: This prevents each entry screen from rebuilding the same filter rules.
  return listProjects({
    deletedMode: 'active',
    query: '',
    sort: 'updated_desc',
  })
}

export async function loadProjectWorkspace(projectId: string) {
  const project = await getProject(projectId)
  return buildWorkspaceHydration(project)
}

export async function createProjectWorkspace(input: NewProjectDraft) {
  const project = await createProject(input)
  return buildWorkspaceHydration(project)
}

async function buildWorkspaceHydration(project: ProjectDetail) {
  const firstPageFile = project.files.find((file) => file.managedType === 'page')

  if (!firstPageFile) {
    throw new Error('The target project does not contain an openable managed page.')
  }

  // - Role: Open the first managed page so the shell can render immediately after navigation.
  const page = await getManagedPage(project.projectId, firstPageFile.fileId)

  return {
    project,
    page,
    hydration: buildProjectHydrationPayload(project, page),
  }
}
