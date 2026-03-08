// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ReactNode } from 'react'

import {
  CloudSyncOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'

import { CurrentPathBreadcrumb } from '@/components/status-bar/CurrentPathBreadcrumb'
import { buildFilePath, buildNodePath } from '@/utils/fileTree'
import {
  useConsoleStore,
  useDesignCanvasStore,
  useEditorStore,
  useEditorTabsStore,
  useExportStore,
  useFileTreeStore,
  usePreviewStore,
  useSaveStore,
  useSelectionStore,
} from '@/store'

import '@/assets/css/status-bar.css'

const { Text } = Typography

function StatusSystemItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode
  label: string
  active?: boolean
}) {
  return (
    <Tooltip title={label}>
      <span className={`status-bar__system-item ${active ? 'status-bar__system-item--active' : ''}`}>
        {icon}
        <span>{label}</span>
      </span>
    </Tooltip>
  )
}

// Status bar owns verbose system feedback that would be too noisy in the header.
export function StatusBar() {
  const activeFileId = useEditorTabsStore((state) => state.activeFileId)
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)
  const hoveredNodeId = useSelectionStore((state) => state.hoveredNodeId)
  const pagesByFileId = useEditorStore((state) => state.pagesByFileId)
  const mode = useEditorStore((state) => state.mode)
  const viewport = useEditorStore((state) => state.viewport)
  const responsiveLayer = useEditorStore((state) => state.responsiveLayer)
  const collaboration = useEditorStore((state) => state.collaboration)
  const files = useFileTreeStore((state) => state.files)
  const previewState = usePreviewStore((state) => state.previewState)
  const saveState = useSaveStore((state) => state.saveState)
  const exportState = useExportStore((state) => state.exportState)
  const consoleErrors = useConsoleStore((state) => state.consoleErrors)
  const renderedCanvasState = useDesignCanvasStore((state) => state.renderedCanvasState)

  const activePage = activeFileId ? pagesByFileId[activeFileId] ?? null : null
  const fileTrail = buildFilePath(files, activeFileId)
  const nodeTrail = buildNodePath(activePage, selectedNodeId)

  let statusMessage = 'Managed workspace ready.'

  if (activePage?.stateFlags.conflict) {
    statusMessage = 'Conflict detected. Merge or restore before saving.'
  } else if (activePage?.stateFlags.parseError) {
    statusMessage = 'Reverse parse error. Source changes are partially locked.'
  } else if (activePage?.stateFlags.dirty) {
    statusMessage = 'Unsaved Canonical Model changes are waiting for persistence.'
  } else if (collaboration.revisionBehind) {
    statusMessage = 'A newer revision exists on the workspace. Refresh before export.'
  } else if (previewState === 'error') {
    statusMessage = 'Preview runtime reported an error. Check the console panel.'
  }

  return (
    <div className="status-bar">
      <CurrentPathBreadcrumb fileTrail={fileTrail} nodeTrail={nodeTrail} />

      <div className="status-bar__section status-bar__section--message">
        <Text>{statusMessage}</Text>
      </div>

      <div className="status-bar__section status-bar__section--system">
        <StatusSystemItem
          icon={<CloudSyncOutlined />}
          label={saveState === 'saving' ? 'Saving' : activePage?.stateFlags.dirty ? 'Dirty' : 'Synced'}
          active={saveState === 'saving' || Boolean(activePage?.stateFlags.dirty)}
        />
        <StatusSystemItem
          icon={<TeamOutlined />}
          label={`${collaboration.activeEditors} editors`}
          active={collaboration.activeEditors > 1}
        />
        <StatusSystemItem
          icon={<LockOutlined />}
          label={`${collaboration.lockState} lock`}
          active={collaboration.lockState !== 'none'}
        />
        <StatusSystemItem
          icon={<ExclamationCircleOutlined />}
          label={
            activePage?.stateFlags.nonExportable
              ? 'Export blocked'
              : exportState === 'inProgress'
                ? 'Exporting'
                : 'Export ready'
          }
          active={Boolean(activePage?.stateFlags.nonExportable) || exportState === 'inProgress'}
        />
      </div>

      <div className="status-bar__section status-bar__section--mode">
        <Text>{mode.toUpperCase()}</Text>
        <span className="status-bar__dot" />
        <Text>{viewport}</Text>
        <span className="status-bar__dot" />
        <Text>{responsiveLayer}</Text>
        <span className="status-bar__dot" />
        <Text>{renderedCanvasState.nodeCount} nodes</Text>
        {hoveredNodeId ? (
          <>
            <span className="status-bar__dot" />
            <Text>hover {hoveredNodeId}</Text>
          </>
        ) : null}
        {consoleErrors > 0 ? (
          <>
            <span className="status-bar__dot" />
            <Text>{consoleErrors} preview errors</Text>
          </>
        ) : null}
      </div>
    </div>
  )
}
