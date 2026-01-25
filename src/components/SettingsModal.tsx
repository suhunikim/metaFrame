import { Modal, Tabs, Form, Select, Switch, Input, Radio } from "antd";
import { SettingOutlined, BgColorsOutlined, HighlightOutlined } from "@ant-design/icons";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
    return (
        <Modal
            title={<span><SettingOutlined /> Settings</span>}
            open={open}
            onOk={onClose}
            onCancel={onClose}
            width={600}
            okText="Save Changes"
        >
            <Tabs
                tabPosition="left"
                items={[
                    {
                        key: 'general',
                        label: 'General',
                        children: (
                            <Form layout="vertical">
                                <Form.Item label="Language">
                                    <Select defaultValue="en" options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'ko', label: '한국어' }
                                    ]} />
                                </Form.Item>
                                <Form.Item label="Auto Save">
                                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
                                </Form.Item>
                            </Form>
                        )
                    },
                    {
                        key: 'appearance',
                        label: <span><BgColorsOutlined /> Appearance</span>,
                        children: (
                            <Form layout="vertical">
                                <Form.Item label="Theme">
                                    <Radio.Group defaultValue="dark">
                                        <Radio.Button value="light">Light</Radio.Button>
                                        <Radio.Button value="dark">Dark</Radio.Button>
                                        <Radio.Button value="system">System</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="Accent Color">
                                    <Input type="color" defaultValue="#1890ff" style={{ width: 50 }} />
                                </Form.Item>
                            </Form>
                        )
                    },
                    {
                        key: 'editor',
                        label: <span><HighlightOutlined /> Editor</span>,
                        children: (
                            <Form layout="vertical">
                                <Form.Item label="Font Size">
                                    <Select defaultValue={14} options={[
                                        { value: 12, label: '12px' },
                                        { value: 14, label: '14px' },
                                        { value: 16, label: '16px' },
                                    ]} />
                                </Form.Item>
                                <Form.Item label="Show Line Numbers">
                                    <Switch defaultChecked />
                                </Form.Item>
                                <Form.Item label="Word Wrap">
                                    <Switch />
                                </Form.Item>
                            </Form>
                        )
                    }
                ]}
            />
        </Modal>
    );
}