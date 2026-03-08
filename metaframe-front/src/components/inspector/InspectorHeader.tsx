// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Typography } from 'antd'

import { StatusChip } from '@/components/common/StatusChip'
import type { ManagedFileNode } from '@/types/file-tree.types'
import type { CanonicalPageModel } from '@/types/canonical-model'

const { Text, Title } = Typography

interface InspectorHeaderProps {
  activeFile: ManagedFileNode
  activePage: CanonicalPageModel | null
}

// The header gives the right pane a stable summary even while editor details change underneath.
export function InspectorHeader({ activeFile, activePage }: InspectorHeaderProps) {
  return (
    <div className="inspector-panel__header">
      <Text className="inspector-panel__eyebrow">Inspector</Text>
      <Title level={4}>{activeFile.name}</Title>
      <Text className="inspector-panel__path">{activeFile.path}</Text>
      <div className="inspector-chip-list">
        <StatusChip
          status={activeFile.isProtected ? 'readOnly' : 'dirty'}
          label={activeFile.managedType}
        />
        {activePage ? <StatusChip status={activePage.stateFlags.dirty ? 'dirty' : 'synced'} /> : null}
      </div>
    </div>
  )
}
