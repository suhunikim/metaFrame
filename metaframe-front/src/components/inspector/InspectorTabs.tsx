// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ReactNode } from 'react'

import { Empty, Segmented, Space, Typography } from 'antd'

import { StatusChip } from '@/components/common/StatusChip'
import { resolveNodeStyle, summarizeNodeType } from '@/core/canonicalModelUtils'
import type { ManagedFileNode } from '@/types/file-tree.types'
import type {
  CanonicalNodeModel,
  CanonicalPageModel,
  ResponsiveLayer,
} from '@/types/canonical-model'

const { Text } = Typography

interface InspectorTabsProps {
  activeFile: ManagedFileNode
  activePage: CanonicalPageModel | null
  selectedNode: CanonicalNodeModel | null
  hoveredNode: CanonicalNodeModel | null
  responsiveLayer: ResponsiveLayer
  collaborationSummary: string
  onResponsiveLayerChange: (value: ResponsiveLayer) => void
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="inspector-section">
      <div className="inspector-section__header">
        <Text strong>{title}</Text>
      </div>
      <div className="inspector-section__body">{children}</div>
    </section>
  )
}

// Inspector tabs expose the package skeleton now, and feature-specific editors can fill each body later.
export function InspectorTabs({
  activeFile,
  activePage,
  selectedNode,
  hoveredNode,
  responsiveLayer,
  collaborationSummary,
  onResponsiveLayerChange,
}: InspectorTabsProps) {
  const resolvedStyle = selectedNode ? resolveNodeStyle(selectedNode, responsiveLayer) : null

  return (
    <div className="inspector-panel__body">
      <Section title="Document">
        <div className="inspector-grid">
          <div className="inspector-grid__item">
            <span>Managed type</span>
            <strong>{activeFile.managedType}</strong>
          </div>
          <div className="inspector-grid__item">
            <span>Route</span>
            <strong>{activePage?.routePath ?? 'Not managed yet'}</strong>
          </div>
          <div className="inspector-grid__item">
            <span>Layout</span>
            <strong>{activePage?.layoutId ?? 'Pending'}</strong>
          </div>
          <div className="inspector-grid__item">
            <span>Revision</span>
            <strong>{activePage?.revision ?? '-'}</strong>
          </div>
        </div>
      </Section>

      <Section title="Responsive">
        <Segmented
          block
          value={responsiveLayer}
          options={[
            { label: 'Base', value: 'base' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Mobile', value: 'mobile' },
          ]}
          onChange={(value) => onResponsiveLayerChange(value as ResponsiveLayer)}
        />
      </Section>

      <Section title="Selection">
        {selectedNode ? (
          <>
            <Space size={8} wrap>
              <StatusChip status="warning" label={summarizeNodeType(selectedNode)} />
              <StatusChip
                status={selectedNode.metadata.locked ? 'locked' : 'synced'}
                label={selectedNode.metadata.locked ? 'Locked' : 'Editable'}
              />
            </Space>

            <div className="inspector-grid">
              <div className="inspector-grid__item">
                <span>Node ID</span>
                <strong>{selectedNode.id}</strong>
              </div>
              <div className="inspector-grid__item">
                <span>Children</span>
                <strong>{selectedNode.children.length}</strong>
              </div>
              <div className="inspector-grid__item">
                <span>Bindings</span>
                <strong>{selectedNode.bindings.length}</strong>
              </div>
              <div className="inspector-grid__item">
                <span>Events</span>
                <strong>{selectedNode.events.length}</strong>
              </div>
            </div>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Select a node from the design surface to inspect bindings, events, and style overrides."
          />
        )}

        {hoveredNode && hoveredNode.id !== selectedNode?.id ? (
          <div className="inspector-list" style={{ marginTop: 12 }}>
            <div className="inspector-list__item">
              <span>Hover target</span>
              <strong>{hoveredNode.name}</strong>
            </div>
          </div>
        ) : null}
      </Section>

      <Section title="Styles">
        {resolvedStyle ? (
          <div className="inspector-style-list">
            {Object.entries(resolvedStyle).map(([key, value]) => (
              <div key={key} className="inspector-style-list__row">
                <span>{key}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <Text className="inspector-panel__hint">
            The current file has no selected node style payload yet.
          </Text>
        )}
      </Section>

      <Section title="Events / Variables / Data">
        <div className="inspector-list">
          <div className="inspector-list__item">
            <span>Events editor</span>
            <strong>Package P-606 pending</strong>
          </div>
          <div className="inspector-list__item">
            <span>Variables editor</span>
            <strong>Package P-607 pending</strong>
          </div>
          <div className="inspector-list__item">
            <span>Data tab</span>
            <strong>Package P-608 pending</strong>
          </div>
        </div>
      </Section>

      <div className="inspector-panel__footer">
        <div>
          <Text className="inspector-panel__footer-label">Collaboration</Text>
          <Text className="inspector-panel__footer-value">{collaborationSummary}</Text>
        </div>
      </div>
    </div>
  )
}
