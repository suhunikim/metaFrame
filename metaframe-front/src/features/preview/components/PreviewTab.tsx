// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect, useMemo } from 'react'

import { Alert } from 'antd'

import { resolveNodeStyle } from '@/core/canonicalModelUtils'
import { PreviewFrame } from '@/features/preview/components/PreviewFrame'
import { useConsoleStore, usePreviewStore } from '@/store'
import type {
  CanonicalNodeModel,
  CanonicalPageModel,
  ResponsiveLayer,
  ViewportMode,
} from '@/types/canonical-model'

import '@/assets/css/preview-tab.css'

interface PreviewTabProps {
  model: CanonicalPageModel
  layer: ResponsiveLayer
  viewport: ViewportMode
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function toInlineStyle(node: CanonicalNodeModel, layer: ResponsiveLayer) {
  return Object.entries(resolveNodeStyle(node, layer))
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
      return `${cssKey}:${String(value)}`
    })
    .join(';')
}

function renderPreviewNode(
  node: CanonicalNodeModel | undefined,
  model: CanonicalPageModel,
  layer: ResponsiveLayer,
): string {
  if (!node) {
    return ''
  }

  const style = toInlineStyle(node, layer)
  const children = node.children
    .map((childId) => renderPreviewNode(model.nodes[childId], model, layer))
    .join('')
  const textContent = typeof node.props.text === 'string' ? escapeHtml(node.props.text) : ''

  if (node.kind === 'html') {
    return `<${node.tag} data-node-id="${node.id}" style="${style}">${textContent}${children}</${node.tag}>`
  }

  if (node.componentName === 'Button') {
    return `<button data-node-id="${node.id}" class="mf-preview__button" style="${style}">${
      textContent || escapeHtml(String(node.props.text ?? node.name))
    }</button>`
  }

  if (node.componentName === 'Input') {
    return `<input data-node-id="${node.id}" class="mf-preview__input" style="${style}" placeholder="${escapeHtml(
      String(node.props.placeholder ?? ''),
    )}" />`
  }

  const title =
    typeof node.props.title === 'string'
      ? `<div class="mf-preview__card-title">${escapeHtml(node.props.title)}</div>`
      : ''

  return `<div data-node-id="${node.id}" class="mf-preview__card" style="${style}">${title}${children}</div>`
}

function buildPreviewDocument(model: CanonicalPageModel, layer: ResponsiveLayer) {
  const rootMarkup = renderPreviewNode(model.nodes[model.rootNodeId], model, layer)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 16px;
        background: #f3f6fb;
        color: #0f172a;
        font-family: "Segoe UI", "Noto Sans KR", sans-serif;
      }
      .mf-preview__button {
        min-height: 36px;
        padding: 0 16px;
        color: #ffffff;
        background: #1677ff;
        border: none;
        border-radius: 8px;
      }
      .mf-preview__input {
        min-height: 38px;
        padding: 0 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #ffffff;
      }
      .mf-preview__card {
        padding: 16px;
        background: #ffffff;
        border: 1px solid #dbe3ef;
        border-radius: 14px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      }
      .mf-preview__card-title {
        margin-bottom: 12px;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    ${rootMarkup}
    <script>
      (function () {
        const send = function (level, message) {
          window.parent.postMessage({ source: 'metaframe-preview', level, message }, '*');
        };
        ['log', 'info', 'warn', 'error'].forEach(function (level) {
          const original = console[level];
          console[level] = function () {
            const message = Array.from(arguments).map(function (value) {
              return typeof value === 'string' ? value : JSON.stringify(value);
            }).join(' ');
            send(level, message);
            original.apply(console, arguments);
          };
        });
        window.onerror = function (message) {
          send('error', String(message));
        };
        console.info('Preview ready for route ${model.routePath}');
      })();
    </script>
  </body>
</html>`
}

// PreviewTab coordinates iframe lifecycle, preview banner state, and runtime console capture.
export function PreviewTab({ model, layer, viewport }: PreviewTabProps) {
  const previewState = usePreviewStore((state) => state.previewState)
  const previewError = usePreviewStore((state) => state.previewError)
  const setPreviewLoading = usePreviewStore((state) => state.setPreviewLoading)
  const setPreviewReady = usePreviewStore((state) => state.setPreviewReady)
  const setPreviewError = usePreviewStore((state) => state.setPreviewError)
  const appendLog = useConsoleStore((state) => state.appendLog)
  const srcDoc = useMemo(() => buildPreviewDocument(model, layer), [layer, model])

  useEffect(() => {
    // Re-rendering the iframe is treated as a fresh preview lifecycle.
    setPreviewLoading()
    appendLog('info', `Preview rebuild requested for ${model.routePath} (${layer}).`)
  }, [appendLog, layer, model.routePath, setPreviewLoading, srcDoc])

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.source !== 'metaframe-preview') {
        return
      }

      const level = event.data.level as 'log' | 'info' | 'warn' | 'error'
      const message = typeof event.data.message === 'string' ? event.data.message : 'Preview runtime event'
      appendLog(level, message)

      if (level === 'error') {
        setPreviewError(message)
      }
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [appendLog, setPreviewError])

  return (
    <div className="preview-tab">
      <Alert
        type={previewError ? 'error' : previewState === 'ready' ? 'success' : 'info'}
        showIcon
        message={
          previewError
            ? 'Preview runtime error'
            : previewState === 'ready'
              ? 'Preview ready'
              : 'Preview is rendering'
        }
        description={
          previewError
            ? previewError
            : `Current viewport ${viewport} is rendering the ${layer} responsive layer.`
        }
      />

      <PreviewFrame viewport={viewport} srcDoc={srcDoc} onLoad={setPreviewReady} />
    </div>
  )
}
