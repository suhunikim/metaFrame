// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

interface CommandPaletteStoreState {
  commandPaletteOpen: boolean
  commandPaletteQuery: string
  openPalette: (initialQuery?: string) => void
  closePalette: () => void
  setQuery: (query: string) => void
}

// Command palette state is global because header search and hotkeys must open the same surface.
export const useCommandPaletteStore = create<CommandPaletteStoreState>((set) => ({
  commandPaletteOpen: false,
  commandPaletteQuery: '',
  openPalette: (initialQuery = '') =>
    set({
      commandPaletteOpen: true,
      commandPaletteQuery: initialQuery,
    }),
  closePalette: () =>
    set({
      commandPaletteOpen: false,
      commandPaletteQuery: '',
    }),
  setQuery: (commandPaletteQuery) => set({ commandPaletteQuery }),
}))
