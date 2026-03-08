// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'

import { useEditorStore } from '@/store'

// Viewport switching is isolated so responsive work can reuse the same control in preview later.
export function ViewportSwitcher() {
  const viewport = useEditorStore((state) => state.viewport)
  const setViewport = useEditorStore((state) => state.setViewport)

  return (
    <Space.Compact>
      <Tooltip title="Desktop (100%)">
        <Button
          type={viewport === 'desktop' ? 'primary' : 'default'}
          icon={<DesktopOutlined />}
          onClick={() => setViewport('desktop')}
        />
      </Tooltip>
      <Tooltip title="Tablet (768px)">
        <Button
          type={viewport === 'tablet' ? 'primary' : 'default'}
          icon={<TabletOutlined />}
          onClick={() => setViewport('tablet')}
        />
      </Tooltip>
      <Tooltip title="Mobile (375px)">
        <Button
          type={viewport === 'mobile' ? 'primary' : 'default'}
          icon={<MobileOutlined />}
          onClick={() => setViewport('mobile')}
        />
      </Tooltip>
    </Space.Compact>
  )
}
