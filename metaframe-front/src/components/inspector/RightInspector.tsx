// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Empty } from 'antd'

import { InspectorHeader } from '@/components/inspector/InspectorHeader'
import { InspectorTabs } from '@/components/inspector/InspectorTabs'
import {
  useEditorStore,
  useEditorTabsStore,
  useFileTreeStore,
  useSelectionStore,
} from '@/store'
import { findFileNodeById } from '@/utils/fileTree'

import '@/assets/css/right-inspector.css'

// Right inspector reads from shell stores only; feature-specific tabs can grow underneath.
export function RightInspector() {
  const activeFileId = useEditorTabsStore((state) => state.activeFileId)
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)
  const hoveredNodeId = useSelectionStore((state) => state.hoveredNodeId)
  const responsiveLayer = useEditorStore((state) => state.responsiveLayer)
  const pagesByFileId = useEditorStore((state) => state.pagesByFileId)
  const collaboration = useEditorStore((state) => state.collaboration)
  const setResponsiveLayer = useEditorStore((state) => state.setResponsiveLayer)
  const files = useFileTreeStore((state) => state.files)

  const activeFile = findFileNodeById(files, activeFileId)
  const activePage = activeFileId ? pagesByFileId[activeFileId] ?? null : null
  const selectedNode =
    activePage && selectedNodeId ? activePage.nodes[selectedNodeId] ?? null : null
  const hoveredNode =
    activePage && hoveredNodeId ? activePage.nodes[hoveredNodeId] ?? null : null

  if (!activeFile) {
    return (
      <div className="inspector-panel inspector-panel--empty">
        <Empty description="Select a managed file to inspect its Canonical metadata." />
      </div>
    )
  }

  return (
    <div className="inspector-panel">
      <InspectorHeader activeFile={activeFile} activePage={activePage} />
      <InspectorTabs
        activeFile={activeFile}
        activePage={activePage}
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        responsiveLayer={responsiveLayer}
        collaborationSummary={`${collaboration.activeEditors} editors, ${collaboration.lockState} lock`}
        onResponsiveLayerChange={setResponsiveLayer}
      />
    </div>
  )
}
