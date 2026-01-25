import { ConfigProvider, App as AntdApp } from 'antd';
import 'allotment/dist/style.css';
import MainLayout from "./layouts/MainLayout.tsx"; // 화면 분할 라이브러리 스타일

function App() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
            {/* 2. MainLayout을 AntdApp으로 감싸기 */}
            <AntdApp>
                <MainLayout />
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;