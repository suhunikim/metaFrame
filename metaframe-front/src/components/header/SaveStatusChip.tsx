// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Tooltip } from 'antd'

import { StatusChip } from '@/components/common/StatusChip'
import type { SaveLifecycleState } from '@/store/saveStore'

interface SaveStatusChipProps {
  dirty: boolean
  saveState?: SaveLifecycleState
}

// Header save state stays compact and points detailed guidance down to the status bar.
export function SaveStatusChip({ dirty, saveState = 'idle' }: SaveStatusChipProps) {
  const tone =
    saveState === 'failed'
      ? { status: 'conflict' as const, label: 'Save failed' }
      : saveState === 'saving'
        ? { status: 'warning' as const, label: 'Saving...' }
        : dirty
          ? { status: 'dirty' as const, label: 'Dirty' }
          : { status: 'synced' as const, label: 'Synced' }

  return (
    <Tooltip
      title={
        saveState === 'failed'
          ? 'The last save attempt failed and needs review.'
          : saveState === 'saving'
            ? 'A save request is currently being processed.'
            : dirty
          ? 'The active managed document has unsaved Canonical Model changes.'
          : 'The active managed document matches the latest saved revision.'
      }
    >
      <span>
        <StatusChip status={tone.status} label={tone.label} />
      </span>
    </Tooltip>
  )
}
