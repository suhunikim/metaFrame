// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Tooltip } from 'antd'

import { StatusChip } from '@/components/common/StatusChip'
import type { CollaborationSummary } from '@/store/editorStore'

interface CollaborationStatusChipProps {
  collaboration: CollaborationSummary
}

// Collaboration summary is intentionally short in the header and detailed in the status bar.
export function CollaborationStatusChip({ collaboration }: CollaborationStatusChipProps) {
  const status = collaboration.lockState !== 'none' || collaboration.revisionBehind ? 'locked' : 'warning'
  const label =
    collaboration.lockState !== 'none'
      ? `${collaboration.lockState} lock`
      : `${collaboration.activeEditors} editors`

  return (
    <Tooltip
      title={`Editors: ${collaboration.activeEditors}, lock: ${collaboration.lockState}, revision behind: ${
        collaboration.revisionBehind ? 'yes' : 'no'
      }`}
    >
      <span>
        <StatusChip status={status} label={label} />
      </span>
    </Tooltip>
  )
}
