// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  AppstoreAddOutlined,
  DeploymentUnitOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'

import { useLeftPanelStore } from '@/store'
import type { LeftPanelTab } from '@/store/leftPanelStore'

const menuItems = [
  { key: 'files', icon: <FolderOpenOutlined />, label: '' },
  { key: 'router', icon: <DeploymentUnitOutlined />, label: '' },
  { key: 'palette', icon: <AppstoreAddOutlined />, label: '' },
  { key: 'global', icon: <GlobalOutlined />, label: '' },
  { key: 'assets', icon: <PictureOutlined />, label: '' },
]

// The activity bar only switches top-level panels so each feature can own its own body state.
export function ActivityBar() {
  const activeLeftPanelTab = useLeftPanelStore((state) => state.activeLeftPanelTab)
  const setActiveLeftPanelTab = useLeftPanelStore((state) => state.setActiveLeftPanelTab)

  return (
    <div className="left-activity-bar">
      <Menu
        mode="inline"
        selectedKeys={[activeLeftPanelTab]}
        items={menuItems}
        onClick={(event) => setActiveLeftPanelTab(event.key as LeftPanelTab)}
        theme="dark"
        style={{ backgroundColor: 'transparent' }}
      />
    </div>
  )
}
