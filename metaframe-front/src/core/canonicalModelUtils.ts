// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type {
  CanonicalNodeModel,
  CanonicalPageModel,
  EditorStatusFlags,
  ResponsiveLayer,
} from '@/types/canonical-model'

const statusPriority = [
  'conflict',
  'locked',
  'parseError',
  'warning',
  'dirty',
  'nonExportable',
  'exportable',
  'synced',
  'recoveryAvailable',
  'readOnly',
] as const

type StatusKey = (typeof statusPriority)[number]

export interface DerivedStatusChip {
  tone:
    | 'conflict'
    | 'locked'
    | 'parseError'
    | 'warning'
    | 'dirty'
    | 'nonExportable'
    | 'exportable'
    | 'synced'
    | 'recovery'
    | 'readOnly'
  label: string
}

const statusLabels: Partial<Record<StatusKey, string>> = {
  conflict: 'Conflict',
  locked: 'Locked',
  parseError: 'Parse Error',
  warning: 'Warning',
  dirty: 'Dirty',
  nonExportable: 'Blocked',
  exportable: 'Exportable',
  synced: 'Synced',
  recoveryAvailable: 'Recovery',
  readOnly: 'Read Only',
}

export function resolveNodeStyle(node: CanonicalNodeModel, layer: ResponsiveLayer) {
  return {
    ...node.baseStyle,
    ...(layer === 'tablet' ? node.responsiveOverrides.tablet : {}),
    ...(layer === 'mobile' ? node.responsiveOverrides.mobile : {}),
  }
}

export function deriveStatusChips(flags: EditorStatusFlags): DerivedStatusChip[] {
  return statusPriority.reduce<DerivedStatusChip[]>((chips, key) => {
    if (!flags[key]) {
      return chips
    }

    if (key === 'recoveryAvailable') {
      chips.push({
        tone: 'recovery',
        label: statusLabels[key] ?? 'Recovery',
      })

      return chips
    }

    chips.push({
      tone:
        key === 'warning'
          ? 'warning'
          : (key as Exclude<StatusKey, 'warning' | 'recoveryAvailable'>),
      label: statusLabels[key] ?? key,
    })

    return chips
  }, [])
}

function toCamelCase(token: string) {
  return token
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment, index) =>
      index === 0
        ? segment.charAt(0).toLowerCase() + segment.slice(1)
        : segment.charAt(0).toUpperCase() + segment.slice(1),
    )
    .join('')
}

