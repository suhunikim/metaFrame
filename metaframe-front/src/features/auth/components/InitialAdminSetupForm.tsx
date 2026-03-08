// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { SafetyCertificateOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { BootstrapAdminPayload } from '@/types/auth.types'

const { Text, Title } = Typography

interface InitialAdminSetupFormProps {
  onSuccess: () => void
}

export function InitialAdminSetupForm({ onSuccess }: InitialAdminSetupFormProps) {
  const [form] = Form.useForm<BootstrapAdminPayload & { passwordConfirm: string }>()
  const bootstrapAdmin = useAuthStore((state) => state.bootstrapAdmin)
  const setupState = useAuthStore((state) => state.initialAdminSetupState)
  const authError = useAuthStore((state) => state.authError)
  const notification = useNotificationHost()

  const handleSubmit = async (values: BootstrapAdminPayload & { passwordConfirm: string }) => {
    await bootstrapAdmin({
      organizationName: values.organizationName,
      adminName: values.adminName,
      adminEmail: values.adminEmail,
      password: values.password,
    })

    notification.success('Initial administrator created', 'The owner session is active now.')
    onSuccess()
  }

  return (
    <div className="auth-card auth-card--wide">
      <div className="auth-brand">
        <Title level={2}>Initial administrator setup</Title>
        <Text type="secondary">
          This runs once per installation and creates the first owner account plus the organization
          profile.
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
          label="Organization name"
          name="organizationName"
          rules={[{ required: true, message: 'Please enter the organization name.' }]}
        >
          <Input size="large" placeholder="MetaFrame Team" />
        </Form.Item>

        <Form.Item
          label="Administrator name"
          name="adminName"
          rules={[{ required: true, message: 'Please enter the owner display name.' }]}
        >
          <Input size="large" placeholder="Primary owner" />
        </Form.Item>

        <Form.Item
          label="Administrator email"
          name="adminEmail"
          rules={[
            { required: true, message: 'Please enter the administrator email.' },
            { type: 'email', message: 'Please enter a valid email address.' },
          ]}
        >
          <Input size="large" placeholder="owner@company.local" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter a password.' },
            { min: 8, message: 'Password must be at least 8 characters long.' },
          ]}
        >
          <Input.Password size="large" placeholder="Create the owner password" />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="passwordConfirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm the password.' },
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
          <Input.Password size="large" placeholder="Confirm the owner password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<SafetyCertificateOutlined />}
          loading={setupState === 'creating'}
          block
        >
          Create administrator
        </Button>
      </Form>
    </div>
  )
}
