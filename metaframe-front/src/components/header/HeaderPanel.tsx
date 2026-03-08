// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo, useState } from 'react'

import {
  MenuFoldOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Input, Space, Tooltip, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { CollaborationStatusChip } from '@/components/header/CollaborationStatusChip'
import { ExportStatusChip } from '@/components/header/ExportStatusChip'
import { HeaderMenu } from '@/components/header/HeaderMenu'
import { ProjectSwitcher } from '@/components/header/ProjectSwitcher'
import { SaveStatusChip } from '@/components/header/SaveStatusChip'
import { ViewportSwitcher } from '@/components/header/ViewportSwitcher'
import OpenProjectModal from '@/components/modals/OpenProjectModal'
import { ExportModal } from '@/features/export/components/ExportModal'
import { CommandPalette } from '@/features/command-palette/components/CommandPalette'
import { NewProjectModal } from '@/features/project-home/components/NewProjectModal'
import { SaveScopeModal } from '@/features/save/components/SaveScopeModal'
import { SettingsModal } from '@/features/settings/components/SettingsModal'
import { useHotkeys } from '@/shared/hooks/useHotkeys'
import {
  useCommandPaletteStore,
  useEditorStore,
  useEditorTabsStore,
  useExportStore,
  useSaveStore,
} from '@/store'

import '@/assets/css/header-panel.css'

const { Text } = Typography

// HeaderPanel keeps global project actions visible without mixing verbose runtime detail into the top bar.
export function HeaderPanel() {
  const navigate = useNavigate()
  const currentProjectName = useEditorStore((state) => state.currentProjectName)
  const collaboration = useEditorStore((state) => state.collaboration)
  const pagesByFileId = useEditorStore((state) => state.pagesByFileId)
  const activeFileId = useEditorTabsStore((state) => state.activeFileId)
  const openPalette = useCommandPaletteStore((state) => state.openPalette)
  const saveModalOpen = useSaveStore((state) => state.saveModalOpen)
  const openSaveModal = useSaveStore((state) => state.openSaveModal)
  const closeSaveModal = useSaveStore((state) => state.closeSaveModal)
  const syncDirtyScopes = useSaveStore((state) => state.syncDirtyScopes)
  const saveState = useSaveStore((state) => state.saveState)
  const exportModalOpen = useExportStore((state) => state.exportModalOpen)
  const openExportModal = useExportStore((state) => state.openExportModal)
  const closeExportModal = useExportStore((state) => state.closeExportModal)
  const exportState = useExportStore((state) => state.exportState)
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [openProjectOpen, setOpenProjectOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const activePage = activeFileId ? pagesByFileId[activeFileId] ?? null : null
  const dirtyScopes = useMemo(() => {
    return Object.values(pagesByFileId)
      .filter((page) => page.stateFlags.dirty)
      .map((page) => ({
        key: page.fileId,
        label: page.routePath,
        detail: `Revision ${page.revision} | ${page.layoutId}`,
      }))
  }, [pagesByFileId])

  useEffect(() => {
    // Dirty scopes are derived once here so save UI, status bar, and future autosave read one source.
    syncDirtyScopes(dirtyScopes)
  }, [dirtyScopes, syncDirtyScopes])

  useHotkeys([
    {
      combo: 'mod+s',
      handler: () => openSaveModal(),
    },
    {
      combo: 'mod+shift+e',
      handler: () => openExportModal(),
    },
    {
      combo: 'mod+,',
      handler: () => setSettingsOpen(true),
    },
    {
      combo: 'mod+k',
      handler: () => openPalette(),
      allowInInputs: true,
    },
  ])

  return (
    <>
      <div className="header-panel">
        <div className="header-panel__left">
          <Tooltip title="Workspace navigation is already available in the left panel.">
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              className="header-panel__icon-button"
            />
          </Tooltip>

          <div className="header-panel__brand">
            <div className="header-panel__logo">MF</div>
            <div className="header-panel__brand-copy">
              <Text className="header-panel__product-name">MetaFrame IDE</Text>
              <Text className="header-panel__product-subtitle">Managed React workspace</Text>
            </div>
          </div>

          <ProjectSwitcher projectName={currentProjectName} />
        </div>

        <div className="header-panel__center">
          <ViewportSwitcher />

          <div className="header-panel__search">
            <Input
              readOnly
              value="Search files, commands, and pages"
              prefix={<SearchOutlined />}
              suffix={<Text className="header-panel__shortcut">Ctrl K</Text>}
              onClick={() => openPalette()}
            />
          </div>
        </div>

        <div className="header-panel__right">
          <div className="header-panel__status">
            <SaveStatusChip dirty={Boolean(activePage?.stateFlags.dirty)} saveState={saveState} />
            <CollaborationStatusChip collaboration={collaboration} />
            <ExportStatusChip
              exportable={Boolean(activePage?.stateFlags.exportable)}
              blocked={Boolean(activePage?.stateFlags.nonExportable)}
              exportState={exportState}
            />
          </div>

          <Space size={8}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewProjectOpen(true)}>
              New
            </Button>
            <HeaderMenu
              onCreateProject={() => setNewProjectOpen(true)}
              onOpenProject={() => setOpenProjectOpen(true)}
              onSave={() => openSaveModal()}
              onExport={() => openExportModal()}
              onSettings={() => setSettingsOpen(true)}
            />
            <Button type="text" onClick={() => navigate('/account/settings')}>
              Account
            </Button>
          </Space>
        </div>
      </div>

      <NewProjectModal open={newProjectOpen} onClose={() => setNewProjectOpen(false)} />
      <OpenProjectModal open={openProjectOpen} onClose={() => setOpenProjectOpen(false)} />
      <SaveScopeModal
        open={saveModalOpen}
        onClose={() => closeSaveModal()}
        scopes={dirtyScopes}
      />
      <ExportModal
        open={exportModalOpen}
        onClose={() => closeExportModal()}
        activeRoute={activePage?.routePath ?? null}
        blocked={Boolean(activePage?.stateFlags.nonExportable)}
      />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSave={() => openSaveModal()}
        onOpenExport={() => openExportModal()}
      />
    </>
  )
}
