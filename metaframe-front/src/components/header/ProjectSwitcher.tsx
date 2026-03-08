// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Select } from 'antd'

interface ProjectSwitcherProps {
  projectName: string
}

// The switcher is read-only for now because cross-project navigation still lives in the home screen.
export function ProjectSwitcher({ projectName }: ProjectSwitcherProps) {
  return (
    <Select
      value={projectName}
      className="project-selector"
      variant="borderless"
      popupMatchSelectWidth={false}
      options={[{ value: projectName, label: projectName }]}
      style={{
        width: 'clamp(160px, 18vw, 220px)',
        color: 'var(--mf-text-primary)',
        backgroundColor: 'color-mix(in srgb, var(--mf-text-primary) 8%, transparent)',
        borderRadius: 6,
      }}
    />
  )
}
