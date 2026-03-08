// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { createContext, useContext } from 'react'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface NotifyOptions {
  type: NotificationType
  message: string
  description?: string
  duration?: number
}

export interface NotificationContextValue {
  notify: (options: NotifyOptions) => void
  success: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotificationHost() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotificationHost must be used within NotificationHost.')
  }

  return context
}
