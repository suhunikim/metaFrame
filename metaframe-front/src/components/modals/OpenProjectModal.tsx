import { Modal, List, Typography, Button, Space, Tag } from "antd";
import { FolderOpenOutlined, ClockCircleOutlined, DeleteOutlined, DesktopOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface OpenProjectModalProps {
    open: boolean;
    onClose: () => void;
}

// [UI Only] 하드코딩된 가짜 데이터
const mockProjects = [
    { id: 1, name: "SK Hynix WMS", date: "2026-03-02 10:30", type: "Admin", version: "v18.3.1" },
    { id: 2, name: "Samsung MES", date: "2026-03-01 15:45", type: "Admin", version: "v19.0.0-rc" },
    { id: 3, name: "My Personal Portfolio", date: "2026-02-28 09:15", type: "Empty", version: "v18.3.1" },
];

export default function OpenProjectModal({ open, onClose }: OpenProjectModalProps) {
    return (
        <Modal
            title={<span><FolderOpenOutlined style={{ marginRight: 8 }} /> Open Project</span>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
            styles={{ body: { padding: '16px 0' } }}
        >
            <List
                itemLayout="horizontal"
                dataSource={mockProjects}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="primary" key="open" onClick={onClose}>Open</Button>,
                            <Button type="text" danger key="delete" icon={<DeleteOutlined />} />
                        ]}
                        style={{ padding: '16px 24px', cursor: 'pointer' }}
                        className="project-list-item"
                    >
                        <List.Item.Meta
                            avatar={<DesktopOutlined style={{ fontSize: 24, color: '#1890ff', marginTop: 8 }} />}
                            title={<span style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</span>}
                            description={
                                <Space size={16} style={{ marginTop: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                        {item.date}
                                    </Text>
                                    <Tag color={item.type === 'Admin' ? 'blue' : 'green'}>{item.type}</Tag>
                                    <Tag color="default">{item.version}</Tag>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
}