import { useState } from "react";
import { Menu } from "antd";
import {
    FolderOpenOutlined,      // 파일 탐색기 아이콘
    DeploymentUnitOutlined,  // 라우터(구조) 아이콘
    AppstoreAddOutlined,     // 팔레트(도구) 아이콘
    BgColorsOutlined,        // 스타일 아이콘
    GlobalOutlined           // 전역 설정 아이콘
} from "@ant-design/icons";
import "./LeftPanel.css";
import FileExplorer from "../components/FileExplorer";

export default function LeftPanel() {
    // [상태] 현재 어떤 탭이 선택되었는지 기억함 (기본값: files)
    const [activeKey, setActiveKey] = useState("files");

    // 메뉴 목록 정의 (아이콘들)
    const menuItems = [
        { key: 'files', icon: <FolderOpenOutlined />, label: '' },
        { key: 'router', icon: <DeploymentUnitOutlined />, label: '' },
        { key: 'palette', icon: <AppstoreAddOutlined />, label: '' },
        { key: 'styles', icon: <BgColorsOutlined />, label: '' },
        { key: 'global', icon: <GlobalOutlined />, label: '' },
    ];

    // [렌더링] activeKey에 따라 오른쪽 내용을 바꿔주는 함수
    const renderContent = () => {
        switch (activeKey) {
            case 'files': return <FileExplorer />; // 파일 탐색기 보여줌
            case 'router': return <div className="left-panel-tab-content">🔗 라우터 설정</div>;
            case 'palette': return <div className="left-panel-tab-content">📦 컴포넌트 팔레트</div>;
            case 'styles': return <div className="left-panel-tab-content">🎨 스타일 편집</div>;
            case 'global': return <div className="left-panel-tab-content">🌍 전역 설정</div>;
            default: return null;
        }
    };

    return (
        <div className="left-panel-container">
            {/* 1. 왼쪽 좁은 줄 (Activity Bar) */}
            <div className="left-activity-bar">
                <Menu
                    mode="inline" // 세로 모드
                    selectedKeys={[activeKey]} // 현재 선택된 놈 불 켜기
                    items={menuItems}
                    onClick={(e) => setActiveKey(e.key)} // 클릭하면 상태 변경
                    theme="dark" // 다크 테마
                    // 배경색을 투명하게 (CSS에서 제어할 거임)
                    style={{ backgroundColor: 'transparent' }}
                />
            </div>

            {/* 2. 오른쪽 넓은 면 (Side Bar) */}
            <div className="left-panel-content-area">
                {renderContent()}
            </div>
        </div>
    );
}