// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Spin } from 'antd'
import { Typography } from 'antd'

import '@/assets/css/loading-overlay.css'

interface LoadingOverlayProps {
  label?: string
}

// Use one loading overlay so route bootstrapping and IDE hydration look the same.
export function LoadingOverlay({ label = 'Loading workspace...' }: LoadingOverlayProps) {
  return (
    <div className="global-spinner-overlay">
      <Spin size="large" />
      <Typography.Text type="secondary">{label}</Typography.Text>
    </div>
  )
}
