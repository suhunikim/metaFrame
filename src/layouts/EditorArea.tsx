import { Tabs } from "antd";
import "./EditorArea.css";

export default function EditorArea() {
    // [임시 데이터] 처음 켰을 때 보여줄 'Welcome' 탭 하나를 만듭니다.
    const items = [
        {
            key: 'welcome',
            label: 'Welcome',
            children: (
                <div className="canvas-placeholder">
                    <div style={{ marginBottom: 20, fontSize: 40 }}>🚀</div>
                    <p>MetaFrame IDE에 오신 것을 환영합니다.</p>
                    <p style={{ fontSize: 12, opacity: 0.6 }}>
                        좌측 탐색기에서 파일을 선택하거나, 새로운 프로젝트를 시작하세요.
                    </p>
                </div>
            ),
            closable: true, // Welcome 탭은 닫을 수 없게 설정
        },
    ];

    return (
        <div className="editor-container">
            <Tabs
                type="editable-card" // 카드 모양 탭 사용
                hideAdd // '+ (추가)' 버튼 숨김
                activeKey="welcome" // 현재 선택된 탭
                items={items} // 탭 목록 데이터 연결
                className="editor-tabs"
                tabBarGutter={0} // 탭 사이 간격 없음 (딱 붙이기)
                animated={false} // 애니메이션 끄기 (빠릿하게 전환)
            />
        </div>
    );
}