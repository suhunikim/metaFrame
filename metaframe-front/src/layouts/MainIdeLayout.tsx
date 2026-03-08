// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Allotment } from 'allotment'
import { Layout } from 'antd'

import { PanelErrorBoundary } from '@/components/PanelErrorBoundary'
import { HeaderPanel } from '@/components/header/HeaderPanel'
import { RightInspector } from '@/components/inspector/RightInspector'
import { LeftPanel } from '@/components/left-panel/LeftPanel'
import { StatusBar } from '@/components/status-bar/StatusBar'
import { CenterWorkspace } from '@/components/workspace/CenterWorkspace'

import '@/assets/css/main-ide-layout.css'

const { Header, Content, Footer } = Layout

// Main IDE layout wires the five shell regions together and leaves feature detail to child packages.
export default function MainIdeLayout() {
  return (
    <Layout className="ide-layout">
      <Header className="ide-header">
        <PanelErrorBoundary title="Header panel failed">
          <HeaderPanel />
        </PanelErrorBoundary>
      </Header>

      <Content className="ide-content">
        <Allotment>
          <Allotment.Pane preferredSize={280} minSize={240} className="tool-window">
            <PanelErrorBoundary title="Left workspace panel failed">
              <LeftPanel />
            </PanelErrorBoundary>
          </Allotment.Pane>

          <Allotment.Pane className="editor-area">
            <PanelErrorBoundary title="Editor workspace failed">
              <CenterWorkspace />
            </PanelErrorBoundary>
          </Allotment.Pane>

          <Allotment.Pane preferredSize={340} minSize={300} className="tool-window">
            <PanelErrorBoundary title="Inspector panel failed">
              <RightInspector />
            </PanelErrorBoundary>
          </Allotment.Pane>
        </Allotment>
      </Content>

      <Footer className="ide-footer">
        <PanelErrorBoundary title="Status bar failed">
          <StatusBar />
        </PanelErrorBoundary>
      </Footer>
    </Layout>
  )
}
