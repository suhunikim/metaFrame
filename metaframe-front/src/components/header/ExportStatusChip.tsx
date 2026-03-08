// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Tooltip } from 'antd'

import { StatusChip } from '@/components/common/StatusChip'
import type { ExportLifecycleState } from '@/store/exportStore'

interface ExportStatusChipProps {
  exportable: boolean
  blocked: boolean
  exportState?: ExportLifecycleState
}

// Export status advertises readiness without duplicating the full validation report in the header.
export function ExportStatusChip({
  exportable,
  blocked,
  exportState = 'idle',
}: ExportStatusChipProps) {
  const status =
    blocked
      ? 'nonExportable'
      : exportState === 'inProgress'
        ? 'warning'
        : exportable
          ? 'exportable'
          : 'warning'
  const label = blocked ? 'Blocked' : exportState === 'inProgress' ? 'Exporting' : exportable ? 'Export ready' : 'Pending'

  return (
    <Tooltip
      title={
        blocked
          ? 'Fix blocking issues before export.'
          : exportState === 'inProgress'
            ? 'An export job is currently being prepared.'
          : exportable
            ? 'The active document can be exported.'
            : 'Export validation has not finished yet.'
      }
    >
      <span>
        <StatusChip status={status} label={label} />
      </span>
    </Tooltip>
  )
}
