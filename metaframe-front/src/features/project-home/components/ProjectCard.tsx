// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import { Badge, Button, Card, Space, Tag, Typography } from 'antd'

import type { ProjectSummary } from '@/types/project.types'

const { Paragraph, Text, Title } = Typography

interface ProjectCardProps {
  project: ProjectSummary
  onOpen: (projectId: string) => void
  onDeleteRestore: (project: ProjectSummary) => void
}

export function ProjectCard({ project, onOpen, onDeleteRestore }: ProjectCardProps) {
  return (
    <Card
      className="projects-home__card"
      actions={[
        <Button
          key="open"
          type="link"
          icon={<RightCircleOutlined />}
          onClick={() => onOpen(project.projectId)}
          disabled={project.isDeleted}
        >
          Open
        </Button>,
        <Button
          key="delete-restore"
          type="link"
          icon={project.isDeleted ? <RollbackOutlined /> : <DeleteOutlined />}
          danger={!project.isDeleted}
          onClick={() => onDeleteRestore(project)}
        >
          {project.isDeleted ? 'Restore' : 'Delete'}
        </Button>,
      ]}
    >
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        <Space align="start" style={{ justifyContent: 'space-between', width: '100%' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {project.projectName}
            </Title>
            <Text type="secondary">{project.templateType}</Text>
          </div>
          <Badge
            status={project.isDeleted ? 'warning' : 'processing'}
            text={project.isDeleted ? 'Deleted' : project.currentUserRole}
          />
        </Space>

        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
          {project.projectDescription || 'No project description provided yet.'}
        </Paragraph>

        <Space wrap size={[8, 8]}>
          <Tag color="blue">{project.versionPreset}</Tag>
          <Tag>{project.reactVersion}</Tag>
          <Tag>{project.viteVersion}</Tag>
          <Tag icon={<EditOutlined />}>{project.pageCount} pages</Tag>
        </Space>

        <Text type="secondary">
          Updated {new Date(project.updatedAt).toLocaleString()} by {project.ownerEmail}
        </Text>
      </Space>
    </Card>
  )
}
