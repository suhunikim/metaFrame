// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Button, Form, Input, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { ResetPasswordPayload } from '@/types/auth.types'

const { Text, Title } = Typography

interface ResetPasswordFormProps {
  onBackToLogin: () => void
}

export function ResetPasswordForm({ onBackToLogin }: ResetPasswordFormProps) {
  const [form] = Form.useForm<ResetPasswordPayload>()
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset)
  const resetPasswordState = useAuthStore((state) => state.resetPasswordState)
  const authError = useAuthStore((state) => state.authError)
  const notification = useNotificationHost()

  const handleSubmit = async (values: ResetPasswordPayload) => {
    await requestPasswordReset(values)
    notification.success(
      'Reset request recorded',
      'An administrator can now verify the request through the closed-network workflow.',
    )
    form.resetFields()
  }

  return (
    <div className="auth-card">
      <div className="auth-brand">
        <Title level={2}>Password help</Title>
        <Text type="secondary">
          In closed-network environments, reset requests are stored for administrator review.
        </Text>
      </div>

      <AuthErrorAlert error={authError} />

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          void handleSubmit(values).catch(() => undefined)
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter the account email.' },
            { type: 'email', message: 'Please enter a valid email address.' },
          ]}
        >
          <Input size="large" placeholder="name@company.local" />
        </Form.Item>

        <Form.Item label="Additional identifier" name="extraIdentifier">
          <Input size="large" placeholder="Employee number or organization hint" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={resetPasswordState === 'submitting'}
          block
        >
          Submit reset request
        </Button>

        <div className="auth-actions auth-actions--stacked">
          <Text type="secondary">No mail delivery is assumed in this environment.</Text>
          <Button type="link" onClick={onBackToLogin}>
            Back to sign in
          </Button>
        </div>
      </Form>
    </div>
  )
}
