// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Alert, Modal, Typography } from 'antd'

const { Paragraph } = Typography

interface ConfirmDangerModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// ConfirmDangerModal standardizes destructive confirmations so delete and restore flows share the same language.
export function ConfirmDangerModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  loading = false,
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDangerModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmLabel}
      okButtonProps={{ danger, loading }}
      centered
    >
      <Alert
        type={danger ? 'warning' : 'info'}
        showIcon
        icon={<ExclamationCircleOutlined />}
        message="Please review the impact before continuing."
        style={{ marginBottom: 16 }}
      />
      <Paragraph style={{ marginBottom: 0, color: 'var(--mf-text-secondary)' }}>
        {description}
      </Paragraph>
    </Modal>
  )
}
