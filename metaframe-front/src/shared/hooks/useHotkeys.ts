// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { useEffect } from 'react'

function normalizeKey(key: string) {
  return key.toLowerCase()
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"]') !== null
  )
}

// A thin hotkey hook keeps keyboard actions consistent across pages and modals.
export function useHotkeys(
  bindings: Array<{
    combo: string
    handler: (event: KeyboardEvent) => void
    enabled?: boolean
    allowInInputs?: boolean
  }>,
) {
  useEffect(() => {
    const activeBindings = bindings.filter((binding) => binding.enabled !== false)

    if (activeBindings.length === 0) {
      return
    }

    const listener = (event: KeyboardEvent) => {
      // Text inputs keep native shortcuts unless a binding explicitly opts in.
      if (isTypingTarget(event.target)) {
        const inputAllowed = activeBindings.some(
          (binding) =>
            binding.allowInInputs &&
            normalizeKey(binding.combo) ===
              normalizeKey(
                [
                  event.ctrlKey || event.metaKey ? 'mod' : null,
                  event.altKey ? 'alt' : null,
                  event.shiftKey ? 'shift' : null,
                  normalizeKey(event.key),
                ]
                  .filter(Boolean)
                  .join('+'),
              ),
        )

        if (!inputAllowed) {
          return
        }
      }

      const currentCombo = [
        event.ctrlKey || event.metaKey ? 'mod' : null,
        event.altKey ? 'alt' : null,
        event.shiftKey ? 'shift' : null,
        normalizeKey(event.key),
      ]
        .filter(Boolean)
        .join('+')

      const matched = activeBindings.find(
        (binding) => normalizeKey(binding.combo) === normalizeKey(currentCombo),
      )

      if (!matched) {
        return
      }

      event.preventDefault()
      matched.handler(event)
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [bindings])
}
