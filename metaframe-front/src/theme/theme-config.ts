// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

export type ThemeMode = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'metaframe.theme-mode'

const sharedTheme: Pick<ThemeConfig, 'cssVar' | 'token'> = {
  cssVar: {
    prefix: 'mf',
  },
  token: {
    borderRadius: 10,
    fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
  },
}

export const themeConfigs: Record<ThemeMode, ThemeConfig> = {
  dark: {
    ...sharedTheme,
    algorithm: theme.darkAlgorithm,
    token: {
      ...sharedTheme.token,
      colorPrimary: '#1890ff',
      colorBgBase: '#1e1f22',
      colorBgContainer: '#2b2d30',
      colorBorderSecondary: '#3e4045',
      colorText: '#f5f7fa',
      colorTextSecondary: '#c0c4cc',
    },
    components: {
      Layout: {
        headerBg: '#2b2d30',
        bodyBg: '#1e1f22',
        siderBg: '#2b2d30',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: '#2b2d30',
        darkItemSelectedBg: 'rgba(24, 144, 255, 0.2)',
      },
      Tabs: {
        itemColor: '#8b8e95',
        itemSelectedColor: '#f5f7fa',
        itemActiveColor: '#f5f7fa',
        inkBarColor: '#1890ff',
      },
      Modal: {
        contentBg: 'rgba(30, 31, 34, 0.95)',
        headerBg: 'transparent',
        titleColor: '#f5f7fa',
      },
      Tree: {
        nodeHoverBg: 'rgba(24, 144, 255, 0.12)',
        nodeSelectedBg: 'rgba(24, 144, 255, 0.16)',
      },
      Select: {
        optionSelectedBg: 'rgba(24, 144, 255, 0.16)',
      },
      Button: {
        primaryShadow: 'none',
      },
    },
  },
  light: {
    ...sharedTheme,
    algorithm: theme.defaultAlgorithm,
    token: {
      ...sharedTheme.token,
      colorPrimary: '#1677ff',
      colorBgBase: '#f4f6fb',
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#dfe5ee',
      colorText: '#111827',
      colorTextSecondary: '#475569',
    },
    components: {
      Layout: {
        headerBg: '#ffffff',
        bodyBg: '#f4f6fb',
        siderBg: '#ffffff',
      },
      Menu: {
        itemBg: 'transparent',
        itemColor: '#475569',
        itemHoverColor: '#0f172a',
        itemSelectedColor: '#0f172a',
        itemSelectedBg: 'rgba(22, 119, 255, 0.14)',
      },
      Tabs: {
        itemColor: '#7b8798',
        itemSelectedColor: '#0f172a',
        itemActiveColor: '#0f172a',
        inkBarColor: '#1677ff',
      },
      Modal: {
        contentBg: 'rgba(255, 255, 255, 0.97)',
        headerBg: 'transparent',
        titleColor: '#111827',
      },
      Tree: {
        nodeHoverBg: 'rgba(22, 119, 255, 0.08)',
        nodeSelectedBg: 'rgba(22, 119, 255, 0.12)',
      },
      Select: {
        optionSelectedBg: 'rgba(22, 119, 255, 0.12)',
      },
      Button: {
        primaryShadow: 'none',
      },
    },
  },
}
