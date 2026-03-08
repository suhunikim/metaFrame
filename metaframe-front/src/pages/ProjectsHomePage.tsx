// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Alert, Spin, Typography } from 'antd'

import { ProjectDeleteRestoreModal } from '@/features/project-home/components/ProjectDeleteRestoreModal'
import { ProjectHomeToolbar } from '@/features/project-home/components/ProjectHomeToolbar'
import { ProjectList } from '@/features/project-home/components/ProjectList'
import { RecentProjects } from '@/features/project-home/components/RecentProjects'
import { NewProjectModal } from '@/features/project-home/components/NewProjectModal'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore, useProjectStore } from '@/store'
import type { ProjectSummary } from '@/types/project.types'
import '@/assets/css/projects-home.css'

const { Text } = Typography

export default function ProjectsHomePage() {
  const navigate = useNavigate()
  const notification = useNotificationHost()
  const currentUser = useAuthStore((state) => state.currentUser)
  const projects = useProjectStore((state) => state.projects)
  const filter = useProjectStore((state) => state.filter)
  const loading = useProjectStore((state) => state.loading)
  const error = useProjectStore((state) => state.error)
  const setFilter = useProjectStore((state) => state.setFilter)
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const loadVersionCatalog = useProjectStore((state) => state.loadVersionCatalog)
  const selectedProject = useProjectStore((state) => state.selectedProject)
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject)
  const trashProject = useProjectStore((state) => state.trashProject)
  const restoreProject = useProjectStore((state) => state.restoreProject)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    void loadVersionCatalog().catch(() => undefined)
  }, [loadVersionCatalog])

  useEffect(() => {
    void loadProjects().catch(() => undefined)
  }, [filter.deletedMode, filter.query, filter.sort, loadProjects])

  const recentProjects = projects
    .filter((project) => Boolean(project.lastOpenedAt))
    .sort((left, right) => (right.lastOpenedAt ?? '').localeCompare(left.lastOpenedAt ?? ''))
    .slice(0, 4)

  const handleDeleteRestore = async () => {
    if (!selectedProject) {
      return
    }

    setDeleteLoading(true)
    try {
      if (selectedProject.isDeleted) {
        await restoreProject(selectedProject.projectId)
        notification.success('Project restored', `${selectedProject.projectName} is active again.`)
      } else {
        await trashProject(selectedProject.projectId)
        notification.success('Project deleted', `${selectedProject.projectName} moved to deleted state.`)
      }

      setSelectedProject(null)
    } catch (modalError) {
      notification.error(
        'Project update failed',
        modalError instanceof Error ? modalError.message : 'The project could not be updated.',
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="projects-home">
      <ProjectHomeToolbar
        query={filter.query}
        sort={filter.sort}
        deletedMode={filter.deletedMode}
        onQueryChange={(value) => setFilter({ query: value })}
        onSortChange={(value) => setFilter({ sort: value })}
        onDeletedModeChange={(value) => setFilter({ deletedMode: value })}
        onCreate={() => setCreateModalOpen(true)}
      />

      <div className="projects-home__intro">
        <div>
          <Text strong>{currentUser?.displayName}</Text>
          <Text type="secondary"> Manage, open, restore, and create MetaFrame projects.</Text>
        </div>
      </div>

      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
      ) : null}

      <RecentProjects
        projects={recentProjects}
        onOpen={(projectId) => navigate(`/projects/${projectId}/ide`)}
      />

      <section className="projects-home__section">
        {loading ? (
          <div className="projects-home__loading">
            <Spin />
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onOpen={(projectId) => navigate(`/projects/${projectId}/ide`)}
            onDeleteRestore={(project: ProjectSummary) => setSelectedProject(project)}
          />
        )}
      </section>

      <NewProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <ProjectDeleteRestoreModal
        open={Boolean(selectedProject)}
        project={selectedProject}
        loading={deleteLoading}
        onConfirm={() => void handleDeleteRestore()}
        onCancel={() => setSelectedProject(null)}
      />
    </div>
  )
}
