// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useNavigate } from 'react-router-dom'

import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import '@/assets/css/account-settings.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-shell">
      <div className="auth-shell__panel">
        <ResetPasswordForm onBackToLogin={() => navigate('/login')} />
      </div>
    </div>
  )
}
