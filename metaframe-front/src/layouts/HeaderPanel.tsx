import { useState } from 'react';
// AntD 컴포넌트 Import
import { Button, Space, Tooltip, Avatar, Typography, Select, Dropdown } from "antd";

// [Diet 1] 아이콘 에셋 정리
// 메뉴판으로 이사 간 아이콘들은 제거하고, 헤더 화면(버튼 등)에 직접 쓰이는 것들만 남겼습니다.
import {
    // 1. 헤더 좌측 (로고, 햄버거)
    MenuOutlined,          // [Icon] 햄버거 메뉴 버튼
    ThunderboltFilled,     // [Icon] 로고

    // 2. 헤더 중앙 (뷰포트, 실행)
    DesktopOutlined,       // [Icon] 데스크탑 모드
    TabletOutlined,        // [Icon] 태블릿 모드
    MobileOutlined,        // [Icon] 모바일 모드
    PlayCircleOutlined,    // [Icon] 실행(Preview) 버튼
    CloudUploadOutlined,   // [Icon] 빌드(Build) 버튼

    // 3. 헤더 우측 (검색, 설정, 프로필)
    SearchOutlined,        // [Icon] 검색 버튼
    SettingOutlined,       // [Icon] 설정 버튼 (메뉴에도 있지만, 헤더 우측 버튼용으로 필요)
    UserOutlined           // [Icon] 사용자 프로필
} from "@ant-design/icons";

// 모달 컴포넌트 Import
import SettingsModal from '../components/modals/SettingsModal.tsx';
import NewProjectModal from '../components/modals/NewProjectModal.tsx';
import OpenProjectModal from '../components/modals/OpenProjectModal';
import SaveProjectModal from '../components/modals/SaveProjectModal';
import ExportProjectModal from '../components/modals/ExportProjectModal';

// [Diet 2] 분리한 메뉴 설정 파일(Config) 가져오기
import { getMenuItems } from '../config/headerMenuConfig';

// 스타일시트 연결
import "./HeaderPanel.css";

const { Text } = Typography;

// =============================================================================
// [2. Component Definition]
// HeaderPanel: 상단 제어바 (로고, 메뉴, 뷰포트, 설정)
// =============================================================================
export default function HeaderPanel() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
    const [isOpenProjectOpen, setIsOpenProjectOpen] = useState(false);
    // Save 모달 상태와 모드 관리
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [saveMode, setSaveMode] = useState<'save' | 'saveAs'>('save');
    // Export project 모달 상태와 모드 관리
    const [isExportOpen, setIsExportOpen] = useState(false);

    // -------------------------------------------------------------------------
    // [Menu Configuration]
    // [Diet 3] 복잡한 메뉴 정의 코드를 제거하고, Factory 함수로 대체했습니다.
    // 외부 파일(getMenuItems)에 "리모컨 함수"를 전달해서 완성된 메뉴판을 받아옵니다.
    // -------------------------------------------------------------------------
    const menuItems = getMenuItems(
        () => setIsNewProjectOpen(true), // onNewProject: 'New Project' 메뉴 클릭 시 실행
        () => setIsOpenProjectOpen(true), // onOpenProject: 'Open Project' 메뉴 클릭 시 실행
        () => { setSaveMode('save'); setIsSaveOpen(true); },      // Save 클릭 시
        () => { setSaveMode('saveAs'); setIsSaveOpen(true); },    // Save As 클릭 시
        () => setIsExportOpen(true), // onOpenProject: 'Export Open Project' 메뉴 클릭 시 실행
        () => setIsSettingsOpen(true)    // onSettings: 'Settings' 메뉴 클릭 시 실행
    );

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
                        items: menuItems, // [핵심] 위에서 받아온 깔끔한 메뉴 객체 연결
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

                {/* [3. Trigger 연결] 우측 상단 설정 버튼 (직접 연결) */}
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

            {/* NewProjectModal 출력 */}
            <NewProjectModal
                open={isNewProjectOpen}
                onClose={() => setIsNewProjectOpen(false)}
            />

            {/* Open Project 모달 */}
            <OpenProjectModal
                open={isOpenProjectOpen}
                onClose={() => setIsOpenProjectOpen(false)}
            />

            {/* Save 모달 */}
            {/* [MODIFIED] mode 속성을 전달하여 모달의 텍스트와 기능을 분기 처리합니다. */}
            <SaveProjectModal
                open={isSaveOpen}
                mode={saveMode}
                onClose={() => setIsSaveOpen(false)}
            />

            {/* Export Project 모달 */}
            <ExportProjectModal
                open={isExportOpen}
                onClose={() => setIsExportOpen(false)}
            />

            {/* [4. Render 추가] 닫는 태그(</div>) 직전에 배치 */}
            <SettingsModal
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}