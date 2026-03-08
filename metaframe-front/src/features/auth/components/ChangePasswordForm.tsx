// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Button, Form, Input, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { ChangePasswordPayload } from '@/types/auth.types'

const { Text, Title } = Typography

export function ChangePasswordForm() {
  const [form] = Form.useForm<ChangePasswordPayload & { confirmPassword: string }>()
  const changePassword = useAuthStore((state) => state.changePassword)
  const changePasswordState = useAuthStore((state) => state.changePasswordState)
  const authError = useAuthStore((state) => state.authError)
  const notification = useNotificationHost()

  const handleSubmit = async (values: ChangePasswordPayload & { confirmPassword: string }) => {
    await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })

    notification.success('Password updated', 'Your password was changed successfully.')
    form.resetFields()
  }

  return (
    <section className="account-section">
      <Title level={4}>Change password</Title>
      <Text type="secondary">Use a new password that differs from the current one.</Text>
      <AuthErrorAlert error={authError} />
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          void handleSubmit(values).catch(() => undefined)
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter the current password.' }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item
          label="New password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter a new password.' },
            { min: 8, message: 'Password must be at least 8 characters long.' },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm the new password.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue('newPassword')) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error('The new passwords do not match.'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={changePasswordState === 'submitting'}
        >
          Update password
        </Button>
      </Form>
    </section>
  )
}
