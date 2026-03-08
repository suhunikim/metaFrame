// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Segmented } from 'antd'

import type { VersionPreset } from '@/types/project.types'

interface VersionPresetSelectorProps {
  presets: VersionPreset[]
  value: string
  onChange: (value: string) => void
}

export function VersionPresetSelector({
  presets,
  value,
  onChange,
}: VersionPresetSelectorProps) {
  return (
    <Segmented
      block
      value={value}
      onChange={(nextValue) => onChange(String(nextValue))}
      options={presets.map((preset) => ({
        label: preset.label,
        value: preset.key,
      }))}
    />
  )
}
