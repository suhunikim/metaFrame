// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { UserAddOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { SignupPayload } from '@/types/auth.types'

const { Text, Title } = Typography

interface SignupFormProps {
  onBackToLogin: () => void
  enabled: boolean
}

export function SignupForm({ onBackToLogin, enabled }: SignupFormProps) {
  const [form] = Form.useForm<SignupPayload & { passwordConfirm: string }>()
  const signup = useAuthStore((state) => state.signup)
  const signupState = useAuthStore((state) => state.signupState)
  const authError = useAuthStore((state) => state.authError)
  const notification = useNotificationHost()

  const handleSubmit = async (values: SignupPayload & { passwordConfirm: string }) => {
    const result = await signup({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    notification.success(
      result.status === 'active' ? 'Account activated' : 'Sign-up received',
      result.status === 'active'
        ? 'Your account is active. Please sign in.'
        : 'Your account is waiting for administrator approval.',
    )
  }

  return (
    <div className="auth-card">
      <div className="auth-brand">
        <Title level={2}>Create account</Title>
        <Text type="secondary">
          Register a new MetaFrame user. By default, new accounts enter pending approval status.
        </Text>
      </div>

      {!enabled ? (
        <Alert
          type="warning"
          showIcon
          message="Self sign-up is disabled"
          description="Ask your administrator to create or approve your account."
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <AuthErrorAlert error={authError} />

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          void handleSubmit(values).catch(() => undefined)
        }}
        disabled={!enabled}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your display name.' }]}
        >
          <Input size="large" placeholder="Display name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address.' },
            { type: 'email', message: 'Please enter a valid email address.' },
          ]}
        >
          <Input size="large" placeholder="name@company.local" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter a password.' },
            { min: 8, message: 'Password must be at least 8 characters long.' },
          ]}
          extra="Use at least 8 characters with both letters and numbers."
        >
          <Input.Password size="large" placeholder="Create a password" />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="passwordConfirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error('The passwords do not match.'))
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Confirm your password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<UserAddOutlined />}
          loading={signupState === 'submitting'}
          block
        >
          Request account
        </Button>

        <div className="auth-actions auth-actions--stacked">
          <Text type="secondary">Default policy: pending approval</Text>
          <Button type="link" onClick={onBackToLogin}>
            Back to sign in
          </Button>
        </div>
      </Form>
    </div>
  )
}
