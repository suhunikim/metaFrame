import { Modal, Tabs, Form, Select, Switch, Input, Radio } from "antd";
import { SettingOutlined, BgColorsOutlined, HighlightOutlined } from "@ant-design/icons";

// [Props 정의] 부모(HeaderPanel)가 이 모달을 끄고 켤 수 있도록 전달받는 리모컨 속성들
interface SettingsModalProps {
    open: boolean;          // 모달창을 띄울지 여부 (true/false)
    onClose: () => void;    // 창을 닫을 때 부모에게 알리는 함수
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
    return (
        <Modal
            // 1. 모달 상단 타이틀 영역 (톱니바퀴 아이콘 + 텍스트)
            title={<span><SettingOutlined style={{ marginRight: 8 }} /> Settings</span>}
            open={open}              // 모달 표시 여부

            // [현재는 UI Only] 저장 로직이 아직 없으므로 Ok(저장)나 Cancel(취소) 모두 창을 닫기만 합니다.
            // 나중에 전역 상태(Zustand 등)가 붙으면 onOk에는 실제 세팅 저장 로직이 들어가게 됩니다.
            onOk={onClose}
            onCancel={onClose}

            width={600}              // 설정창은 옵션이 많으므로 가로폭을 살짝 넓게(600px) 줍니다.
            okText="Save Changes"    // 파란색 확인 버튼의 텍스트를 직관적으로 변경
        >
            {/* =========================================
                좌측 탭(Tabs) 네비게이션 영역
                ========================================= */}
            <Tabs
                // tabPosition 대신 tabPlacement 사용, left 대신 start 사용
                tabPlacement="start"

                // 각 탭의 내용을 정의하는 배열입니다.
                items={[
                    // -----------------------------------------
                    // 1. 일반 설정 (General) 탭
                    // -----------------------------------------
                    {
                        key: 'general',
                        label: 'General', // 탭 메뉴에 표시될 이름
                        children: (
                            <Form layout="vertical">
                                {/* 언어 선택 */}
                                <Form.Item label="Language">
                                    <Select defaultValue="en" options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'ko', label: '한국어' }
                                    ]} />
                                </Form.Item>

                                {/* 자동 저장 켜기/끄기 (Switch 토글 버튼) */}
                                <Form.Item label="Auto Save">
                                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
                                </Form.Item>
                            </Form>
                        )
                    },

                    // -----------------------------------------
                    // 2. 화면 스타일 (Appearance) 탭
                    // -----------------------------------------
                    {
                        key: 'appearance',
                        label: <span><BgColorsOutlined style={{ marginRight: 8 }} /> Appearance</span>,
                        children: (
                            <Form layout="vertical">
                                {/* 테마 선택 (Light / Dark / System) */}
                                <Form.Item label="Theme">
                                    <Radio.Group defaultValue="dark">
                                        <Radio.Button value="light">Light</Radio.Button>
                                        <Radio.Button value="dark">Dark</Radio.Button>
                                        <Radio.Button value="system">System</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                {/* 강조 색상(Accent Color) 선택 */}
                                <Form.Item label="Accent Color">
                                    {/* type="color"를 주면 브라우저 기본 컬러 피커(Color Picker)가 뜹니다. */}
                                    <Input type="color" defaultValue="#1890ff" style={{ width: 50, padding: 0, cursor: 'pointer' }} />
                                </Form.Item>
                            </Form>
                        )
                    },

                    // -----------------------------------------
                    // 3. 에디터 상세 설정 (Editor) 탭
                    // -----------------------------------------
                    {
                        key: 'editor',
                        label: <span><HighlightOutlined style={{ marginRight: 8 }} /> Editor</span>,
                        children: (
                            <Form layout="vertical">
                                {/* 폰트 크기 조절 */}
                                <Form.Item label="Font Size">
                                    <Select defaultValue={14} options={[
                                        { value: 12, label: '12px' },
                                        { value: 14, label: '14px' },
                                        { value: 16, label: '16px' },
                                    ]} />
                                </Form.Item>

                                {/* 코드 줄 번호 표시 여부 */}
                                <Form.Item label="Show Line Numbers">
                                    <Switch defaultChecked />
                                </Form.Item>

                                {/* 긴 코드 자동 줄바꿈(Word Wrap) 여부 */}
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