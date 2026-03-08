// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect } from 'react'

import { Form, InputNumber, Modal, Select, Space, Typography } from 'antd'

import { useSettingsStore } from '@/store'
import { useThemeMode } from '@/theme'
import type { ThemeMode } from '@/theme'

const { Text } = Typography

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

// SettingsModal keeps user-scoped IDE preferences in one place until server persistence joins the flow.
export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { mode, setMode } = useThemeMode()
  const themeMode = useSettingsStore((state) => state.themeMode)
  const uiFontSize = useSettingsStore((state) => state.uiFontSize)
  const autosaveMinutes = useSettingsStore((state) => state.autosaveMinutes)
  const hydrate = useSettingsStore((state) => state.hydrate)
  const updateSettings = useSettingsStore((state) => state.updateSettings)
  const [form] = Form.useForm()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue({
      themeMode,
      uiFontSize,
      autosaveMinutes,
    })
  }, [autosaveMinutes, form, open, themeMode, uiFontSize])

  const handleSave = async () => {
    const values = await form.validateFields()
    updateSettings(values)
    setMode(values.themeMode as ThemeMode)
    onClose()
  }

  return (
    <Modal
      open={open}
      title="IDE settings"
      onCancel={onClose}
      onOk={() => {
        void handleSave()
      }}
      okText="Save settings"
      width={520}
      centered
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Theme"
          name="themeMode"
          rules={[{ required: true, message: 'Choose a theme mode.' }]}
        >
          <Select
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="UI font size"
          name="uiFontSize"
          rules={[{ required: true, message: 'Choose the base UI font size.' }]}
        >
          <InputNumber min={12} max={18} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Autosave interval (minutes)"
          name="autosaveMinutes"
          rules={[{ required: true, message: 'Choose the autosave cadence.' }]}
        >
          <InputNumber min={1} max={30} style={{ width: '100%' }} />
        </Form.Item>

        <Space direction="vertical" size={4}>
          <Text type="secondary">
            Theme is applied immediately after save so the shell reflects the chosen preference.
          </Text>
          <Text type="secondary">
            Server-backed preference sync will replace local storage in a later package.
          </Text>
          <Text type="secondary">Current theme: {mode}</Text>
        </Space>
      </Form>
    </Modal>
  )
}
