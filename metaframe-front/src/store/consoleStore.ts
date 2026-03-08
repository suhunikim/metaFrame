// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error'

export interface ConsoleLogEntry {
  id: string
  level: ConsoleLogLevel
  message: string
  timestamp: string
}

interface ConsoleStoreState {
  consoleLogs: ConsoleLogEntry[]
  consoleErrors: number
  consoleOpen: boolean
  appendLog: (level: ConsoleLogLevel, message: string) => void
  clearLogs: () => void
  setConsoleOpen: (open: boolean) => void
  toggleConsoleOpen: () => void
}

// Preview/runtime console history lives here so preview reloads do not wipe the shell chrome.
export const useConsoleStore = create<ConsoleStoreState>((set) => ({
  consoleLogs: [],
  consoleErrors: 0,
  consoleOpen: true,
  appendLog: (level, message) =>
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs.slice(-199),
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          level,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
      consoleErrors: state.consoleErrors + (level === 'error' ? 1 : 0),
    })),
  clearLogs: () =>
    set({
      consoleLogs: [],
      consoleErrors: 0,
    }),
  setConsoleOpen: (consoleOpen) => set({ consoleOpen }),
  toggleConsoleOpen: () => set((state) => ({ consoleOpen: !state.consoleOpen })),
}))
