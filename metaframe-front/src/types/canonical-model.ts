// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

export type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export type ResponsiveLayer = 'base' | 'tablet' | 'mobile'

export type EditorMode = 'design' | 'source' | 'preview'

export type NodeKind = 'html' | 'widget'

export type LayoutKind = 'flow' | 'flex' | 'grid'

export interface EditorStatusFlags {
  dirty: boolean
  synced: boolean
  warning: boolean
  locked: boolean
  conflict: boolean
  parseError: boolean
  exportable: boolean
  nonExportable: boolean
  readOnly: boolean
  recoveryAvailable: boolean
}

export interface NodeStyleModel {
  backgroundColor?: string
  color?: string
  fontSize?: string
  fontWeight?: number | string
  display?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  maxHeight?: string
  margin?: string
  padding?: string
  gap?: string
  alignItems?: string
  justifyContent?: string
  flexDirection?: string
  gridTemplateColumns?: string
  gridColumn?: string
  gridRow?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  overflow?: string
  opacity?: number
}

export type ResponsiveOverrides = Partial<Record<'tablet' | 'mobile', NodeStyleModel>>

export interface BindingModel {
  key: string
  expression: string
  source: 'auth' | 'pageState' | 'props' | 'literal'
}

export interface EventBindingModel {
  eventName: string
  handlerName: string
  kind: 'action' | 'custom'
}

export interface LayoutModel {
  kind: LayoutKind
  slot?: string | null
  order?: number
}

export interface BaseCanonicalNode {
  id: string
  name: string
  kind: NodeKind
  props: Record<string, string | number | boolean | null>
  children: string[]
  layout: LayoutModel
  slot: string | null
  bindings: BindingModel[]
  events: EventBindingModel[]
  styleRef: string | null
  baseStyle: NodeStyleModel
  responsiveOverrides: ResponsiveOverrides
  metadata: {
    locked?: boolean
    unsupported?: boolean
    depth: number
  }
}

export interface HtmlCanonicalNode extends BaseCanonicalNode {
  kind: 'html'
  tag: 'div' | 'section' | 'article' | 'header' | 'footer' | 'span' | 'p'
}

export interface WidgetCanonicalNode extends BaseCanonicalNode {
  kind: 'widget'
  componentName: 'Button' | 'Input' | 'Card' | 'Table' | 'Tabs' | 'Form'
}

export type CanonicalNodeModel = HtmlCanonicalNode | WidgetCanonicalNode

export interface CanonicalPageModel {
  pageId: string
  fileId: string
  routePath: string
  layoutId: string
  schemaVersion: string
  revision: number
  stateFlags: EditorStatusFlags
  rootNodeId: string
  nodes: Record<string, CanonicalNodeModel>
}
