// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Button, Form, Input, Select, Slider, Typography } from 'antd'

import { AuthErrorAlert } from '@/features/auth/components/AuthErrorAlert'
import { useNotificationHost } from '@/components/notification-context'
import { useAuthStore } from '@/store'
import type { AccountSettingsPayload } from '@/types/auth.types'

const { Text, Title } = Typography

export function AccountSettingsForm() {
  const [form] = Form.useForm<AccountSettingsPayload>()
  const currentUser = useAuthStore((state) => state.currentUser)
  const updateAccountSettings = useAuthStore((state) => state.updateAccountSettings)
  const accountSettingsState = useAuthStore((state) => state.accountSettingsState)
  const authError = useAuthStore((state) => state.authError)
  const notification = useNotificationHost()

  if (!currentUser) {
    return null
  }

  const handleSubmit = async (values: AccountSettingsPayload) => {
    await updateAccountSettings(values)
    notification.success('Account updated', 'Your profile and IDE preferences were saved.')
  }

  return (
    <section className="account-section">
      <Title level={4}>Account settings</Title>
      <Text type="secondary">Update your display name and personal IDE preferences.</Text>
      <AuthErrorAlert error={authError} />
      <Form<AccountSettingsPayload>
        form={form}
        layout="vertical"
        initialValues={{
          displayName: currentUser.displayName,
          themePreference:
            currentUser.themePreference === 'light' || currentUser.themePreference === 'dark'
              ? currentUser.themePreference
              : 'system',
          uiFontSize: currentUser.uiFontSize,
          autosaveInterval: currentUser.autosaveInterval,
        }}
        onFinish={(values) => {
          void handleSubmit(values).catch(() => undefined)
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Display name"
          name="displayName"
          rules={[{ required: true, message: 'Please enter your display name.' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Email">
          <Input size="large" value={currentUser.email} readOnly />
        </Form.Item>

        <Form.Item label="Role">
          <Input size="large" value={currentUser.globalRole} readOnly />
        </Form.Item>

        <Form.Item label="Theme" name="themePreference">
          <Select
            size="large"
            options={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </Form.Item>

        <Form.Item label="UI font size" name="uiFontSize">
          <Slider min={12} max={18} marks={{ 12: '12', 14: '14', 16: '16', 18: '18' }} />
        </Form.Item>

        <Form.Item label="Autosave interval (minutes)" name="autosaveInterval">
          <Slider min={1} max={30} marks={{ 1: '1', 5: '5', 15: '15', 30: '30' }} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={accountSettingsState === 'submitting'}
        >
          Save settings
        </Button>
      </Form>
    </section>
  )
}
