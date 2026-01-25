import { Spin } from 'antd';
import './GlobalSpinner.css'; // [중요] 방금 만든 옷장(CSS) 가져오기

export default function GlobalSpinner() {
    return (
        // 지저분한 style={{...}} 대신 깔끔하게 이름표(className)만 붙입니다.
        <div className="global-spinner-overlay">
            <Spin size="large" tip="Loading..." />
        </div>
    );
}