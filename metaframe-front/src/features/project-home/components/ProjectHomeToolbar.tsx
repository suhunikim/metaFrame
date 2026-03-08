// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Segmented, Select, Space, Typography } from 'antd'

import type { ProjectDeletedMode, ProjectSort } from '@/types/project.types'

const { Title } = Typography

interface ProjectHomeToolbarProps {
  query: string
  sort: ProjectSort
  deletedMode: ProjectDeletedMode
  onQueryChange: (value: string) => void
  onSortChange: (value: ProjectSort) => void
  onDeletedModeChange: (value: ProjectDeletedMode) => void
  onCreate: () => void
}

export function ProjectHomeToolbar({
  query,
  sort,
  deletedMode,
  onQueryChange,
  onSortChange,
  onDeletedModeChange,
  onCreate,
}: ProjectHomeToolbarProps) {
  return (
    <div className="projects-home__toolbar">
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Projects
        </Title>
      </div>

      <Space wrap>
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder="Search by project name or description"
          style={{ width: 280 }}
        />

        <Select<ProjectSort>
          value={sort}
          onChange={onSortChange}
          style={{ width: 180 }}
          options={[
            { value: 'updated_desc', label: 'Updated desc' },
            { value: 'updated_asc', label: 'Updated asc' },
            { value: 'name_asc', label: 'Name' },
            { value: 'created_desc', label: 'Created desc' },
            { value: 'recent_opened', label: 'Recently opened' },
          ]}
        />

        <Segmented<ProjectDeletedMode>
          value={deletedMode}
          onChange={onDeletedModeChange}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Deleted', value: 'deleted' },
          ]}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          New project
        </Button>
      </Space>
    </div>
  )
}
