// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { ConfirmDangerModal } from '@/components/modals/ConfirmDangerModal'
import type { ProjectSummary } from '@/types/project.types'

interface ProjectDeleteRestoreModalProps {
  open: boolean
  project: ProjectSummary | null
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ProjectDeleteRestoreModal({
  open,
  project,
  loading = false,
  onConfirm,
  onCancel,
}: ProjectDeleteRestoreModalProps) {
  if (!project) {
    return null
  }

  const restoring = project.isDeleted

  return (
    <ConfirmDangerModal
      open={open}
      title={restoring ? 'Restore project' : 'Move project to deleted state'}
      description={
        restoring
          ? `Restore "${project.projectName}" so it becomes available in the active project list again.`
          : `Move "${project.projectName}" to the deleted state. The project can still be restored later.`
      }
      confirmLabel={restoring ? 'Restore' : 'Delete'}
      danger={!restoring}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
