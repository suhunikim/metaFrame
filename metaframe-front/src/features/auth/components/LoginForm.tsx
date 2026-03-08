// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useState } from 'react'

import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { SessionExpiredBanner } from '@/features/auth/components/SessionExpiredBanner'
import { useLoginSubmit } from '@/features/auth/hooks/useLoginSubmit'
import { useAuthStore } from '@/store'
import type { LoginPayload } from '@/types/auth.types'

const { Text, Title } = Typography

interface LoginFormProps {
  onSignup: () => void
  onResetPassword: () => void
  allowSignup: boolean
}

export function LoginForm({ onSignup, onResetPassword, allowSignup }: LoginFormProps) {
  const [form] = Form.useForm<LoginPayload>()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const authState = useAuthStore((state) => state.authState)
  const authError = useAuthStore((state) => state.authError)
  const sessionExpired = useAuthStore((state) => state.sessionExpired)
  const clearSessionExpired = useAuthStore((state) => state.clearSessionExpired)
  const handleLogin = useLoginSubmit()

  const submitting = authState === 'submitting'

  return (
    <div className="auth-card">
      <div className="auth-brand">
        <Title level={2}>MetaFrame</Title>
        <Text type="secondary">
          Sign in to open your managed React projects, inspect revisions, and continue safely.
        </Text>
      </div>

      <SessionExpiredBanner visible={sessionExpired} onClose={clearSessionExpired} />
      <AuthErrorAlert error={authError} />

      <Form<LoginPayload>
        form={form}
        layout="vertical"
        onFinish={(values) => {
          void handleLogin(values).catch(() => undefined)
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address.' },
            { type: 'email', message: 'Please enter a valid email address.' },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="name@company.local"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password.' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            autoComplete="current-password"
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<LoginOutlined />}
          loading={submitting}
          block
        >
          Sign In
        </Button>

        <div className="auth-actions">
          {allowSignup ? (
            <Button type="link" onClick={onSignup}>
              Create account
            </Button>
          ) : (
            <Text type="secondary">Self sign-up is disabled in this environment.</Text>
          )}
          <Button type="link" onClick={onResetPassword}>
            Password help
          </Button>
        </div>
      </Form>
    </div>
  )
}
