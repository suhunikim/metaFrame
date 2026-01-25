import React from 'react';
// 1. 스토어 연결 (TV 안테나 설치)
import { useFileStore } from '../../store/fileStore';

const EditorPane: React.FC = () => {
    // 2. 스토어 구독: "지금 누가 선택됐니?" (selectedId 변경 감지)
    const { selectedId } = useFileStore();

    return (
        <div style={{ padding: '20px', color: '#fff' }}>
            <h2>📝 편집기 화면</h2>
            <div style={{ marginTop: '20px', fontSize: '18px' }}>
                현재 선택된 파일 ID: <br />
                {/* 3. 데이터 표시: ID가 있으면 파란색으로, 없으면 회색 안내문구 */}
                <span style={{ color: selectedId ? '#4096ff' : '#999', fontWeight: 'bold' }}>
                    {selectedId || "파일을 선택해주세요."}
                </span>
            </div>
        </div>
    );
};

export default EditorPane;