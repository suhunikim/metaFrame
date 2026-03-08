// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, Empty, List, Typography } from 'antd'

import type { ProjectSummary } from '@/types/project.types'

const { Text, Title } = Typography

interface RecentProjectsProps {
  projects: ProjectSummary[]
  onOpen: (projectId: string) => void
}

export function RecentProjects({ projects, onOpen }: RecentProjectsProps) {
  return (
    <section className="projects-home__section">
      <Title level={4}>Recent projects</Title>
      {projects.length === 0 ? (
        <Empty description="Open a project once and it will appear here." />
      ) : (
        <List
          dataSource={projects}
          renderItem={(project) => (
            <List.Item
              actions={[
                <Button
                  key="open"
                  type="link"
                  onClick={() => onOpen(project.projectId)}
                  disabled={project.isDeleted}
                >
                  Open
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={project.projectName}
                description={
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    {project.lastOpenedAt
                      ? new Date(project.lastOpenedAt).toLocaleString()
                      : 'Not opened yet'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </section>
  )
}
