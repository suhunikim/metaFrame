import { Modal, Form, Radio, Input, Typography, Card, Col, Row, Space } from "antd";
import { ExportOutlined, FileZipOutlined, FileTextOutlined } from "@ant-design/icons";

const { Text } = Typography;

// 모달창이 외부(HeaderPanel)로부터 전달받는 속성(Props) 정의
interface ExportProjectModalProps {
    open: boolean;          // 모달창을 화면에 띄울지 여부 (true/false)
    onClose: () => void;    // 모달창을 닫을 때 호출되는 함수 (부모의 상태를 false로 변경)
}

export default function ExportProjectModal({ open, onClose }: ExportProjectModalProps) {
    // [Form 인스턴스 생성]
    // 입력창의 값 읽기, 값 강제 변경, 초기화 등을 코드로 직접 제어하기 위해 사용합니다.
    const [form] = Form.useForm();

    // [상태 감시 훅 - Form.useWatch]
    // 폼 내부의 'format'(라디오 버튼 값) 필드가 변경될 때마다 그 값을 실시간으로 읽어옵니다.
    // 기존 useState를 쓰면 폼 데이터와 로컬 State가 꼬일 수 있어, 최신 AntD에서는 이 방식을 권장합니다.
    const exportFormat = Form.useWatch("format", form) || "zip";

    // [Export 실행 버튼 클릭 시 동작]
    const handleExport = () => {
        // 1. 폼 내부에 필수 입력값(파일명 등)이 잘 채워졌는지 검사합니다.
        form.validateFields().then((values) => {
            // 2. 검사를 통과하면 입력된 값(values)을 가져와 실제 Export 로직을 실행합니다. (현재는 콘솔 확인용)
            console.log("Export 실행 (UI Only):", values);

            // 3. 작업이 끝났으므로 모달창을 닫습니다.
            onClose();

            // 4. 다음에 모달을 다시 열었을 때 이전 입력값이 남아있지 않도록 폼을 초기 상태로 비워줍니다.
            form.resetFields();
        });
    };

    // [취소 버튼, X 버튼, 배경 클릭으로 모달을 닫을 때 동작]
    const handleCancel = () => {
        // 그냥 창만 닫는 게 아니라, 쓰다 만 입력값들을 초기화하기 위해 별도 함수를 만들었습니다.
        onClose();
        form.resetFields();
    };

    return (
        <Modal
            // 모달 상단 타이틀 영역 디자인 (아이콘 + 텍스트)
            title={<span><ExportOutlined style={{ marginRight: 8 }} /> Export Project</span>}
            open={open}              // 모달 표시 여부
            onCancel={handleCancel}  // 닫기 동작 연결
            onOk={handleExport}      // 하단 파란색(Ok) 버튼 동작 연결
            okText="Export"          // 하단 파란색 버튼의 텍스트 지정
            width={500}              // 모달창 너비
            centered                 // 화면 한가운데 정렬
        >
            <Form
                form={form}              // 위에서 만든 form 인스턴스 연결
                layout="vertical"        // 라벨(Label)이 텍스트박스 위에 배치되도록 세로 정렬
                initialValues={{         // 모달이 처음 열릴 때 채워져 있을 기본값들
                    format: "zip",
                    fileName: "metaframe-project"
                }}
                style={{ marginTop: 16 }}
            >
                {/* =========================================
                    1. 파일명 입력 영역
                    ========================================= */}
                <Form.Item label="File Name" required style={{ marginBottom: 24 }}>
                    {/* [최신 Ant Design UI 패턴 - Space.Compact]
                        과거의 addonAfter(입력창 꼬리표) 대신 사용하여, 두 개의 컴포넌트를 딱 붙여서 하나처럼 보이게 만듭니다. */}
                    <Space.Compact style={{ width: '100%' }}>

                        {/* 1-1. 진짜 폼 데이터로 전송되는 사용자의 '파일명' 입력 부분 */}
                        <Form.Item
                            name="fileName"
                            noStyle // Space.Compact 안에서 여백이 깨지지 않도록 Form.Item 자체의 UI 껍데기를 없앱니다.
                            rules={[{ required: true, message: '파일명을 입력해주세요!' }]} // 필수 입력 체크
                        >
                            <Input size="large" style={{ width: 'calc(100% - 70px)' }} />
                        </Form.Item>

                        {/* 1-2. 뒤에 붙는 '확장자 꼬리표' (읽기 전용)
                            exportFormat 상태(zip/json)에 따라 '.zip' 또는 '.json'으로 자동 변경됩니다. */}
                        <Input
                            size="large"
                            style={{ width: '70px', textAlign: 'center', cursor: 'default' }}
                            value={exportFormat === 'zip' ? '.zip' : '.json'}
                            disabled // 사용자가 텍스트를 수정하지 못하도록 막음
                        />
                    </Space.Compact>
                </Form.Item>

                {/* =========================================
                    2. 포맷 선택 영역 (Radio 버튼을 숨긴 Card UI)
                    ========================================= */}
                <Form.Item label="Export Format" name="format">
                    <Radio.Group style={{ width: '100%' }}>
                        <Row gutter={12}>

                            {/* [ZIP 포맷 선택 카드] */}
                            <Col span={12}>
                                <Card
                                    hoverable // 마우스를 올렸을 때 그림자가 생기는 효과
                                    onClick={() => form.setFieldValue('format', 'zip')} // 카드를 클릭하면 폼 데이터를 'zip'으로 강제 업데이트
                                    style={{
                                        // 현재 선택된 포맷이 'zip'이면 파란색 테두리를 그려서 '선택됨'을 강조
                                        border: exportFormat === 'zip' ? '1px solid #1890ff' : undefined,
                                        textAlign: 'center'
                                    }}
                                >
                                    {/* 실제 폼의 값을 담는 라디오 버튼이지만, 예쁜 카드를 보여주기 위해 화면에서는 숨김 */}
                                    <Radio value="zip" style={{ display: 'none' }} />
                                    <FileZipOutlined style={{ fontSize: 28, color: '#1890ff', marginBottom: 8 }} />
                                    <div style={{ fontWeight: 'bold' }}>Project (ZIP)</div>
                                    <Text type="secondary" style={{ fontSize: 11 }}>소스코드 전체 압축</Text>
                                </Card>
                            </Col>

                            {/* [JSON 포맷 선택 카드] */}
                            <Col span={12}>
                                <Card
                                    hoverable
                                    onClick={() => form.setFieldValue('format', 'json')} // 카드를 클릭하면 폼 데이터를 'json'으로 강제 업데이트
                                    style={{
                                        // 현재 선택된 포맷이 'json'이면 초록색 테두리를 그려서 '선택됨'을 강조
                                        border: exportFormat === 'json' ? '1px solid #52c41a' : undefined,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Radio value="json" style={{ display: 'none' }} />
                                    <FileTextOutlined style={{ fontSize: 28, color: '#52c41a', marginBottom: 8 }} />
                                    <div style={{ fontWeight: 'bold' }}>Page (JSON)</div>
                                    <Text type="secondary" style={{ fontSize: 11 }}>현재 페이지 데이터만</Text>
                                </Card>
                            </Col>

                        </Row>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
}