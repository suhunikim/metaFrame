// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useNavigate } from 'react-router-dom'

import { SignupForm } from '@/features/auth/components/SignupForm'
import { useAuthStore } from '@/store'
import '@/assets/css/signup.css'

export default function SignupPage() {
  const navigate = useNavigate()
  const bootstrapState = useAuthStore((state) => state.bootstrapState)

  return (
    <div className="auth-shell">
      <div className="auth-shell__panel">
        <SignupForm
          onBackToLogin={() => navigate('/login')}
          enabled={bootstrapState?.selfSignupEnabled ?? true}
        />
      </div>
    </div>
  )
}
