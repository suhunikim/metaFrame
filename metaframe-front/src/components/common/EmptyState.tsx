// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ReactNode } from 'react'

import { Empty } from 'antd'

import '@/components/EmptyState.css'

interface EmptyStateProps {
  title: string
  description: string
  image?: ReactNode
  actions?: ReactNode
}

// Shared empty UI keeps list, panel, and workspace fallbacks visually consistent.
export function EmptyState({ title, description, image, actions }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Empty image={image ?? Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{description}</p>
      {actions ? <div className="empty-state__actions">{actions}</div> : null}
    </div>
  )
}
