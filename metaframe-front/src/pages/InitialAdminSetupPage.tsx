// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useNavigate } from 'react-router-dom'

import { InitialAdminSetupForm } from '@/features/auth/components/InitialAdminSetupForm'
import '@/assets/css/initial-admin-setup.css'

export default function InitialAdminSetupPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-shell auth-shell--wide">
      <div className="auth-shell__panel">
        <InitialAdminSetupForm onSuccess={() => navigate('/projects', { replace: true })} />
      </div>
    </div>
  )
}
