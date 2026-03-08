// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

export type LeftPanelTab = 'files' | 'router' | 'palette' | 'global' | 'assets'

interface LeftPanelState {
  activeLeftPanelTab: LeftPanelTab
  setActiveLeftPanelTab: (tab: LeftPanelTab) => void
}

// The activity bar owns only tab switching; each panel keeps its own internal state.
export const useLeftPanelStore = create<LeftPanelState>((set) => ({
  activeLeftPanelTab: 'files',
  setActiveLeftPanelTab: (tab) => set({ activeLeftPanelTab: tab }),
}))
