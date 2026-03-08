// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

import { createProject, listProjects, restoreProject, trashProject } from '@/features/project-home/api/projectApi'
import { getVersionCatalog } from '@/features/project-home/api/versionCatalogApi'
import type {
  NewProjectDraft,
  ProjectDetail,
  ProjectFilter,
  ProjectSummary,
  VersionCatalog,
} from '@/types/project.types'
import { toErrorMessage } from '@/utils/errorMessage'

const defaultDraft: NewProjectDraft = {
  projectName: '',
  projectDescription: '',
  templateType: 'stable-recommended',
  versionPreset: 'stable',
  reactVersion: '18.3.1',
  viteVersion: '5.4.19',
  layoutPreset: 'main-layout',
}

const defaultFilter: ProjectFilter = {
  query: '',
  sort: 'updated_desc',
  deletedMode: 'active',
}

interface ProjectStoreState {
  loading: boolean
  catalogLoading: boolean
  projects: ProjectSummary[]
  filter: ProjectFilter
  versionCatalog: VersionCatalog | null
  newProjectDraft: NewProjectDraft
  selectedProject: ProjectSummary | null
  error: string | null
  setFilter: (patch: Partial<ProjectFilter>) => void
  setNewProjectDraft: (patch: Partial<NewProjectDraft>) => void
  resetDraft: () => void
  loadProjects: () => Promise<void>
  loadVersionCatalog: () => Promise<void>
  createProject: () => Promise<ProjectDetail>
  trashProject: (projectId: string) => Promise<void>
  restoreProject: (projectId: string) => Promise<void>
  setSelectedProject: (project: ProjectSummary | null) => void
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  loading: false,
  catalogLoading: false,
  projects: [],
  filter: defaultFilter,
  versionCatalog: null,
  newProjectDraft: defaultDraft,
  selectedProject: null,
  error: null,
  setFilter: (patch) => set((state) => ({ filter: { ...state.filter, ...patch } })),
  setNewProjectDraft: (patch) =>
    set((state) => ({ newProjectDraft: { ...state.newProjectDraft, ...patch } })),
  resetDraft: () =>
    set((state) => ({
      newProjectDraft: state.versionCatalog
        ? {
            ...defaultDraft,
            templateType: state.versionCatalog.templates[0]?.key ?? defaultDraft.templateType,
            versionPreset: state.versionCatalog.presets[0]?.key ?? defaultDraft.versionPreset,
            reactVersion: state.versionCatalog.presets[0]?.reactVersion ?? defaultDraft.reactVersion,
            viteVersion: state.versionCatalog.presets[0]?.viteVersion ?? defaultDraft.viteVersion,
            layoutPreset: state.versionCatalog.layoutPresets[0]?.key ?? defaultDraft.layoutPreset,
          }
        : defaultDraft,
    })),
  loadProjects: async () => {
    set({ loading: true, error: null })

    try {
      const projects = await listProjects(get().filter)
      set({ projects, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: toErrorMessage(error),
      })
      throw error
    }
  },
  loadVersionCatalog: async () => {
    if (get().versionCatalog) {
      return
    }

    set({ catalogLoading: true, error: null })

    try {
      const versionCatalog = await getVersionCatalog()
      const preset = versionCatalog.presets[0]
      const template = versionCatalog.templates[0]
      const layoutPreset = versionCatalog.layoutPresets[0]

      set({
        versionCatalog,
        catalogLoading: false,
        newProjectDraft: {
          ...defaultDraft,
          templateType: template?.key ?? defaultDraft.templateType,
          versionPreset: preset?.key ?? defaultDraft.versionPreset,
          reactVersion: preset?.reactVersion ?? defaultDraft.reactVersion,
          viteVersion: preset?.viteVersion ?? defaultDraft.viteVersion,
          layoutPreset: layoutPreset?.key ?? defaultDraft.layoutPreset,
        },
      })
    } catch (error) {
      set({
        catalogLoading: false,
        error: toErrorMessage(error),
      })
      throw error
    }
  },
  createProject: async () => {
    const created = await createProject(get().newProjectDraft)
    set({
      selectedProject: null,
    })
    return created
  },
  trashProject: async (projectId) => {
    await trashProject(projectId)
    await get().loadProjects()
  },
  restoreProject: async (projectId) => {
    await restoreProject(projectId)
    await get().loadProjects()
  },
  setSelectedProject: (project) => set({ selectedProject: project }),
}))
