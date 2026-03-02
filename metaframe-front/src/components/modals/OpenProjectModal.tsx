import { Modal, List, Typography, Button, Space, Tag } from "antd";
import { FolderOpenOutlined, ClockCircleOutlined, DeleteOutlined, DesktopOutlined } from "@ant-design/icons";

const { Text } = Typography;

// [Props 정의] 부모(HeaderPanel)가 이 모달을 끄고 켤 수 있도록 전달받는 리모컨 속성들
interface OpenProjectModalProps {
    open: boolean;          // 모달창을 화면에 띄울지 여부
    onClose: () => void;    // 모달창을 닫을 때 호출되는 함수
}

// =====================================================================
// [UI Only] 임시 가짜 데이터 (Mock Data)
// 나중에는 백엔드 API(또는 LocalStorage)에서 불러온 실제 프로젝트 목록으로 교체될 영역입니다.
// =====================================================================
const mockProjects = [
    { id: 1, name: "SK Hynix WMS", date: "2026-03-02 10:30", type: "Admin", version: "v18.3.1" },
    { id: 2, name: "Samsung MES", date: "2026-03-01 15:45", type: "Admin", version: "v19.0.0-rc" },
    { id: 3, name: "My Personal Portfolio", date: "2026-02-28 09:15", type: "Empty", version: "v18.3.1" },
];

export default function OpenProjectModal({ open, onClose }: OpenProjectModalProps) {
    return (
        <Modal
            // 모달 상단 타이틀 (폴더 열기 아이콘 + 텍스트)
            title={<span><FolderOpenOutlined style={{ marginRight: 8 }} /> Open Project</span>}
            open={open}              // 모달 표시 여부
            onCancel={onClose}       // 우측 상단 X 버튼이나 배경 클릭 시 닫기

            // [UX 포인트] 프로젝트 목록 창은 하단에 일괄 적용되는 '확인/취소' 버튼이 어색합니다.
            // 따라서 footer={null}을 주어 하단 바를 아예 없애고, 각 리스트 항목 우측의 'Open' 버튼으로 제어하게 합니다.
            footer={null}

            width={600}              // 모달 가로 폭
            centered                 // 화면 정중앙에 배치

            // [✨ 최신 AntD 패턴] 과거의 bodyStyle 대신 styles 객체를 사용하여 모달 내부 여백을 조절합니다.
            // 리스트 UI가 모달 창에 꽉 차게 보이도록 위아래 패딩만 남기고 좌우 패딩을 없앱니다.
            styles={{ body: { padding: '16px 0' } }}
        >
            {/* =========================================
                프로젝트 목록 렌더링 영역 (Ant Design List 컴포넌트)
                ========================================= */}
            <List
                itemLayout="horizontal" // 좌측에 아이콘, 중앙에 텍스트, 우측에 버튼이 오는 가로형 레이아웃
                dataSource={mockProjects} // 위에 정의한 가짜 데이터 배열을 연결
                renderItem={(item) => (
                    // 배열의 데이터 개수만큼 아래 List.Item 컴포넌트를 반복해서 그립니다.
                    <List.Item
                        // [우측 액션 버튼들] 각 항목의 오른쪽 끝에 나타나는 버튼들
                        actions={[
                            // 1. Open 버튼: 클릭 시 현재는 모달만 닫지만, 나중엔 해당 프로젝트 데이터를 Store에 로드하는 로직이 추가됩니다.
                            <Button type="primary" key="open" onClick={onClose}>Open</Button>,

                            // 2. Delete 버튼: 프로젝트 삭제용 (빨간색 텍스트 버튼)
                            <Button type="text" danger key="delete" icon={<DeleteOutlined />} />
                        ]}
                        // 리스트 항목의 상하좌우 여백을 넉넉히 주고, 마우스를 올렸을 때 클릭 가능함을 알리는 포인터 커서 적용
                        style={{ padding: '16px 24px', cursor: 'pointer' }}

                        // 향후 CSS 파일에서 hover(마우스 오버) 시 배경색을 살짝 바꾸기 위해 클래스명을 미리 부여해 둠
                        className="project-list-item"
                    >
                        {/* =========================================
                            리스트 항목의 본문 영역 (Meta 데이터)
                            ========================================= */}
                        <List.Item.Meta
                            // 1. 아바타 (좌측 아이콘): 데스크탑 모니터 아이콘으로 프로젝트임을 시각적으로 표현
                            avatar={<DesktopOutlined style={{ fontSize: 24, color: '#1890ff', marginTop: 8 }} />}

                            // 2. 타이틀: 프로젝트 이름 (크고 굵은 글씨)
                            title={<span style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</span>}

                            // 3. 설명란: 프로젝트 정보 (업데이트 날짜, 템플릿 종류, React 버전)
                            description={
                                <Space size={16} style={{ marginTop: 4 }}>

                                    {/* 3-1. 마지막 수정 날짜 */}
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                        {item.date}
                                    </Text>

                                    {/* 3-2. 템플릿 타입 뱃지 (Admin은 파란색, Empty는 초록색 뱃지) */}
                                    <Tag color={item.type === 'Admin' ? 'blue' : 'green'}>{item.type}</Tag>

                                    {/* 3-3. React 버전 뱃지 (회색 기본 뱃지) */}
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