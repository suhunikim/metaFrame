// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo } from 'react'

import Editor from '@monaco-editor/react'
import { Alert, Space, Tag, Typography } from 'antd'

import { useSourceEditorStore } from '@/store/sourceEditorStore'
import { useThemeMode } from '@/theme'

const { Text } = Typography

interface SourceEditorTabProps {
  fileId: string
  fileName: string
  initialSource: string
}

function guessLanguage(fileName: string) {
  if (fileName.endsWith('.css')) {
    return 'css'
  }

  if (fileName.endsWith('.ts')) {
    return 'typescript'
  }

  return 'typescript'
}

// SourceEditorTab keeps the first Monaco integration focused on buffer state and visible dirty feedback.
export function SourceEditorTab({ fileId, fileName, initialSource }: SourceEditorTabProps) {
  const { mode } = useThemeMode()
  const sourceBuffer = useSourceEditorStore((state) => state.sourceBuffers[fileId])
  const ensureBuffer = useSourceEditorStore((state) => state.ensureBuffer)
  const updateBuffer = useSourceEditorStore((state) => state.updateBuffer)
  const setActiveSourceFileId = useSourceEditorStore((state) => state.setActiveSourceFileId)

  useEffect(() => {
    ensureBuffer(fileId, initialSource)
    setActiveSourceFileId(fileId)

    return () => {
      setActiveSourceFileId(null)
    }
  }, [ensureBuffer, fileId, initialSource, setActiveSourceFileId])

  const language = useMemo(() => guessLanguage(fileName), [fileName])

  return (
    <div className="editor-source">
      <div className="editor-source__meta">
        <Space size={8} wrap>
          <Tag color="blue">Monaco</Tag>
          <Tag color={sourceBuffer?.dirty ? 'gold' : 'green'}>
            {sourceBuffer?.dirty ? 'Dirty buffer' : 'Synced buffer'}
          </Tag>
          <Text>{fileName}</Text>
        </Space>
      </div>

      <Alert
        type="info"
        showIcon
        message="Source editing is connected to buffer state."
        description="Reverse parsing, line-level diagnostics, and save-to-revision integration will land in the next source package."
        style={{ margin: '12px 16px 0' }}
      />

      <div className="editor-source__editor">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme={mode === 'dark' ? 'vs-dark' : 'light'}
          value={sourceBuffer?.value ?? initialSource}
          onChange={(value) => updateBuffer(fileId, value ?? '')}
          options={{
            automaticLayout: true,
            fontFamily: 'Cascadia Code, JetBrains Mono, monospace',
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  )
}
