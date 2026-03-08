// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Button, Space, Tag, Typography } from 'antd'
import type { TabsProps } from 'antd'

import { EmptyState } from '@/components/common/EmptyState'
import { StatusChip } from '@/components/common/StatusChip'
import { ConsolePanel } from '@/features/console/components/ConsolePanel'
import { DesignCanvas } from '@/features/design/components/DesignCanvas'
import { PreviewTab } from '@/features/preview/components/PreviewTab'
import { SourceEditorTab } from '@/features/source/components/SourceEditorTab'
import { EditorModeTabs } from '@/components/workspace/EditorModeTabs'
import { OpenTabItem } from '@/components/workspace/OpenTabItem'
import { OpenTabsBar } from '@/components/workspace/OpenTabsBar'
import { deriveStatusChips, generateSourceFromPage } from '@/core/canonicalModelUtils'
import {
  useConsoleStore,
  useEditorStore,
  useEditorTabsStore,
  useFileTreeStore,
  usePreviewStore,
} from '@/store'
import type { CanonicalPageModel, EditorMode, ResponsiveLayer } from '@/types/canonical-model'
import { findFileNodeById } from '@/utils/fileTree'

import '@/assets/css/center-workspace.css'

const { Text, Title } = Typography

function renderWorkspace(
  fileId: string,
  fileName: string,
  model: CanonicalPageModel | null,
  mode: EditorMode,
  layer: ResponsiveLayer,
  viewport: 'desktop' | 'tablet' | 'mobile',
) {
  if (!model && mode !== 'source') {
    return (
      <EmptyState
        title={`${fileName} is not attached to a managed page model yet`}
        description="Layout, general, and protected files will join the unified editor after backend-backed managed file metadata arrives."
      />
    )
  }

  if (mode === 'source') {
    const source = model
      ? generateSourceFromPage(model, layer)
      : `// ${fileName}\n// Source editing for non-managed files will connect after the filesystem and reverse-parse pipeline lands.`

    return <SourceEditorTab fileId={fileId} fileName={fileName} initialSource={source} />
  }

  if (!model) {
    return null
  }

  if (mode === 'preview') {
    return <PreviewTab model={model} layer={layer} viewport={viewport} />
  }

  return <DesignCanvas model={model} layer={layer} />
}

function ModeBadge({ mode }: { mode: EditorMode }) {
  const tone =
    mode === 'design'
      ? { color: 'gold', label: 'Design' }
      : mode === 'source'
        ? { color: 'geekblue', label: 'Source' }
        : { color: 'green', label: 'Preview' }

  return <Tag color={tone.color}>{tone.label}</Tag>
}

// Center workspace combines tab state with the Canonical document surfaces.
export function CenterWorkspace() {
  const mode = useEditorStore((state) => state.mode)
  const viewport = useEditorStore((state) => state.viewport)
  const responsiveLayer = useEditorStore((state) => state.responsiveLayer)
  const pagesByFileId = useEditorStore((state) => state.pagesByFileId)
  const setMode = useEditorStore((state) => state.setMode)
  const openFileIds = useEditorTabsStore((state) => state.openFileIds)
  const activeFileId = useEditorTabsStore((state) => state.activeFileId)
  const openFile = useEditorTabsStore((state) => state.openFile)
  const closeFile = useEditorTabsStore((state) => state.closeFile)
  const files = useFileTreeStore((state) => state.files)
  const selectFile = useFileTreeStore((state) => state.selectFile)
  const previewState = usePreviewStore((state) => state.previewState)
  const consoleLogs = useConsoleStore((state) => state.consoleLogs)

  const items: TabsProps['items'] = openFileIds.map((fileId) => {
    const fileNode = findFileNodeById(files, fileId)
    const model = pagesByFileId[fileId] ?? null
    const statusChips = model ? deriveStatusChips(model.stateFlags).slice(0, 2) : []

    return {
      key: fileId,
      label: (
        <OpenTabItem name={fileNode?.name ?? fileId} dirty={Boolean(model?.stateFlags.dirty)} />
      ),
      closable: true,
      children: (
        <div className="editor-workspace">
          <div className="editor-toolbar">
            <div className="editor-toolbar__title">
              <Title level={5}>{fileNode?.name ?? 'Unknown file'}</Title>
              <Space size={8} wrap>
                <ModeBadge mode={mode} />
                <Tag>{fileNode?.managedType ?? 'file'}</Tag>
                {model ? <Tag color="cyan">{model.routePath}</Tag> : null}
                {model ? <Tag color="purple">rev {model.revision}</Tag> : null}
              </Space>
            </div>

            <div className="editor-toolbar__controls">
              <EditorModeTabs mode={mode} onChange={setMode} />
            </div>
          </div>

          <div className="editor-workspace__meta">
            <div className="editor-workspace__meta-line">
              <Text>Responsive layer: {responsiveLayer}</Text>
              {model ? <Text>Layout: {model.layoutId}</Text> : null}
              {fileNode?.path ? <Text>Path: {fileNode.path}</Text> : null}
            </div>

            <div className="editor-workspace__chips">
              {mode === 'preview' ? (
                <StatusChip
                  status={previewState === 'error' ? 'parseError' : previewState === 'ready' ? 'synced' : 'warning'}
                  label={`Preview ${previewState}`}
                />
              ) : null}
              {consoleLogs.length > 0 ? (
                <StatusChip status="warning" label={`Console ${consoleLogs.length}`} />
              ) : null}
              {statusChips.map((chip) => (
                <StatusChip key={`${fileId}-${chip.label}`} status={chip.tone} label={chip.label} />
              ))}
            </div>
          </div>

          <div className="editor-workspace__surface">
            {renderWorkspace(
              fileId,
              fileNode?.name ?? fileId,
              model,
              mode,
              responsiveLayer,
              viewport,
            )}
          </div>

          <ConsolePanel />
        </div>
      ),
    }
  })

  if (items.length === 0) {
    return (
      <div className="editor-container">
        <EmptyState
          title="Open a managed file to begin"
          description="Choose a page, layout, or tracked source file from the left panel to continue editing."
          actions={<Button type="primary">Open Managed File</Button>}
        />
      </div>
    )
  }

  return (
    <div className="editor-container">
      <OpenTabsBar
        activeKey={activeFileId ?? items[0]?.key ?? ''}
        items={items}
        onChange={(fileId) => {
          openFile(fileId)
          selectFile(fileId)
        }}
        onClose={closeFile}
      />
    </div>
  )
}
