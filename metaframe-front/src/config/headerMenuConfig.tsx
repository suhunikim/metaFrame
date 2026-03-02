import type { MenuProps } from "antd";
import {
    FileAddOutlined, FolderOpenOutlined, SaveOutlined, ExportOutlined, FileTextOutlined, PoweroffOutlined,
    UndoOutlined, RedoOutlined, ScissorOutlined, CopyOutlined, SnippetsOutlined, DeleteOutlined, ClearOutlined,
    LayoutOutlined, ExpandOutlined, ZoomInOutlined, ZoomOutOutlined, PlaySquareOutlined,
    FontSizeOutlined, BorderOutlined, PictureOutlined, CodeSandboxOutlined,
    ReadOutlined, KeyOutlined, QuestionCircleOutlined, SettingOutlined
} from "@ant-design/icons";

// =============================================================================
// [Menu Configuration]
// 헤더 메뉴의 구조와 동작을 정의하는 설정 파일입니다.
// 외부(HeaderPanel)에서 실행 함수(onNewProject 등)를 주입받아 연결합니다.
// =============================================================================
export const getMenuItems = (
    onNewProject: () => void,  // [Action] 새 프로젝트 모달 열기 함수
    onSettings: () => void     // [Action] 설정 모달 열기 함수
): MenuProps['items'] => [
    // -------------------------------------------------------------------------
    // 1. [File] 파일 관련 메뉴 (생성, 저장, 내보내기, 종료)
    // -------------------------------------------------------------------------
    {
        key: 'file',
        label: 'File',
        children: [
            // [Flow] 클릭 -> '새 프로젝트' 모달 팝업 띄우기 (주입받은 함수 실행)
            {
                key: 'new',
                label: 'New Project...',
                icon: <FileAddOutlined />,
                extra: 'Ctrl+N',
                onClick: onNewProject
            },
            // [Flow] 클릭 -> 기존 프로젝트 파일(.zip/.json) 불러오기 창 열기
            { key: 'open', label: 'Open Project...', icon: <FolderOpenOutlined />, extra: 'Ctrl+O' },

            { type: 'divider' }, // 구분선

            // [Flow] 클릭 -> 현재 작업 내용을 서버/로컬 스토리지에 저장
            { key: 'save', label: 'Save', icon: <SaveOutlined />, extra: 'Ctrl+S' },
            // [Flow] 클릭 -> 열려있는 모든 탭과 변경 사항 저장
            { key: 'save-all', label: 'Save All', icon: <SaveOutlined />, extra: 'Ctrl+Shift+S' },

            { type: 'divider' }, // 구분선

            // [Flow] 클릭 -> 전체 프로젝트를 Zip 파일로 압축해서 다운로드
            { key: 'export-zip', label: 'Export Project (Zip)', icon: <ExportOutlined /> },
            // [Flow] 클릭 -> 현재 보고 있는 페이지만 JSON/HTML로 내보내기
            { key: 'export-page', label: 'Export Page (Single)', icon: <FileTextOutlined /> },

            { type: 'divider' }, // 구분선

            // [Flow] 클릭 -> 환경 설정(테마, 언어 등) 모달 띄우기
            {
                key: 'settings',
                label: 'Settings',
                icon: <SettingOutlined />,
                onClick: onSettings
            },
            // [Flow] 클릭 -> 로그인 화면으로 이동하거나 앱 종료
            { key: 'exit', label: 'Exit', icon: <PoweroffOutlined />, danger: true },
        ],
    },

    // -------------------------------------------------------------------------
    // 2. [Edit] 편집 관련 메뉴 (복사, 붙여넣기, 취소)
    // -------------------------------------------------------------------------
    {
        key: 'edit',
        label: 'Edit',
        children: [
            // [Flow] 클릭 -> 방금 한 작업 취소 (Ctrl+Z)
            { key: 'undo', label: 'Undo', icon: <UndoOutlined />, extra: 'Ctrl+Z' },
            // [Flow] 클릭 -> 취소했던 작업 다시 실행 (Ctrl+Shift+Z)
            { key: 'redo', label: 'Redo', icon: <RedoOutlined />, extra: 'Ctrl+Shift+Z' },

            { type: 'divider' }, // 구분선

            // [Flow] 클릭 -> 선택한 요소 잘라내기 (클립보드 저장 + 삭제)
            { key: 'cut', label: 'Cut', icon: <ScissorOutlined />, extra: 'Ctrl+X' },
            // [Flow] 클릭 -> 선택한 요소 복사하기 (클립보드 저장)
            { key: 'copy', label: 'Copy', icon: <CopyOutlined />, extra: 'Ctrl+C' },
            // [Flow] 클릭 -> 클립보드 내용을 캔버스에 붙여넣기
            { key: 'paste', label: 'Paste', icon: <SnippetsOutlined />, extra: 'Ctrl+V' },
            // [Flow] 클릭 -> 선택한 요소 삭제하기
            { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, extra: 'Del' },

            // [Flow] 클릭 -> 캔버스의 모든 내용을 지우고 초기화
            { key: 'clear', label: 'Clear Canvas', icon: <ClearOutlined /> },
        ],
    },

    // -------------------------------------------------------------------------
    // 3. [View] 화면 보기 설정 (사이드바, 줌, 미리보기)
    // -------------------------------------------------------------------------
    {
        key: 'view',
        label: 'View',
        children: [
            // [Flow] 클릭 -> 좌측 파일 탐색기/컴포넌트 패널 열고 닫기
            { key: 'sidebar', label: 'Toggle Sidebar', icon: <LayoutOutlined />, extra: 'Ctrl+B' },
            // [Flow] 클릭 -> 뷰포트 크기 변경 모드 (데스크탑/태블릿/모바일)
            { key: 'viewport', label: 'Viewport Mode', icon: <ExpandOutlined /> },
            // [Flow] 클릭 -> 캔버스 확대
            { key: 'zoom in', label: 'Zoom', icon: <ZoomInOutlined /> },
            // [Flow] 클릭 -> 캔버스 축소
            { key: 'zoom out', label: 'Zoom', icon: <ZoomOutOutlined /> },
            // [Flow] 클릭 -> 실제 실행 화면 미리보기 (Preview)
            { key: 'preview', label: 'Preview Mode', icon: <PlaySquareOutlined />, extra: 'F5' },
        ]
    },

    // -------------------------------------------------------------------------
    // 4. [Insert] 요소 추가 메뉴 (텍스트, 레이아웃, 미디어)
    // -------------------------------------------------------------------------
    {
        key: 'insert',
        label: 'Insert',
        children: [
            // [Flow] 클릭 -> 캔버스에 'Text' 위젯 추가
            { key: 'ins-text', label: 'Text', icon: <FontSizeOutlined /> },
            // [Flow] 클릭 -> 캔버스에 'Container/Grid' 레이아웃 추가
            { key: 'ins-layout', label: 'Layout', icon: <BorderOutlined /> },
            // [Flow] 클릭 -> 캔버스에 'Image/Video' 플레이스홀더 추가
            { key: 'ins-media', label: 'Media', icon: <PictureOutlined /> },
            // [Flow] 클릭 -> 캔버스에 'Ant Design' 컴포넌트 추가
            { key: 'ins-antd', label: 'AntD Widget', icon: <CodeSandboxOutlined /> },
        ]
    },

    // -------------------------------------------------------------------------
    // 5. [Help] 도움말 메뉴
    // -------------------------------------------------------------------------
    {
        key: 'help',
        label: 'Help',
        children: [
            // [Flow] 클릭 -> 공식 문서(Documentation) 웹사이트 열기
            { key: 'docs', label: 'Documentation', icon: <ReadOutlined /> },
            // [Flow] 클릭 -> 단축키 목록 모달 띄우기
            { key: 'shortcuts', label: 'Keyboard Shortcuts', icon: <KeyOutlined />, extra: 'Ctrl+K' },
            // [Flow] 클릭 -> 버전 정보 및 앱 정보 모달 띄우기
            { key: 'about', label: 'About MetaFrame', icon: <QuestionCircleOutlined /> },
        ]
    }
];