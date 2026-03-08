// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

import type { ThemeMode } from '@/theme'

const SETTINGS_STORAGE_KEY = 'metaframe.ide-settings'

export interface UserSettingsState {
  themeMode: ThemeMode
  uiFontSize: number
  autosaveMinutes: number
  hydrate: () => void
  updateSettings: (patch: Partial<Pick<UserSettingsState, 'themeMode' | 'uiFontSize' | 'autosaveMinutes'>>) => void
}

function readStoredSettings() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as Pick<UserSettingsState, 'themeMode' | 'uiFontSize' | 'autosaveMinutes'>
  } catch {
    return null
  }
}

function persistSettings(settings: Pick<UserSettingsState, 'themeMode' | 'uiFontSize' | 'autosaveMinutes'>) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

// Local IDE settings stay in one store until the dedicated settings API replaces persistence.
export const useSettingsStore = create<UserSettingsState>((set) => ({
  themeMode: 'dark',
  uiFontSize: 14,
  autosaveMinutes: 5,
  hydrate: () => {
    const saved = readStoredSettings()

    if (!saved) {
      return
    }

    set(saved)
  },
  updateSettings: (patch) =>
    set((state) => {
      const nextState = {
        themeMode: patch.themeMode ?? state.themeMode,
        uiFontSize: patch.uiFontSize ?? state.uiFontSize,
        autosaveMinutes: patch.autosaveMinutes ?? state.autosaveMinutes,
      }

      persistSettings(nextState)
      return nextState
    }),
}))
