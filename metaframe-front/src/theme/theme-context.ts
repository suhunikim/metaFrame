// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { createContext } from 'react'

import type { ThemeMode } from '@/theme/theme-config'

export interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
