// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useState } from 'react'

import {
  ClockCircleOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FolderOpenOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import { Button, Empty, List, Modal, Space, Spin, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useNotificationHost } from '@/components/notification-context'
import { listProjects } from '@/features/project-home/api/projectApi'
import type { ProjectSummary } from '@/types/project.types'

const { Text } = Typography

interface OpenProjectModalProps {
  open: boolean
  onClose: () => void
}

export default function OpenProjectModal({ open, onClose }: OpenProjectModalProps) {
  const navigate = useNavigate()
  const notification = useNotificationHost()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    let active = true
    void (async () => {
      setIsLoading(true)

      try {
        const result = await listProjects({
          query: '',
          sort: 'recent_opened',
          deletedMode: 'all',
        })

        if (active) {
          setProjects(result)
        }
      } catch (error) {
        notification.error(
          'Unable to load projects',
          error instanceof Error ? error.message : 'The project list could not be loaded.',
        )
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [notification, open])

  return (
    <Modal
      title={
        <span>
          <FolderOpenOutlined style={{ marginRight: 8 }} />
          Open Project
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      centered
      styles={{ body: { padding: '16px 0' } }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : projects.length === 0 ? (
        <Empty description="No projects are available yet." />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={projects}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="open"
                  type="primary"
                  disabled={item.isDeleted}
                  onClick={() => {
                    onClose()
                    navigate(`/projects/${item.projectId}/ide`)
                  }}
                >
                  Open
                </Button>,
              ]}
              style={{ padding: '16px 24px' }}
            >
              <List.Item.Meta
                avatar={
                  <DesktopOutlined style={{ fontSize: 24, color: 'var(--mf-accent)', marginTop: 8 }} />
                }
                title={<span style={{ fontWeight: 'bold', fontSize: 16 }}>{item.projectName}</span>}
                description={
                  <Space size={12} style={{ marginTop: 4 }} wrap>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {new Date(item.updatedAt).toLocaleString()}
                    </Text>
                    <Tag color="blue">{item.templateType}</Tag>
                    <Tag color={item.isDeleted ? 'gold' : 'green'}>
                      {item.isDeleted ? 'Deleted' : item.currentUserRole}
                    </Tag>
                    <Tag icon={item.isDeleted ? <RollbackOutlined /> : <DeleteOutlined />}>
                      {item.pageCount} pages
                    </Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}
