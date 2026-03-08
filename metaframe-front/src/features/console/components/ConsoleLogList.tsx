// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Typography } from 'antd'

import type { ConsoleLogEntry } from '@/store/consoleStore'
import { formatDateTime } from '@/utils/dateFormat'

const { Text } = Typography

interface ConsoleLogListProps {
  logs: ConsoleLogEntry[]
}

// ConsoleLogList renders preview/runtime events in a compact, scannable strip.
export function ConsoleLogList({ logs }: ConsoleLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="console-panel__empty">
        Preview/runtime logs will appear here after the preview frame starts posting events.
      </div>
    )
  }

  return (
    <div className="console-panel__list">
      {logs.map((entry) => (
        <div key={entry.id} className={`console-panel__row console-panel__row--${entry.level}`}>
          <span className="console-panel__level">{entry.level.toUpperCase()}</span>
          <Text className="console-panel__message">{entry.message}</Text>
          <span className="console-panel__timestamp">{formatDateTime(entry.timestamp)}</span>
        </div>
      ))}
    </div>
  )
}
