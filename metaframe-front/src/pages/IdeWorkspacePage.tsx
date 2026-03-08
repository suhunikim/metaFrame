// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo, useState } from 'react'

import { Button, Result } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { LoadingOverlay } from '@/components/common/LoadingOverlay'
import { useNotificationHost } from '@/components/notification-context'
import { loadProjectWorkspace } from '@/features/projects/projectWorkspaceService'
import MainIdeLayout from '@/layouts/MainIdeLayout'
import {
  useEditorStore,
  useEditorTabsStore,
  useFileTreeStore,
  useSelectionStore,
} from '@/store'
import { usePageGuard } from '@/shared/hooks/usePageGuard'

// IDE workspace page hydrates the shell stores and then hands control to the shell layout.
export default function IdeWorkspacePage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const notification = useNotificationHost()
  const replaceFiles = useFileTreeStore((state) => state.replaceFiles)
  const hydrateProject = useEditorStore((state) => state.hydrateProject)
  const setProjectLoading = useEditorStore((state) => state.setProjectLoading)
  const pagesByFileId = useEditorStore((state) => state.pagesByFileId)
  const hydrateTabs = useEditorTabsStore((state) => state.hydrateTabs)
  const selectNode = useSelectionStore((state) => state.selectNode)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasDirtyPage = useMemo(
    () => Object.values(pagesByFileId).some((page) => page.stateFlags.dirty),
    [pagesByFileId],
  )

  usePageGuard(hasDirtyPage)

  useEffect(() => {
    if (!projectId) {
      return
    }

    let active = true

    void (async () => {
      setLoading(true)
      setProjectLoading(true)
      setError(null)

      try {
        const { project, hydration } = await loadProjectWorkspace(projectId)
        if (!active) {
          return
        }

        replaceFiles(hydration.files, hydration.selectedFileId)
        hydrateProject({
          projectName: hydration.editor.projectName,
          pagesByFileId: hydration.editor.pagesByFileId,
        })
        hydrateTabs({
          openFileIds: hydration.editor.openFileIds,
          activeFileId: hydration.editor.activeFileId,
        })
        selectNode(hydration.editor.selectedNodeId)
        notification.success('Workspace loaded', `${project.projectName} is ready.`)
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'The project workspace could not be loaded.',
        )
      } finally {
        if (active) {
          setLoading(false)
          setProjectLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [projectId, replaceFiles, hydrateProject, hydrateTabs, notification, selectNode, setProjectLoading])

  if (!projectId) {
    return (
      <Result
        status="error"
        title="Unable to open project"
        subTitle="The project route is missing a project identifier."
        extra={
          <Button type="primary" onClick={() => navigate('/projects')}>
            Back to projects
          </Button>
        }
      />
    )
  }

  if (loading) {
    return <LoadingOverlay label="Loading IDE workspace..." />
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Unable to open project"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => navigate('/projects')}>
            Back to projects
          </Button>
        }
      />
    )
  }

  return <MainIdeLayout />
}
