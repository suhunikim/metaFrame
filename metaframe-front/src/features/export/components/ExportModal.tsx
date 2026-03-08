// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useMemo } from 'react'

import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Alert, Button, Modal, Radio, Space, Typography } from 'antd'

import { useExportStore } from '@/store'

const { Text } = Typography

interface ExportModalProps {
  open: boolean
  onClose: () => void
  activeRoute: string | null
  blocked: boolean
}

// ExportModal keeps validation visible so export readiness is never hidden behind a single button click.
export function ExportModal({ open, onClose, activeRoute, blocked }: ExportModalProps) {
  const mode = useExportStore((state) => state.exportOptionDraft.mode)
  const exportState = useExportStore((state) => state.exportState)
  const setExportMode = useExportStore((state) => state.setExportMode)
  const startExport = useExportStore((state) => state.startExport)
  const exportable = !blocked

  const validationTone = useMemo(() => {
    if (blocked) {
      return {
        type: 'error' as const,
        title: 'Export is blocked',
        description: 'Resolve non-exportable state before starting the export pipeline.',
      }
    }

    return {
      type: 'success' as const,
      title: 'Export can start',
      description: 'Current managed snapshot passed the lightweight UI validation stage.',
    }
  }, [blocked])

  return (
    <Modal
      open={open}
      title={
        <span>
          <CloudUploadOutlined style={{ marginRight: 8 }} />
          Export managed snapshot
        </span>
      }
      onCancel={() => {
        onClose()
      }}
      footer={[
        <Button
          key="close"
          onClick={() => {
            onClose()
          }}
        >
          Close
        </Button>,
        <Button
          key="start"
          type="primary"
          disabled={!exportable || exportState === 'inProgress'}
          loading={exportState === 'inProgress'}
          onClick={() => {
            void startExport()
          }}
        >
          Start export
        </Button>,
      ]}
      width={600}
      centered
    >
      <Space direction="vertical" size={16} style={{ display: 'flex' }}>
        <Alert
          type={validationTone.type}
          showIcon
          message={validationTone.title}
          description={validationTone.description}
        />

        <div>
          <Text strong>Export scope</Text>
          <Radio.Group
            style={{ display: 'flex', marginTop: 10, gap: 10 }}
            value={mode}
            onChange={(event) => setExportMode(event.target.value)}
          >
            <Radio.Button value="project">Project ZIP</Radio.Button>
            <Radio.Button value="page">Active page JSON</Radio.Button>
          </Radio.Group>
        </div>

        <Alert
          type="info"
          showIcon
          icon={<WarningOutlined />}
          message="Current selection"
          description={activeRoute ? `Active managed route: ${activeRoute}` : 'No active managed route is selected.'}
        />

        {exportState === 'success' ? (
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            message="Export queued"
            description={`The ${mode === 'project' ? 'project archive' : 'page snapshot'} export flow is staged. The backend export job package will replace this local confirmation.`}
          />
        ) : null}
      </Space>
    </Modal>
  )
}
