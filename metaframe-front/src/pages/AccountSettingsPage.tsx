// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useNavigate } from 'react-router-dom'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { AccountSettingsForm } from '@/features/auth/components/AccountSettingsForm'
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm'
import '@/assets/css/account-settings.css'

export default function AccountSettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="account-shell">
      <div className="account-shell__header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="account-shell__content">
        <AccountSettingsForm />
        <ChangePasswordForm />
      </div>
    </div>
  )
}
