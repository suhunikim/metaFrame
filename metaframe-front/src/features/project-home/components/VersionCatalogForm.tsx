// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Collapse, Form, Select } from 'antd'

import type { LayoutPresetOption, ProjectTemplateOption, VersionCatalog } from '@/types/project.types'

interface VersionCatalogFormProps {
  catalog: VersionCatalog
  templateType: string
  layoutPreset: string
  reactVersion: string
  viteVersion: string
  onTemplateChange: (template: ProjectTemplateOption) => void
  onLayoutChange: (layoutPreset: string) => void
  onReactVersionChange: (value: string) => void
  onViteVersionChange: (value: string) => void
}

export function VersionCatalogForm({
  catalog,
  templateType,
  layoutPreset,
  reactVersion,
  viteVersion,
  onTemplateChange,
  onLayoutChange,
  onReactVersionChange,
  onViteVersionChange,
}: VersionCatalogFormProps) {
  const currentTemplate =
    catalog.templates.find((template) => template.key === templateType) ?? catalog.templates[0]

  return (
    <Collapse
      ghost
      items={[
        {
          key: 'advanced',
          label: 'Advanced options',
          children: (
            <>
              <Form.Item label="Template">
                <Select
                  value={templateType}
                  onChange={(value) => {
                    const nextTemplate =
                      catalog.templates.find((template) => template.key === value) ?? currentTemplate
                    onTemplateChange(nextTemplate)
                  }}
                  options={catalog.templates.map((template) => ({
                    value: template.key,
                    label: template.label,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Layout preset">
                <Select
                  value={layoutPreset}
                  onChange={onLayoutChange}
                  options={catalog.layoutPresets.map((layout: LayoutPresetOption) => ({
                    value: layout.key,
                    label: layout.label,
                  }))}
                />
              </Form.Item>

              <Form.Item label="React version">
                <Select
                  value={reactVersion}
                  onChange={onReactVersionChange}
                  options={catalog.presets.map((preset) => ({
                    value: preset.reactVersion,
                    label: preset.reactVersion,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Vite version">
                <Select
                  value={viteVersion}
                  onChange={onViteVersionChange}
                  options={catalog.presets.map((preset) => ({
                    value: preset.viteVersion,
                    label: preset.viteVersion,
                  }))}
                />
              </Form.Item>
            </>
          ),
        },
      ]}
    />
  )
}
