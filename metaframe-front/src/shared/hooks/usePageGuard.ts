// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect } from 'react'

// Dirty-page protection is centralized here so modal and route transitions share one rule.
export function usePageGuard(enabled: boolean, message = 'You have unsaved changes.') {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled, message])
}
