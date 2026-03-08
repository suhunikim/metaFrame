// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  CodeOutlined,
  EyeOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons'
import { Segmented } from 'antd'

import type { EditorMode } from '@/types/canonical-model'

interface EditorModeTabsProps {
  mode: EditorMode
  onChange: (mode: EditorMode) => void
}

// Mode tabs stay isolated so design, source, and preview can evolve independently.
export function EditorModeTabs({ mode, onChange }: EditorModeTabsProps) {
  return (
    <Segmented
      value={mode}
      options={[
        {
          label: (
            <span className="editor-toolbar__mode-option">
              <NodeIndexOutlined />
              Design
            </span>
          ),
          value: 'design',
        },
        {
          label: (
            <span className="editor-toolbar__mode-option">
              <CodeOutlined />
              Source
            </span>
          ),
          value: 'source',
        },
        {
          label: (
            <span className="editor-toolbar__mode-option">
              <EyeOutlined />
              Preview
            </span>
          ),
          value: 'preview',
        },
      ]}
      onChange={(nextMode) => onChange(nextMode as EditorMode)}
    />
  )
}
