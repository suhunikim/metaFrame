// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

interface OpenTabsBarProps {
  activeKey: string
  items: TabsProps['items']
  onChange: (key: string) => void
  onClose: (key: string) => void
}

// Tabs are rendered in one place so close protection and active file syncing stay predictable.
export function OpenTabsBar({ activeKey, items, onChange, onClose }: OpenTabsBarProps) {
  return (
    <Tabs
      type="editable-card"
      hideAdd
      activeKey={activeKey}
      items={items}
      className="editor-tabs"
      tabBarGutter={0}
      animated={false}
      onChange={onChange}
      onEdit={(targetKey, action) => {
        if (action === 'remove' && typeof targetKey === 'string') {
          onClose(targetKey)
        }
      }}
    />
  )
}
