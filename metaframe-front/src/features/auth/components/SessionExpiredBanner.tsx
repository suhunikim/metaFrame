// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Alert } from 'antd'

interface SessionExpiredBannerProps {
  visible: boolean
  onClose?: () => void
}

export function SessionExpiredBanner({ visible, onClose }: SessionExpiredBannerProps) {
  if (!visible) {
    return null
  }

  return (
    <Alert
      type="warning"
      showIcon
      closable={Boolean(onClose)}
      onClose={onClose}
      message="Session expired"
      description="Your previous session expired. Please sign in again to continue your work safely."
      style={{ marginBottom: 16 }}
    />
  )
}
