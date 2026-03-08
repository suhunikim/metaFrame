// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { NotificationHost } from '@/components/NotificationHost'
import { useAuthStore } from '@/store'
import { ThemeProvider } from '@/theme'
import { useThemeMode } from '@/theme'

function UserPreferenceBridge() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const { setMode } = useThemeMode()

  useEffect(() => {
    const themePreference = currentUser?.themePreference

    if (themePreference === 'light' || themePreference === 'dark') {
      setMode(themePreference)
    }

    document.documentElement.style.setProperty(
      '--mf-user-font-size',
      `${currentUser?.uiFontSize ?? 14}px`,
    )
  }, [currentUser?.themePreference, currentUser?.uiFontSize, setMode])

  return null
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <UserPreferenceBridge />
      <NotificationHost>{children}</NotificationHost>
    </ThemeProvider>
  )
}
