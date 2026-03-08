// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useMemo } from 'react'

import { CheckCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { Alert, Button, List, Modal, Space, Typography } from 'antd'

import { useSaveStore } from '@/store'

const { Text } = Typography

interface SaveScopeItem {
  key: string
  label: string
  detail: string
}

interface SaveScopeModalProps {
  open: boolean
  onClose: () => void
  scopes: SaveScopeItem[]
}

// SaveScopeModal keeps save intent explicit until the backend save and revision packages land.
export function SaveScopeModal({ open, onClose, scopes }: SaveScopeModalProps) {
  const saveState = useSaveStore((state) => state.saveState)
  const saveAllState = useSaveStore((state) => state.saveAllState)
  const runSave = useSaveStore((state) => state.runSave)
  const dirtyCount = scopes.length

  const summary = useMemo(() => {
    if (dirtyCount === 0) {
      return 'No dirty managed scope is waiting for persistence.'
    }

    return `${dirtyCount} managed scope${dirtyCount > 1 ? 's are' : ' is'} queued for the next save call.`
  }, [dirtyCount])

  return (
    <Modal
      open={open}
      title={
        <span>
          <SaveOutlined style={{ marginRight: 8 }} />
          Save managed scopes
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
          key="save-all"
          loading={saveAllState === 'saving'}
          disabled={dirtyCount === 0}
          onClick={() => {
            void runSave(true)
          }}
        >
          Save all
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saveState === 'saving'}
          disabled={dirtyCount === 0}
          onClick={() => {
            void runSave(false)
          }}
        >
          Save current scopes
        </Button>,
      ]}
      width={620}
      centered
    >
      <Space direction="vertical" size={16} style={{ display: 'flex' }}>
        <Alert
          type={dirtyCount > 0 ? 'warning' : 'success'}
          showIcon
          message={summary}
          description="The revision API will replace this local confirmation step in the next package wave."
        />

        <List
          bordered
          locale={{ emptyText: 'Nothing is dirty right now.' }}
          dataSource={scopes}
          renderItem={(scope) => (
            <List.Item>
              <List.Item.Meta
                title={scope.label}
                description={<Text type="secondary">{scope.detail}</Text>}
              />
            </List.Item>
          )}
        />

        {saveState === 'success' || saveAllState === 'success' ? (
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            message="Save request staged"
            description="This package closes the UI flow. The real revision persistence package will replace the local confirmation."
          />
        ) : null}
      </Space>
    </Modal>
  )
}
