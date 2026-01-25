import { useState } from 'react';
// AntD 컴포넌트 Import
import { Button, Space, Tooltip, Avatar, Typography, Select, Dropdown } from "antd";
// Type Import (빌드 시 제거됨)
import type { MenuProps } from "antd";
// 아이콘 에셋 Import
import {
    // 헤더 메인
    MenuOutlined,          // [Icon] 햄버거 메뉴
    DesktopOutlined,       // [Icon] 뷰포트: 데스크탑
    TabletOutlined,        // [Icon] 뷰포트: 태블릿
    MobileOutlined,        // [Icon] 뷰포트: 모바일
    PlayCircleOutlined,    // [Icon] 실행 (Preview)
    CloudUploadOutlined,   // [Icon] 빌드 (Build)
    SettingOutlined,       // [Icon] 설정
    UserOutlined,          // [Icon] 사용자 프로필
    ThunderboltFilled,     // [Icon] 로고
    SearchOutlined,        // [Icon] 검색

    // File 메뉴
    FileAddOutlined,       // [Icon] 새 프로젝트
    FolderOpenOutlined,    // [Icon] 열기
    SaveOutlined,          // [Icon] 저장
    ExportOutlined,        // [Icon] Zip 내보내기
    FileTextOutlined,      // [Icon] 페이지 내보내기
    PoweroffOutlined,      // [Icon] 종료

    // Edit 메뉴
    UndoOutlined,          // [Icon] 실행 취소
    RedoOutlined,          // [Icon] 다시 실행
    ScissorOutlined,       // [Icon] 잘라내기
    CopyOutlined,          // [Icon] 복사
    SnippetsOutlined,      // [Icon] 붙여넣기
    DeleteOutlined,        // [Icon] 삭제
    ClearOutlined,         // [Icon] 캔버스 초기화

    // View 메뉴
    LayoutOutlined,        // [Icon] 사이드바 토글
    ExpandOutlined,        // [Icon] 뷰포트 모드
    ZoomInOutlined,        // [Icon] 확대
    ZoomOutOutlined,       // [Icon] 축소
    PlaySquareOutlined,    // [Icon] 프리뷰 모드

    // Insert & Help 메뉴
    FontSizeOutlined,      // [Icon] 텍스트 추가
    BorderOutlined,        // [Icon] 레이아웃 추가
    PictureOutlined,       // [Icon] 미디어 추가
    CodeSandboxOutlined,   // [Icon] 위젯 추가
    QuestionCircleOutlined,// [Icon] 정보
    ReadOutlined,          // [Icon] 문서
    KeyOutlined            // [Icon] 단축키
} from "@ant-design/icons";
import SettingsModal from '../components/SettingsModal';
// 스타일시트 연결
import "./HeaderPanel.css";

const { Text } = Typography;

