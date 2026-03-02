import { Modal, Form, Input, Card, Row, Col, Typography, Radio, Tag, Space } from "antd";
import { FolderAddOutlined, AppstoreAddOutlined, BorderOutlined, ThunderboltFilled, StarFilled, EditFilled } from "@ant-design/icons";

const { Text } = Typography;

// [Props 정의] 부모(HeaderPanel)로부터 전달받는 모달 제어용 속성
interface NewProjectModalProps {
    open: boolean;          // 모달창을 띄울지 여부
    onClose: () => void;    // 닫기 버튼을 눌렀을 때 부모에게 알리는 함수
}

export default function NewProjectModal({ open, onClose }: NewProjectModalProps) {
    // [Form 인스턴스 생성]
    // 입력값 검증(Validation), 데이터 강제 쓰기/초기화 등을 제어하는 폼 관리자입니다.
    const [form] = Form.useForm();

    // =====================================================================
    // [✨ 최신 상태 감시 패턴 (Form.useWatch)]
    // 기존의 useState를 사용하면 폼 내부 데이터와 로컬 State가 엇갈리는 버그가 날 수 있습니다.
    // Form.useWatch를 사용해 현재 폼의 'template'과 'versionType' 필드값을 실시간으로 감시합니다.
    // =====================================================================
    const selectedTemplate = Form.useWatch("template", form) || "admin";
    const versionType = Form.useWatch("versionType", form) || "recommended";

    // [Create 버튼(생성) 클릭 시 동작하는 로직]
    const handleCreate = () => {
        // 1. 필수 입력값(프로젝트명 등)이 다 채워졌는지 검사합니다.
        form.validateFields().then((values) => {

            // 2. 사용자가 선택한 버전 타입(latest, recommended, custom)에 따라 실제 버전을 결정합니다.
            let finalVersion = values.customVersion; // 기본적으로는 Custom 입력값을 가져옵니다.
            if (values.versionType === 'latest') finalVersion = "19.0.0 (RC)";
            if (values.versionType === 'recommended') finalVersion = "18.3.1 (Stable)";

            // 3. 백엔드로 보낼 최종 데이터를 콘솔에 출력합니다. (나중에 실제 API 연동 시 이곳을 수정)
            console.log("최종 생성 데이터:", {
                ...values,
                finalReactVersion: finalVersion
            });

            // 4. 모달창을 닫고, 입력했던 폼 데이터를 초기 상태로 리셋합니다.
            onClose();
            form.resetFields();
        });
    };

    // [취소/X버튼/배경 클릭 시 동작]
    const handleCancel = () => {
        onClose();
        form.resetFields(); // 쓰다 만 내용을 깔끔하게 초기화
    };

    return (
        <Modal
            // 모달 상단 타이틀
            title={<span><FolderAddOutlined style={{ marginRight: 8 }} /> New Project</span>}
            open={open}              // 띄울지 말지 결정
            onCancel={handleCancel}  // 취소 동작
            onOk={handleCreate}      // 확인(생성) 동작
            okText="Create"          // 파란색 확인 버튼 텍스트
            width={600}              // 모달창 가로 크기
            centered                 // 화면 중앙 배치
        >
            <Form
                form={form}              // 위에서 만든 인스턴스 연결
                layout="vertical"        // 라벨이 위, 입력창이 아래에 오도록 세로 배치
                initialValues={{         // 처음 창이 열릴 때 세팅될 기본값
                    template: "admin",
                    versionType: "recommended"
                }}
            >
                {/* =========================================
                    1. 프로젝트 이름 입력 영역
                    ========================================= */}
                <Form.Item
                    label="Project Name"
                    name="projectName"
                    rules={[{ required: true, message: '프로젝트 이름을 입력해주세요!' }]}
                >
                    <Input placeholder="ex) my-awesome-dashboard" size="large" />
                </Form.Item>

                {/* =========================================
                    2. 템플릿 선택 영역 (Radio 버튼을 숨긴 Card UI)
                    ========================================= */}
                <Form.Item label="Template" name="template">
                    {/* 최신 패턴 적용: onChange 이벤트를 없애고 Form이 알아서 제어하게 둠 */}
                    <Radio.Group style={{ width: '100%' }}>
                        <Row gutter={16}>
                            {/* [Admin 템플릿 카드] */}
                            <Col span={12}>
                                <Card
                                    hoverable
                                    // 클릭 시 폼의 'template' 값을 'admin'으로 강제 변경
                                    onClick={() => form.setFieldValue('template', 'admin')}
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

                            {/* [Empty 템플릿 카드] */}
                            <Col span={12}>
                                <Card
                                    hoverable
                                    // 클릭 시 폼의 'template' 값을 'empty'로 강제 변경
                                    onClick={() => form.setFieldValue('template', 'empty')}
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

                {/* =========================================
                    3. React 버전 선택 영역 (Latest / Recommended / Custom)
                    ========================================= */}
                <Form.Item label="React Version (Vite + TS)" name="versionType">
                    {/* 최신 패턴 적용: 여기도 onChange를 삭제했습니다. */}
                    <Radio.Group style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>

                            {/* 옵션 1: 최신 버전 (Latest) */}
                            <Radio value="latest">
                                <Space>
                                    <ThunderboltFilled style={{ color: '#faad14' }} />
                                    <span>Latest (v19.0.0-rc)</span>
                                    <Tag color="gold">Bleeding Edge</Tag>
                                </Space>
                            </Radio>

                            {/* 옵션 2: 추천 버전 (Recommended) - 초기 기본값 */}
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

                {/* =========================================
                    4. [조건부 렌더링] Custom 입력창
                    위에서 'Custom Version'을 골랐을(versionType === 'custom') 때만 화면에 나타납니다.
                    ========================================= */}
                {versionType === 'custom' && (
                    <Form.Item
                        name="customVersion"
                        style={{ marginLeft: 24, marginBottom: 0 }}
                        // 이 창이 나타난 상태에서는 필수로 입력해야만 Create 버튼이 동작합니다.
                        rules={[{ required: true, message: '원하는 버전을 입력해주세요 (예: 17.0.2)' }]}
                    >
                        <Input placeholder="ex) 17.0.2" style={{ width: 200 }} />
                    </Form.Item>
                )}

            </Form>
        </Modal>
    );
}