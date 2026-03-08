// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { CanonicalNodeModel, CanonicalPageModel, EditorStatusFlags } from '@/types/canonical-model'
import type { ManagedFileNode } from '@/types/file-tree.types'

const defaultFlags: EditorStatusFlags = {
  dirty: true,
  synced: false,
  warning: false,
  locked: false,
  conflict: false,
  parseError: false,
  exportable: false,
  nonExportable: true,
  readOnly: false,
  recoveryAvailable: true,
}

const homePageNodes: Record<string, CanonicalNodeModel> = {
  'page-root': {
    id: 'page-root',
    name: 'HomePageRoot',
    kind: 'html',
    tag: 'section',
    props: {},
    children: ['hero-section', 'search-toolbar'],
    layout: { kind: 'flow' },
    slot: null,
    bindings: [],
    events: [],
    styleRef: 'home-page',
    baseStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '24px',
    },
    responsiveOverrides: {
      mobile: {
        padding: '16px',
        gap: '16px',
      },
    },
    metadata: {
      depth: 0,
    },
  },
  'hero-section': {
    id: 'hero-section',
    name: 'Hero Section',
    kind: 'html',
    tag: 'div',
    props: {},
    children: ['hero-title', 'hero-description'],
    layout: { kind: 'flex' },
    slot: null,
    bindings: [],
    events: [],
    styleRef: 'home-page__hero',
    baseStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#2b2d30',
      padding: '24px',
      borderRadius: '18px',
    },
    responsiveOverrides: {
      mobile: {
        padding: '18px',
      },
    },
    metadata: {
      depth: 1,
    },
  },
  'hero-title': {
    id: 'hero-title',
    name: 'Hero Title',
    kind: 'html',
    tag: 'p',
    props: {
      text: 'MetaFrame Dashboard',
    },
    children: [],
    layout: { kind: 'flow' },
    slot: null,
    bindings: [],
    events: [],
    styleRef: 'home-page__hero-title',
    baseStyle: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#f5f7fa',
      margin: '0',
    },
    responsiveOverrides: {
      mobile: {
        fontSize: '22px',
      },
    },
    metadata: {
      depth: 2,
    },
  },
  'hero-description': {
    id: 'hero-description',
    name: 'Hero Description',
    kind: 'html',
    tag: 'p',
    props: {
      text: 'Visual source IDE for managed React project editing.',
    },
    children: [],
    layout: { kind: 'flow' },
    slot: null,
    bindings: [],
    events: [],
    styleRef: 'home-page__hero-description',
    baseStyle: {
      color: '#c0c4cc',
      margin: '0',
    },
    responsiveOverrides: {},
    metadata: {
      depth: 2,
    },
  },
  'search-toolbar': {
    id: 'search-toolbar',
    name: 'Search Toolbar',
    kind: 'widget',
    componentName: 'Card',
    props: {
      title: 'Quick Search',
    },
    children: ['search-input', 'search-button'],
    layout: { kind: 'flex' },
    slot: 'content',
    bindings: [],
    events: [],
    styleRef: 'home-page__search-toolbar',
    baseStyle: {
      display: 'flex',
      gap: '12px',
      padding: '16px',
      alignItems: 'center',
    },
    responsiveOverrides: {
      mobile: {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
    metadata: {
      depth: 1,
    },
  },
  'search-input': {
    id: 'search-input',
    name: 'Keyword Input',
    kind: 'widget',
    componentName: 'Input',
    props: {
      placeholder: 'Search project assets',
    },
    children: [],
    layout: { kind: 'flex', order: 0 },
    slot: null,
    bindings: [
      {
        key: 'value',
        expression: '{{pageState.keyword}}',
        source: 'pageState',
      },
    ],
    events: [
      {
        eventName: 'onChange',
        handlerName: 'handleKeywordChange',
        kind: 'action',
      },
    ],
    styleRef: 'home-page__search-input',
    baseStyle: {
      minWidth: '280px',
    },
    responsiveOverrides: {
      mobile: {
        minWidth: '100%',
        width: '100%',
      },
    },
    metadata: {
      depth: 2,
    },
  },
  'search-button': {
    id: 'search-button',
    name: 'Search Button',
    kind: 'widget',
    componentName: 'Button',
    props: {
      type: 'primary',
      text: 'Search',
    },
    children: [],
    layout: { kind: 'flex', order: 1 },
    slot: null,
    bindings: [],
    events: [
      {
        eventName: 'onClick',
        handlerName: 'handleSearch',
        kind: 'action',
      },
    ],
    styleRef: 'home-page__search-button',
    baseStyle: {},
    responsiveOverrides: {
      mobile: {
        width: '100%',
      },
    },
    metadata: {
      depth: 2,
    },
  },
}

export const initialProject = {
  projectId: 'project-metaframe-demo',
  name: 'MetaFrame Demo Workspace',
  templateType: 'stable-recommended',
}

export const initialFiles: ManagedFileNode[] = [
  {
    id: 'workspace-root',
    name: 'MetaFrame Demo Workspace',
    path: '/',
    extension: null,
    kind: 'folder',
    managedType: 'folder',
    isProtected: false,
    isDeleted: false,
    children: [
      {
        id: 'src-folder',
        name: 'src',
        path: '/src',
        extension: null,
        kind: 'folder',
        managedType: 'folder',
        isProtected: false,
        isDeleted: false,
        children: [
          {
            id: 'pages-folder',
            name: 'pages',
            path: '/src/pages',
            extension: null,
            kind: 'folder',
            managedType: 'folder',
            isProtected: false,
            isDeleted: false,
            children: [
              {
                id: 'page-home',
                name: 'HomePage.tsx',
                path: '/src/pages/HomePage.tsx',
                extension: 'tsx',
                kind: 'file',
                managedType: 'page',
                isProtected: false,
                isDeleted: false,
              },
            ],
          },
          {
            id: 'layouts-folder',
            name: 'layouts',
            path: '/src/layouts',
            extension: null,
            kind: 'folder',
            managedType: 'folder',
            isProtected: false,
            isDeleted: false,
            children: [
              {
                id: 'layout-main',
                name: 'MainLayout.tsx',
                path: '/src/layouts/MainLayout.tsx',
                extension: 'tsx',
                kind: 'file',
                managedType: 'layout',
                isProtected: false,
                isDeleted: false,
              },
            ],
          },
          {
            id: 'components-folder',
            name: 'components',
            path: '/src/components',
            extension: null,
            kind: 'folder',
            managedType: 'folder',
            isProtected: false,
            isDeleted: false,
            children: [
              {
                id: 'component-search-toolbar',
                name: 'SearchToolbar.tsx',
                path: '/src/components/SearchToolbar.tsx',
                extension: 'tsx',
                kind: 'file',
                managedType: 'general',
                isProtected: false,
                isDeleted: false,
              },
            ],
          },
          {
            id: 'app-entry',
            name: 'App.tsx',
            path: '/src/App.tsx',
            extension: 'tsx',
            kind: 'file',
            managedType: 'system',
            isProtected: true,
            isDeleted: false,
          },
          {
            id: 'main-entry',
            name: 'main.tsx',
            path: '/src/main.tsx',
            extension: 'tsx',
            kind: 'file',
            managedType: 'system',
            isProtected: true,
            isDeleted: false,
          },
        ],
      },
      {
        id: 'package-json',
        name: 'package.json',
        path: '/package.json',
        extension: 'json',
        kind: 'file',
        managedType: 'system',
        isProtected: true,
        isDeleted: false,
      },
    ],
  },
]

export const initialPagesByFileId: Record<string, CanonicalPageModel> = {
  'page-home': {
    pageId: 'home-page',
    fileId: 'page-home',
    routePath: '/',
    layoutId: 'layout-main',
    schemaVersion: '1.0.0',
    revision: 1,
    stateFlags: defaultFlags,
    rootNodeId: 'page-root',
    nodes: homePageNodes,
  },
}
