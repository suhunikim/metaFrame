// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo, useRef, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Input, Modal, Typography } from 'antd'
import type { InputRef } from 'antd'

import {
  useCommandPaletteStore,
  useEditorStore,
  useEditorTabsStore,
  useFileTreeStore,
} from '@/store'
import { findFileNodeById, flattenFileTree } from '@/utils/fileTree'

import '@/assets/css/command-palette.css'

const { Text } = Typography

interface CommandPaletteProps {
  onOpenSettings: () => void
  onOpenSave: () => void
  onOpenExport: () => void
}

interface PaletteEntry {
  id: string
  section: string
  title: string
  keywords: string[]
  run: () => void
}

// CommandPalette centralizes keyboard-driven navigation so search is not split across multiple mini UIs.
export function CommandPalette({
  onOpenSettings,
  onOpenSave,
  onOpenExport,
}: CommandPaletteProps) {
  const inputRef = useRef<InputRef | null>(null)
  const commandPaletteOpen = useCommandPaletteStore((state) => state.commandPaletteOpen)
  const commandPaletteQuery = useCommandPaletteStore((state) => state.commandPaletteQuery)
  const closePalette = useCommandPaletteStore((state) => state.closePalette)
  const setQuery = useCommandPaletteStore((state) => state.setQuery)
  const setMode = useEditorStore((state) => state.setMode)
  const setViewport = useEditorStore((state) => state.setViewport)
  const files = useFileTreeStore((state) => state.files)
  const selectFile = useFileTreeStore((state) => state.selectFile)
  const openFile = useEditorTabsStore((state) => state.openFile)
  const [activeIndex, setActiveIndex] = useState(0)

  const entries = useMemo<PaletteEntry[]>(() => {
    const flattenedFiles = flattenFileTree(files).filter((node) => node.kind === 'file')

    const fileEntries = flattenedFiles.map((node) => ({
      id: `file:${node.id}`,
      section: 'Files',
      title: `Open ${node.name}`,
      keywords: [node.name, node.path, node.managedType],
      run: () => {
        openFile(node.id)
        selectFile(node.id)
        closePalette()
      },
    }))

    return [
      {
        id: 'command:design',
        section: 'Commands',
        title: 'Switch to Design mode',
        keywords: ['design', 'canvas', 'editor'],
        run: () => {
          setMode('design')
          closePalette()
        },
      },
      {
        id: 'command:source',
        section: 'Commands',
        title: 'Switch to Source mode',
        keywords: ['source', 'monaco', 'code'],
        run: () => {
          setMode('source')
          closePalette()
        },
      },
      {
        id: 'command:preview',
        section: 'Commands',
        title: 'Switch to Preview mode',
        keywords: ['preview', 'iframe', 'runtime'],
        run: () => {
          setMode('preview')
          closePalette()
        },
      },
      {
        id: 'command:save',
        section: 'Commands',
        title: 'Open Save modal',
        keywords: ['save', 'dirty', 'revision'],
        run: () => {
          onOpenSave()
          closePalette()
        },
      },
      {
        id: 'command:export',
        section: 'Commands',
        title: 'Open Export modal',
        keywords: ['export', 'zip', 'snapshot'],
        run: () => {
          onOpenExport()
          closePalette()
        },
      },
      {
        id: 'command:settings',
        section: 'Commands',
        title: 'Open Settings modal',
        keywords: ['settings', 'theme', 'font', 'autosave'],
        run: () => {
          onOpenSettings()
          closePalette()
        },
      },
      {
        id: 'viewport:desktop',
        section: 'Viewport',
        title: 'Set viewport to Desktop',
        keywords: ['desktop', 'viewport'],
        run: () => {
          setViewport('desktop')
          closePalette()
        },
      },
      {
        id: 'viewport:tablet',
        section: 'Viewport',
        title: 'Set viewport to Tablet',
        keywords: ['tablet', 'viewport'],
        run: () => {
          setViewport('tablet')
          closePalette()
        },
      },
      {
        id: 'viewport:mobile',
        section: 'Viewport',
        title: 'Set viewport to Mobile',
        keywords: ['mobile', 'viewport'],
        run: () => {
          setViewport('mobile')
          closePalette()
        },
      },
      ...fileEntries,
    ]
  }, [closePalette, files, onOpenExport, onOpenSave, onOpenSettings, openFile, selectFile, setMode, setViewport])

  const filteredEntries = useMemo(() => {
    const query = commandPaletteQuery.trim().toLowerCase()

    if (!query) {
      return entries
    }

    return entries.filter((entry) =>
      [entry.title, entry.section, ...entry.keywords].some((token) =>
        token.toLowerCase().includes(query),
      ),
    )
  }, [commandPaletteQuery, entries])

  useEffect(() => {
    if (!commandPaletteOpen) {
      return
    }

    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [commandPaletteOpen])

  const normalizedActiveIndex =
    filteredEntries.length === 0 ? 0 : Math.min(activeIndex, filteredEntries.length - 1)
  const activeEntry = filteredEntries[normalizedActiveIndex] ?? null
  const selectedFile = activeEntry?.id.startsWith('file:')
    ? findFileNodeById(files, activeEntry.id.replace('file:', ''))
    : null

  return (
    <Modal
      open={commandPaletteOpen}
      footer={null}
      onCancel={() => {
        setActiveIndex(0)
        closePalette()
      }}
      title="Command palette"
      width={720}
      centered
      destroyOnClose
    >
      <div className="command-palette">
        <Input
          ref={inputRef}
          value={commandPaletteQuery}
          prefix={<SearchOutlined />}
          placeholder="Search commands, files, and viewports"
          onChange={(event) => {
            setActiveIndex(0)
            setQuery(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActiveIndex((current) => Math.min(current + 1, Math.max(filteredEntries.length - 1, 0)))
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((current) => Math.max(current - 1, 0))
            }

            if (event.key === 'Enter' && activeEntry) {
              event.preventDefault()
              activeEntry.run()
            }
          }}
        />

        <div className="command-palette__results">
          {filteredEntries.length === 0 ? (
            <div className="command-palette__empty">
              No matching command or file was found for this query.
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                className={`command-palette__item ${index === normalizedActiveIndex ? 'command-palette__item--active' : ''}`}
                onClick={() => {
                  setActiveIndex(index)
                  entry.run()
                }}
              >
                <div className="command-palette__item-copy">
                  <span className="command-palette__item-title">{entry.title}</span>
                  <span className="command-palette__item-section">{entry.section}</span>
                </div>
                <span className="command-palette__item-keywords">
                  {entry.keywords.slice(0, 3).join(' | ')}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="command-palette__footer">
          <Text type="secondary">
            {selectedFile
              ? `Selected file path: ${selectedFile.path}`
              : 'Use arrow keys to navigate and Enter to execute.'}
          </Text>
        </div>
      </div>
    </Modal>
  )
}
