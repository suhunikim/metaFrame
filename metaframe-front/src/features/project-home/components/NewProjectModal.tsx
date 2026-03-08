// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo } from 'react'

import { FolderAddOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Radio, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useNotificationHost } from '@/components/notification-context'
import { VersionCatalogForm } from '@/features/project-home/components/VersionCatalogForm'
import { VersionPresetSelector } from '@/features/project-home/components/VersionPresetSelector'
import { useProjectStore } from '@/store'
import type { ProjectTemplateOption } from '@/types/project.types'
import '@/assets/css/new-project-modal.css'

const { Text } = Typography

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const navigate = useNavigate()
  const notification = useNotificationHost()
  const versionCatalog = useProjectStore((state) => state.versionCatalog)
  const catalogLoading = useProjectStore((state) => state.catalogLoading)
  const newProjectDraft = useProjectStore((state) => state.newProjectDraft)
  const setNewProjectDraft = useProjectStore((state) => state.setNewProjectDraft)
  const loadVersionCatalog = useProjectStore((state) => state.loadVersionCatalog)
  const createProject = useProjectStore((state) => state.createProject)
  const resetDraft = useProjectStore((state) => state.resetDraft)

  const currentPreset = useMemo(
    () => versionCatalog?.presets.find((preset) => preset.key === newProjectDraft.versionPreset) ?? null,
    [newProjectDraft.versionPreset, versionCatalog],
  )

  useEffect(() => {
    if (open) {
      void loadVersionCatalog()
    }
  }, [loadVersionCatalog, open])

  const handleTemplateChange = (template: ProjectTemplateOption) => {
    setNewProjectDraft({
      templateType: template.key,
      layoutPreset: template.defaultLayoutPreset,
    })
  }

  const handleCreate = async () => {
    try {
      const created = await createProject()
      notification.success('Project created', `${created.projectName} is ready to open.`)
      onClose()
      resetDraft()
      navigate(`/projects/${created.projectId}/ide`)
    } catch (error) {
      notification.error(
        'Project creation failed',
        error instanceof Error ? error.message : 'The project could not be created.',
      )
    }
  }

  return (
    <Modal
      title={
        <span>
          <FolderAddOutlined style={{ marginRight: 8 }} />
          New project
        </span>
      }
      open={open}
      onCancel={() => {
        onClose()
        resetDraft()
      }}
      footer={null}
      width={720}
      destroyOnHidden
    >
      {!versionCatalog ? (
        <div className="new-project-modal__empty">
          <Text type="secondary">
            {catalogLoading
              ? 'Loading the version catalog...'
              : 'The version catalog is not available yet.'}
          </Text>
        </div>
      ) : (
        <Form layout="vertical">
          <Form.Item label="Project name" required>
            <Input
              value={newProjectDraft.projectName}
              onChange={(event) => setNewProjectDraft({ projectName: event.target.value })}
              placeholder="ex) sales-admin-console"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea
              value={newProjectDraft.projectDescription}
              onChange={(event) => setNewProjectDraft({ projectDescription: event.target.value })}
              rows={3}
              placeholder="Describe what this project is for."
            />
          </Form.Item>

          <Form.Item label="Version preset">
            <VersionPresetSelector
              presets={versionCatalog.presets}
              value={newProjectDraft.versionPreset}
              onChange={(value) => {
                const preset = versionCatalog.presets.find((item) => item.key === value)
                setNewProjectDraft({
                  versionPreset: value,
                  reactVersion: preset?.reactVersion ?? newProjectDraft.reactVersion,
                  viteVersion: preset?.viteVersion ?? newProjectDraft.viteVersion,
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Template">
            <Radio.Group
              value={newProjectDraft.templateType}
              onChange={(event) => {
                const template =
                  versionCatalog.templates.find((item) => item.key === event.target.value) ??
                  versionCatalog.templates[0]
                handleTemplateChange(template)
              }}
            >
              {versionCatalog.templates.map((template) => (
                <Radio.Button key={template.key} value={template.key}>
                  {template.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <div className="new-project-modal__preset">
            <Text type="secondary">
              React {currentPreset?.reactVersion ?? newProjectDraft.reactVersion} / Vite{' '}
              {currentPreset?.viteVersion ?? newProjectDraft.viteVersion}
            </Text>
          </div>

          <VersionCatalogForm
            catalog={versionCatalog}
            templateType={newProjectDraft.templateType}
            layoutPreset={newProjectDraft.layoutPreset}
            reactVersion={newProjectDraft.reactVersion}
            viteVersion={newProjectDraft.viteVersion}
            onTemplateChange={handleTemplateChange}
            onLayoutChange={(value) => setNewProjectDraft({ layoutPreset: value })}
            onReactVersionChange={(value) => setNewProjectDraft({ reactVersion: value })}
            onViteVersionChange={(value) => setNewProjectDraft({ viteVersion: value })}
          />

          <div className="new-project-modal__actions">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                void handleCreate()
              }}
              disabled={!newProjectDraft.projectName.trim()}
            >
              Create project
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  )
}
