// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { PropsWithChildren } from 'react'

import { App } from 'antd'

import {
  NotificationContext,
  type NotifyOptions,
} from '@/components/notification-context'

import './NotificationHost.css'

export function NotificationHost({ children }: PropsWithChildren) {
  const { notification } = App.useApp()

  const notify = ({ type, message, description, duration = 3 }: NotifyOptions) => {
    notification[type]({
      message,
      description,
      duration,
      placement: 'bottomRight',
      className: `metaframe-notice metaframe-notice--${type}`,
    })
  }

  return (
    <NotificationContext.Provider
      value={{
        notify,
        success: (message, description) => notify({ type: 'success', message, description }),
        info: (message, description) => notify({ type: 'info', message, description }),
        warning: (message, description) => notify({ type: 'warning', message, description }),
        error: (message, description) => notify({ type: 'error', message, description }),
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
