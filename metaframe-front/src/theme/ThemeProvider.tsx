// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

import { App as AntdApp, ConfigProvider } from 'antd'

import { ThemeContext } from '@/theme/theme-context'
import { THEME_STORAGE_KEY, themeConfigs, type ThemeMode } from '@/theme/theme-config'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  }, [mode])

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode: () =>
          setMode((currentMode: ThemeMode) => (currentMode === 'dark' ? 'light' : 'dark')),
      }}
    >
      <ConfigProvider theme={themeConfigs[mode]}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
