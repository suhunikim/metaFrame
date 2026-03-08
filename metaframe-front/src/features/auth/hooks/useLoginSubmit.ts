// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useNavigate } from 'react-router-dom'

import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { LoginPayload } from '@/types/auth.types'

export function useLoginSubmit() {
  const login = useAuthStore((state) => state.login)
  const notification = useNotificationHost()
  const navigate = useNavigate()

  return async (payload: LoginPayload) => {
    await login(payload)
    notification.success('Signed in', 'Your session is ready. Redirecting to the project home.')
    navigate('/projects')
  }
}
