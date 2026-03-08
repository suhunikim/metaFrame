import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Layout } from "antd";
import "./MainLayout.css";
import HeaderPanel from "./HeaderPanel";
import LeftPanel from "./LeftPanel";
import EditorArea from "./EditorArea";


const { Header, Content } = Layout;

export default function MainLayout() {
    return (
        <Layout className="ide-layout">
            {/* 상단 헤더: HeaderPanel 사용 */}
            <Header className="ide-header">
                <HeaderPanel />
            </Header>

            <Content className="ide-content">
                <Allotment>
                    <Allotment.Pane preferredSize={250} minSize={200} className="tool-window">
                        <LeftPanel />
                    </Allotment.Pane>

                    <Allotment.Pane className="editor-area">
                        <EditorArea />
                    </Allotment.Pane>

                    {/*<Allotment.Pane preferredSize={300} minSize={250} className="tool-window">*/}
                    {/*    <div className="pane-inner">Right Inspector</div>*/}
                    {/*</Allotment.Pane>*/}
                </Allotment>
            </Content>
        </Layout>
    );
}