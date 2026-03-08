// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Typography } from 'antd'

import { EmptyState } from '@/components/common/EmptyState'
import { ActivityBar } from '@/components/left-panel/ActivityBar'
import { FileExplorerPanel } from '@/features/file-tree/components/FileExplorerPanel'
import { useEditorStore, useLeftPanelStore } from '@/store'

import '@/assets/css/file-explorer.css'
import '@/assets/css/left-panel.css'

const { Text } = Typography

const panelCopy: Record<
  Exclude<ReturnType<typeof useLeftPanelStore.getState>['activeLeftPanelTab'], 'files'>,
  {
    title: string
    description: string
    items: string[]
  }
> = {
  router: {
    title: 'Router Map',
    description: 'Managed routes, layouts, and page ownership are staged here before inline editing is enabled.',
    items: ['HomePage -> /', 'MainLayout -> root layout', 'Protected routes -> backend policy pending'],
  },
  palette: {
    title: 'Component Registry',
    description: 'Registry-backed HTML and widget entries appear here before drag-and-drop is enabled.',
    items: ['HTML: section, article, header, footer', 'Widgets: Button, Input, Card, Table', 'Support levels: L0 to L3'],
  },
  global: {
    title: 'Project Settings',
    description: 'Global bindings, environment defaults, and export policy land here as the backend state expands.',
    items: ['Auth policy', 'Version catalog', 'Export target profile'],
  },
  assets: {
    title: 'Assets',
    description: 'Uploads, previews, and managed asset reuse will surface here once the asset APIs are wired.',
    items: ['Upload queue', 'Asset preview', 'Reference cleanup'],
  },
}

function PlaceholderPanel({ activeKey }: { activeKey: keyof typeof panelCopy }) {
  const content = panelCopy[activeKey]

  return (
    <div className="left-panel-placeholder">
      <Text className="left-panel-placeholder__title">{content.title}</Text>
      <Text className="left-panel-placeholder__description">{content.description}</Text>

      <div className="left-panel-placeholder__list">
        {content.items.map((item) => (
          <div key={item} className="left-panel-placeholder__item">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// Left panel shell swaps feature bodies without pulling the full implementation of each package into one file.
export function LeftPanel() {
  const activeLeftPanelTab = useLeftPanelStore((state) => state.activeLeftPanelTab)
  const mode = useEditorStore((state) => state.mode)

  return (
    <div className="left-panel-container">
      <ActivityBar />

      <div className="left-panel-content-area">
        <div className="left-panel-content-area__topbar">
          <Text className="left-panel-content-area__label">{activeLeftPanelTab}</Text>
          <Text className="left-panel-content-area__meta">{mode.toUpperCase()} mode</Text>
        </div>

        {activeLeftPanelTab === 'files' ? (
          <FileExplorerPanel />
        ) : panelCopy[activeLeftPanelTab] ? (
          <PlaceholderPanel activeKey={activeLeftPanelTab} />
        ) : (
          <EmptyState
            title="Panel unavailable"
            description="The selected left panel is not registered yet."
          />
        )}
      </div>
    </div>
  )
}
