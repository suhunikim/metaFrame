// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ReactNode } from 'react'

import '@/components/StatusChip.css'

export type StatusChipTone =
  | 'synced'
  | 'dirty'
  | 'warning'
  | 'locked'
  | 'conflict'
  | 'exportable'
  | 'nonExportable'
  | 'recovery'
  | 'parseError'
  | 'readOnly'

interface StatusChipProps {
  status: StatusChipTone
  label?: string
  icon?: ReactNode
}

const defaultLabels: Record<StatusChipTone, string> = {
  synced: 'Synced',
  dirty: 'Dirty',
  warning: 'Warning',
  locked: 'Locked',
  conflict: 'Conflict',
  exportable: 'Exportable',
  nonExportable: 'Non-exportable',
  recovery: 'Recovery',
  parseError: 'Parse Error',
  readOnly: 'Read Only',
}

// Centralize tone-to-label mapping so every status badge speaks the same language.
export function StatusChip({ status, label, icon }: StatusChipProps) {
  return (
    <span className={`status-chip status-chip--${status}`} aria-label={label ?? defaultLabels[status]}>
      {icon ?? <span className="status-chip__dot" aria-hidden="true" />}
      <span>{label ?? defaultLabels[status]}</span>
    </span>
  )
}