// =============================================================================
// [2. Component Definition]
// HeaderPanel: 상단 제어바 (로고, 메뉴, 뷰포트, 설정)
// =============================================================================
export default function HeaderPanel() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // -------------------------------------------------------------------------
    // [Menu Configuration]
    // 드롭다운 메뉴 아이템 설정
    // -------------------------------------------------------------------------
    const menuItems: MenuProps['items'] = [
        {
            key: 'file',
            label: 'File',
            children: [
                // [Flow] 클릭 -> 'New Project' 모달 팝업
                { key: 'new', label: 'New Project...', icon: <FileAddOutlined />, extra: 'Ctrl+N' },
                // [Flow] 클릭 -> 'Open Project' 리스트 팝업
                { key: 'open', label: 'Open Project...', icon: <FolderOpenOutlined />, extra: 'Ctrl+O' },
                { type: 'divider' },
                // [Flow] 클릭 -> 현재 상태 저장 (Save)
                { key: 'save', label: 'Save', icon: <SaveOutlined />, extra: 'Ctrl+S' },
                { key: 'save-all', label: 'Save All', icon: <SaveOutlined />, extra: 'Ctrl+Shift+S' },
                { type: 'divider' },
                // [Flow] 클릭 -> 소스코드 Zip 다운로드
                { key: 'export-zip', label: 'Export Project (Zip)', icon: <ExportOutlined /> },
                { key: 'export-page', label: 'Export Page (Single)', icon: <FileTextOutlined /> },
                { type: 'divider' },
                { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
                // [Flow] 클릭 -> 로그아웃/종료
                { key: 'exit', label: 'Exit', icon: <PoweroffOutlined />, danger: true },
            ],
        },
        {
            key: 'edit',
            label: 'Edit',
            children: [
                // [Flow] 클릭 -> 실행 취소 (Undo)
                { key: 'undo', label: 'Undo', icon: <UndoOutlined />, extra: 'Ctrl+Z' },
                { key: 'redo', label: 'Redo', icon: <RedoOutlined />, extra: 'Ctrl+Shift+Z' },
                { type: 'divider' },
                { key: 'cut', label: 'Cut', icon: <ScissorOutlined />, extra: 'Ctrl+X' },
                { key: 'copy', label: 'Copy', icon: <CopyOutlined />, extra: 'Ctrl+C' },
                { key: 'paste', label: 'Paste', icon: <SnippetsOutlined />, extra: 'Ctrl+V' },
                { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, extra: 'Del' },
                // [Flow] 클릭 -> 캔버스 전체 비우기
                { key: 'clear', label: 'Clear Canvas', icon: <ClearOutlined /> },
            ],
        },
        {
            key: 'view',
            label: 'View',
            children: [
                // [Flow] 클릭 -> 사이드바 토글
                { key: 'sidebar', label: 'Toggle Sidebar', icon: <LayoutOutlined />, extra: 'Ctrl+B' },
                { key: 'viewport', label: 'Viewport Mode', icon: <ExpandOutlined /> },
                { key: 'zoom in', label: 'Zoom', icon: <ZoomInOutlined /> },
                { key: 'zoom out', label: 'Zoom', icon: <ZoomOutOutlined /> },
                // [Flow] 클릭 -> 미리보기 모드 전환
                { key: 'preview', label: 'Preview Mode', icon: <PlaySquareOutlined />, extra: 'F5' },
            ]
        },
        {
            key: 'insert',
            label: 'Insert',
            children: [
                // [Flow] 클릭 -> 캔버스에 요소 추가
                { key: 'ins-text', label: 'Text', icon: <FontSizeOutlined /> },
                { key: 'ins-layout', label: 'Layout', icon: <BorderOutlined /> },
                { key: 'ins-media', label: 'Media', icon: <PictureOutlined /> },
                { key: 'ins-antd', label: 'AntD Widget', icon: <CodeSandboxOutlined /> },
            ]
        },
        {
            key: 'help',
            label: 'Help',
            children: [
                { key: 'docs', label: 'Documentation', icon: <ReadOutlined /> },
                { key: 'shortcuts', label: 'Keyboard Shortcuts', icon: <KeyOutlined />, extra: 'Ctrl+K' },
                { key: 'about', label: 'About MetaFrame', icon: <QuestionCircleOutlined /> },
            ]
        }
    ];

    // =========================================================================
    // [3. Render Layout]
    // 렌더링: Flexbox 기반 [좌측 - 중앙 - 우측] 레이아웃
    // =========================================================================
    return (
        <div className="header-panel-container">
            {/* 좌측 영역: 로고, 햄버거 메뉴, 프로젝트 선택 */}
            <div className="header-left">
                {/* (1) 로고: [Flow] 클릭 -> 홈 이동 */}
                <Space size={4} style={{ cursor: 'pointer' }}>
                    <ThunderboltFilled style={{ color: "#1890ff", fontSize: 18 }} />
                    <Text strong style={{ color: "#fff", fontSize: 16 }}>
                        MetaFrame
                    </Text>
                </Space>

                {/* (2) 햄버거 메뉴: [Flow] 클릭 -> 메뉴 펼침 */}
                <Dropdown
                    menu={{
                        items: menuItems,
                        className: "header-dropdown-menu" // 다크모드 적용
                    }}
                    trigger={['click']}
                >
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        style={{ color: "#fff", marginLeft: 8 }}
                    />
                </Dropdown>

                {/* (3) 프로젝트 선택기: [Flow] 변경 -> 작업공간 전환 */}
                <Select
                    defaultValue="sk_hynix_wms"
                    className="project-selector"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                    options={[
                        { value: "sk_hynix_wms", label: "SK Hynix WMS" },
                        { value: "samsung_mes", label: "Samsung MES" },
                    ]}
                    popupStyle={{ backgroundColor: "#2b2d30" }}
                    style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, minWidth: 140 }}
                />
            </div>

            {/* 중앙 영역: 뷰포트 변경, 실행 버튼 */}
            <div className="header-center">
                {/* 뷰포트 스위처: [Flow] 클릭 -> 캔버스 크기 변경 */}
                <Space.Compact style={{ display: 'flex' }}>
                    <Tooltip title="Desktop (100%)">
                        <Button type="primary" icon={<DesktopOutlined />} />
                    </Tooltip>
                    <Tooltip title="Tablet (768px)">
                        <Button type="default" icon={<TabletOutlined />} className="dark-btn" />
                    </Tooltip>
                    <Tooltip title="Mobile (375px)">
                        <Button type="default" icon={<MobileOutlined />} className="dark-btn" />
                    </Tooltip>
                </Space.Compact>

                {/* 실행 버튼 그룹 */}
                <Space style={{ marginLeft: 16 }}>
                    {/* (1) Preview (Green): [Flow] 클릭 -> 시뮬레이션 */}
                    <Tooltip title="Preview (F5)">
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            icon={<PlayCircleOutlined />}
                        >
                            Preview
                        </Button>
                    </Tooltip>

                    {/* (2) Build (Blue): [Flow] 클릭 -> 소스코드 추출(Zip) */}
                    <Tooltip title="Build & Export">
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#1890ff' }}
                            icon={<CloudUploadOutlined />}
                        >
                            Build
                        </Button>
                    </Tooltip>
                </Space>
            </div>

            {/* 우측 영역: 검색, 설정, 프로필 */}
            <div className="header-right">
                {/* [Flow] 클릭 -> 검색창(Ctrl+P) */}
                <Tooltip title="Search All (Ctrl+P)">
                    <Button type="text" icon={<SearchOutlined />} style={{ color: "#fff" }} />
                </Tooltip>
                {/* [3. Trigger 연결] onClick 이벤트 추가 */}
                <Tooltip title="Settings">
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        style={{ color: "#fff" }}
                        onClick={() => setIsSettingsOpen(true)}
                    />
                </Tooltip>
                {/* [Flow] 클릭 -> 계정 정보 */}
                <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} icon={<UserOutlined />} />
            </div>
            {/* [4. Render 추가] 닫는 태그(</div>) 직전에 배치 */}
            <SettingsModal
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}