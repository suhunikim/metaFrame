import { Modal, Form, Input, Card, Row, Col, Typography, Radio, Tag, Space } from "antd";
import { FolderAddOutlined, AppstoreAddOutlined, BorderOutlined, ThunderboltFilled, StarFilled, EditFilled } from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

interface NewProjectModalProps {
    open: boolean;
    onClose: () => void;
}

export default function NewProjectModal({ open, onClose }: NewProjectModalProps) {
    // 1. 폼 데이터 관리자 (비서)
    const [form] = Form.useForm();

    // 2. 상태 관리 (화면 제어용 리모컨)
    const [selectedTemplate, setSelectedTemplate] = useState("admin"); // 템플릿 선택용
    const [versionType, setVersionType] = useState("recommended");   // 버전 선택용 (recommended | latest | custom)

    // [Action] Create 버튼 클릭
    const handleCreate = () => {
        form.validateFields().then((values) => {
            // "Custom"이 아니면 미리 정의된 버전 값을 넣어줍니다.
            let finalVersion = values.customVersion;
            if (values.versionType === 'latest') finalVersion = "19.0.0 (RC)";
            if (values.versionType === 'recommended') finalVersion = "18.3.1 (Stable)";

            console.log("최종 생성 데이터:", {
                ...values,
                finalReactVersion: finalVersion
            });

            onClose();
            form.resetFields();
            // 상태 초기화
            setSelectedTemplate("admin");
            setVersionType("recommended");
        });
    };

    return (
        <Modal
            title={<span><FolderAddOutlined /> New Project</span>}
            open={open}
            onCancel={onClose}
            onOk={handleCreate}
            okText="Create"
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    template: "admin",
                    versionType: "recommended" // 기본값: 추천 버전
                }}
            >
                {/* 1. 프로젝트 이름 */}
                <Form.Item
                    label="Project Name"
                    name="projectName"
                    rules={[{ required: true, message: '프로젝트 이름을 입력해주세요!' }]}
                >
                    <Input placeholder="ex) my-awesome-dashboard" size="large" />
                </Form.Item>

                {/* 2. 템플릿 선택 */}
                <Form.Item label="Template" name="template">
                    <Radio.Group style={{ width: '100%' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card
                                    hoverable
                                    onClick={() => {
                                        form.setFieldValue('template', 'admin');
                                        setSelectedTemplate('admin');
                                    }}
                                    style={{
                                        border: selectedTemplate === 'admin' ? '1px solid #1890ff' : undefined,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Radio value="admin" style={{ display: 'none' }} />
                                    <AppstoreAddOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                                    <div style={{ fontWeight: 'bold' }}>Admin System</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>관리자 대시보드 구조</Text>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    hoverable
                                    onClick={() => {
                                        form.setFieldValue('template', 'empty');
                                        setSelectedTemplate('empty');
                                    }}
                                    style={{
                                        border: selectedTemplate === 'empty' ? '1px solid #1890ff' : undefined,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Radio value="empty" style={{ display: 'none' }} />
                                    <BorderOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }} />
                                    <div style={{ fontWeight: 'bold' }}>Empty Project</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>빈 캔버스 (Landing)</Text>
                                </Card>
                            </Col>
                        </Row>
                    </Radio.Group>
                </Form.Item>

                {/* 3. [NEW] React 버전 선택 (3가지 옵션) */}
                <Form.Item label="React Version (Vite + TS)" name="versionType">
                    <Radio.Group
                        onChange={(e) => setVersionType(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>

                            {/* 옵션 1: 최신 버전 (Latest) */}
                            <Radio value="latest">
                                <Space>
                                    <ThunderboltFilled style={{ color: '#faad14' }} />
                                    <span>Latest (v19.0.0-rc)</span>
                                    <Tag color="gold">Bleeding Edge</Tag>
                                </Space>
                            </Radio>

                            {/* 옵션 2: 추천 버전 (Recommended) - 기본값 */}
                            <Radio value="recommended">
                                <Space>
                                    <StarFilled style={{ color: '#1890ff' }} />
                                    <span style={{ fontWeight: 'bold' }}>Recommended (v18.3.1)</span>
                                    <Tag color="blue">Stable & Standard</Tag>
                                </Space>
                            </Radio>

                            {/* 옵션 3: 직접 선택 (Custom) */}
                            <Radio value="custom">
                                <Space>
                                    <EditFilled style={{ color: '#52c41a' }} />
                                    <span>Custom Version</span>
                                </Space>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>

                {/* 4. [조건부 렌더링] Custom을 골랐을 때만 나타나는 입력창 */}
                {versionType === 'custom' && (
                    <Form.Item
                        name="customVersion"
                        style={{ marginLeft: 24, marginBottom: 0 }}
                        rules={[{ required: true, message: '원하는 버전을 입력해주세요 (예: 17.0.2)' }]}
                    >
                        <Input placeholder="ex) 17.0.2" style={{ width: 200 }} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}