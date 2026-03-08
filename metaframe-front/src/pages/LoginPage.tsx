// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuthStore } from '@/store'
import '@/assets/css/login.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const bootstrapState = useAuthStore((state) => state.bootstrapState)

  useEffect(() => {
    if (currentUser) {
      navigate('/projects', { replace: true })
    }
  }, [currentUser, navigate])

  return (
    <div className="auth-shell">
      <div className="auth-shell__panel">
        <LoginForm
          onSignup={() => navigate('/signup')}
          onResetPassword={() => navigate('/reset-password')}
          allowSignup={bootstrapState?.selfSignupEnabled ?? true}
        />
      </div>
    </div>
  )
}