function formatPropValue(value: string | number | boolean | null) {
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`
  }

  if (value === null) {
    return 'null'
  }

  return String(value)
}

function renderStyleObject(node: CanonicalNodeModel, layer: ResponsiveLayer) {
  const style = resolveNodeStyle(node, layer)
  const entries = Object.entries(style)

  if (entries.length === 0) {
    return '{}'
  }

  const rendered = entries.map(([key, value]) => `  ${key}: ${formatPropValue(value)}`)
  return `{\n${rendered.join(',\n')}\n}`
}

function renderHtmlNode(
  node: CanonicalNodeModel,
  model: CanonicalPageModel,
  layer: ResponsiveLayer,
  depth: number,
): string {
  const indent = '  '.repeat(depth)
  const styleName = toCamelCase(node.styleRef ?? node.id)
  const children = node.children.map((childId) => renderNode(model.nodes[childId], model, layer, depth + 1))
  const textContent = typeof node.props.text === 'string' ? node.props.text : null
  const hasChildren = children.length > 0

  if (!hasChildren && !textContent && node.kind === 'html') {
    return `${indent}<${node.tag} style={styles.${styleName}} />`
  }

  if (node.kind !== 'html') {
    return ''
  }

  const content = [textContent ? `${indent}  ${textContent}` : null, ...children].filter(Boolean).join('\n')
  return `${indent}<${node.tag} style={styles.${styleName}}>\n${content}\n${indent}</${node.tag}>`
}

function renderWidgetNode(
  node: CanonicalNodeModel,
  model: CanonicalPageModel,
  layer: ResponsiveLayer,
  depth: number,
): string {
  const indent = '  '.repeat(depth)
  const styleName = toCamelCase(node.styleRef ?? node.id)
  const children = node.children.map((childId) => renderNode(model.nodes[childId], model, layer, depth + 1))

  if (node.kind !== 'widget') {
    return ''
  }

  if (node.componentName === 'Button') {
    const buttonText = typeof node.props.text === 'string' ? node.props.text : node.name
    const typeProp = typeof node.props.type === 'string' ? ` type="${node.props.type}"` : ''
    const handler = node.events.find((event) => event.eventName === 'onClick')
    const eventProp = handler ? ` onClick={${handler.handlerName}}` : ''

    return `${indent}<Button${typeProp}${eventProp} style={styles.${styleName}}>${buttonText}</Button>`
  }

  if (node.componentName === 'Input') {
    const placeholder =
      typeof node.props.placeholder === 'string' ? ` placeholder="${node.props.placeholder}"` : ''
    const binding = node.bindings.find((candidate) => candidate.key === 'value')
    const valueProp = binding ? ` value={${binding.expression.replaceAll('{{', '').replaceAll('}}', '')}}` : ''
    const handler = node.events.find((event) => event.eventName === 'onChange')
    const eventProp = handler ? ` onChange={${handler.handlerName}}` : ''

    return `${indent}<Input${placeholder}${valueProp}${eventProp} style={styles.${styleName}} />`
  }

  const containerBody = children.join('\n')
  const titleProp = typeof node.props.title === 'string' ? ` title="${node.props.title}"` : ''

  if (!containerBody) {
    return `${indent}<${node.componentName}${titleProp} style={styles.${styleName}} />`
  }

  return `${indent}<${node.componentName}${titleProp} style={styles.${styleName}}>\n${containerBody}\n${indent}</${node.componentName}>`
}

function renderNode(
  node: CanonicalNodeModel | undefined,
  model: CanonicalPageModel,
  layer: ResponsiveLayer,
  depth: number,
): string {
  if (!node) {
    return ''
  }

  return node.kind === 'html'
    ? renderHtmlNode(node, model, layer, depth)
    : renderWidgetNode(node, model, layer, depth)
}

export function generateSourceFromPage(model: CanonicalPageModel, layer: ResponsiveLayer) {
  const widgetImports = new Set<string>()
  const handlerNames = new Set<string>()

  Object.values(model.nodes).forEach((node) => {
    if (node.kind === 'widget') {
      widgetImports.add(node.componentName)
    }

    node.events.forEach((event) => {
      handlerNames.add(event.handlerName)
    })
  })

  const rootNode = model.nodes[model.rootNodeId]
  const importLine = widgetImports.size > 0 ? `import { ${Array.from(widgetImports).sort().join(', ')} } from 'antd'\n\n` : ''
  const handlerBlock =
    handlerNames.size > 0
      ? `${Array.from(handlerNames)
          .sort()
          .map((handlerName) => `  const ${handlerName} = () => {\n    // TODO: wire handler through Canonical Action Model\n  }`)
          .join('\n\n')}\n\n`
      : ''
  const stylesBlock = Object.values(model.nodes)
    .map((node) => {
      const styleName = toCamelCase(node.styleRef ?? node.id)
      return `  ${styleName}: ${renderStyleObject(node, layer)}`
    })
    .join(',\n')

  return `${importLine}export default function ${rootNode.name}() {\n${handlerBlock}  const styles = {\n${stylesBlock}\n  }\n\n  return (\n${renderNode(rootNode, model, layer, 2)}\n  )\n}`
}

export function summarizeNodeType(node: CanonicalNodeModel) {
  if (node.kind === 'html') {
    return `<${node.tag}>`
  }

  return node.componentName
}
