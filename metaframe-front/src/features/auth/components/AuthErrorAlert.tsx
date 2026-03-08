// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Alert } from 'antd'

import type { AuthErrorState } from '@/types/auth.types'

interface AuthErrorAlertProps {
  error: AuthErrorState | null
}

export function AuthErrorAlert({ error }: AuthErrorAlertProps) {
  if (!error) {
    return null
  }

  return (
    <Alert
      type="error"
      showIcon
      message={error.code ? `${error.code}: ${error.message}` : error.message}
      style={{ marginBottom: 16 }}
    />
  )
}
