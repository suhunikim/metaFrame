// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  ClearOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { Badge, Button, Space, Typography } from 'antd'

import { ConsoleLogList } from '@/features/console/components/ConsoleLogList'
import { useConsoleStore } from '@/store'

import '@/assets/css/console-panel.css'

const { Text } = Typography

// ConsolePanel keeps runtime feedback visible without overwhelming the main design and source surfaces.
export function ConsolePanel() {
  const consoleLogs = useConsoleStore((state) => state.consoleLogs)
  const consoleErrors = useConsoleStore((state) => state.consoleErrors)
  const consoleOpen = useConsoleStore((state) => state.consoleOpen)
  const clearLogs = useConsoleStore((state) => state.clearLogs)
  const toggleConsoleOpen = useConsoleStore((state) => state.toggleConsoleOpen)

  return (
    <div className={`console-panel ${consoleOpen ? 'console-panel--open' : 'console-panel--closed'}`}>
      <div className="console-panel__header">
        <Space size={10}>
          <Badge count={consoleErrors} size="small" offset={[6, -2]}>
            <Text strong>Console</Text>
          </Badge>
          <Text type="secondary">{consoleLogs.length} entries</Text>
        </Space>

        <Space size={8}>
          <Button type="text" icon={<ClearOutlined />} onClick={clearLogs}>
            Clear
          </Button>
          <Button
            type="text"
            icon={consoleOpen ? <DownOutlined /> : <UpOutlined />}
            onClick={toggleConsoleOpen}
          >
            {consoleOpen ? 'Collapse' : 'Expand'}
          </Button>
        </Space>
      </div>

      {consoleOpen ? <ConsoleLogList logs={consoleLogs} /> : null}
    </div>
  )
}
