import { Modal, Form, Input, Alert } from "antd";
import { SaveOutlined, CopyOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// [Props 정의] 부모 컴포넌트(HeaderPanel)로부터 전달받는 제어 속성들
interface SaveProjectModalProps {
    open: boolean;           // 모달창을 화면에 띄울지 여부 (true/false)
    mode: 'save' | 'saveAs'; // [핵심] '저장(save)' 모드인지 '다른 이름으로 저장(saveAs)' 모드인지 구분
    onClose: () => void;     // 창을 닫을 때 실행할 함수
}

export default function SaveProjectModal({ open, mode, onClose }: SaveProjectModalProps) {
    // [Form 인스턴스 생성] 입력값 검사(Validation)와 데이터 추출, 초기화를 관리하는 비서 역할
    const [form] = Form.useForm();

    // =====================================================================
    // [모드에 따른 UI 동적 렌더링]
    // 전달받은 mode 속성에 따라 모달창의 제목, 아이콘, 안내 메시지, 버튼 이름이 찰떡같이 바뀝니다.
    // =====================================================================
    const isSaveAs = mode === 'saveAs';

    // 1. 타이틀 & 아이콘: Save As일 때는 복사(Copy) 아이콘, 일반 Save일 때는 디스켓(Save) 아이콘
    const modalTitle = isSaveAs ? "Save As Project" : "Save Project";
    const modalIcon = isSaveAs ? <CopyOutlined style={{ marginRight: 8 }} /> : <SaveOutlined style={{ marginRight: 8 }} />;

    // 2. 안내 메시지: 모드에 맞춰 사용자에게 정확한 동작을 안내
    const alertMessage = isSaveAs
        ? "현재 프로젝트의 복사본을 새로운 이름으로 워크스페이스에 저장합니다."
        : "현재까지 작업한 내용을 중앙 워크스페이스에 안전하게 저장합니다.";

    // 3. 확인 버튼 텍스트
    const okText = isSaveAs ? "Save as Copy" : "Save to Workspace";

    // [저장 실행 버튼 클릭 시 동작]
    const handleSave = () => {
        // 1. 필수 입력값(프로젝트 이름 등)이 잘 채워졌는지 검사합니다.
        form.validateFields().then((values) => {
            // 2. 검사를 통과하면 입력된 값(values)을 가져와 실제 저장 로직을 실행합니다.
            // (나중에 API가 연결되면 이 부분에 Axios POST/PUT 요청이 들어갑니다.)
            console.log(`🚀 ${isSaveAs ? '복사본 저장(Save As)' : '저장(Save)'} 실행:`, values);

            // 3. 작업이 끝났으므로 모달창을 닫고 폼을 비워줍니다.
            onClose();
            form.resetFields();
        });
    };

    // [취소 버튼, 우측 상단 X 버튼, 모달 배경 클릭 시 동작]
    const handleCancel = () => {
        onClose();          // 창 닫기
        form.resetFields(); // 쓰다 만 입력값 깔끔하게 지우기
    };

    return (
        <Modal
            title={<span>{modalIcon} {modalTitle}</span>} // 위에서 동적으로 만든 타이틀과 아이콘 적용
            open={open}
            onCancel={handleCancel}
            onOk={handleSave}
            okText={okText}         // 위에서 동적으로 만든 확인 버튼 텍스트 적용
            width={450}             // 모달 가로 크기
            centered                // 화면 정중앙에 배치
        >
            <Form
                form={form}
                layout="vertical"   // 라벨이 위, 입력창이 아래로 배치되는 세로 레이아웃
                initialValues={{    // 모달이 처음 열릴 때 들어있을 기본값
                    projectName: "my-meta-project",
                    description: ""
                }}
                style={{ marginTop: 16 }}
            >
                {/* 안내 메시지 박스 (Alert) */}
                <Alert title={alertMessage} type="info" showIcon style={{ marginBottom: 20 }} />

                {/* 1. 프로젝트 이름 입력 영역 (필수값) */}
                <Form.Item
                    // Save As일 때는 "새 프로젝트 이름"으로 라벨 변경
                    label={isSaveAs ? "New Project Name" : "Project Name"}
                    name="projectName"
                    rules={[{ required: true, message: '프로젝트 이름을 꼭 입력해주세요!' }]}
                >
                    <Input placeholder="예: My Awesome Admin" size="large" />
                </Form.Item>

                {/* 2. 프로젝트 설명 입력 영역 (선택값) */}
                <Form.Item label="Description (Optional)" name="description">
                    <TextArea placeholder="이 프로젝트에 대한 간단한 설명을 남겨주세요." rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}