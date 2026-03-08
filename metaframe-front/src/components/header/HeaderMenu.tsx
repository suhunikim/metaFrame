// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  CloudUploadOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

interface HeaderMenuProps {
  onCreateProject: () => void
  onOpenProject: () => void
  onSave: () => void
  onExport: () => void
  onSettings: () => void
}

// Menu actions stay explicit here so the header avoids a monolithic config file.
export function HeaderMenu({
  onCreateProject,
  onOpenProject,
  onSave,
  onExport,
  onSettings,
}: HeaderMenuProps) {
  const items = [
    {
      key: 'new-project',
      icon: <FolderAddOutlined />,
      label: 'New Project...',
      onClick: onCreateProject,
    },
    {
      key: 'open-project',
      icon: <FolderOpenOutlined />,
      label: 'Open Project...',
      onClick: onOpenProject,
    },
    { type: 'divider' as const },
    {
      key: 'save',
      icon: <SaveOutlined />,
      label: 'Save...',
      onClick: onSave,
    },
    {
      key: 'export',
      icon: <CloudUploadOutlined />,
      label: 'Export...',
      onClick: onExport,
    },
    { type: 'divider' as const },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: onSettings,
    },
  ]

  return (
    <Dropdown menu={{ items, className: 'header-dropdown-menu' }} trigger={['click']}>
      <Button type="text" style={{ color: 'var(--mf-text-primary)' }}>
        Menu
      </Button>
    </Dropdown>
  )
}
