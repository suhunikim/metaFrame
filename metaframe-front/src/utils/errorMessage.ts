// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { ApiClientError } from '@/shared/api/apiClient'
import type { AuthErrorState } from '@/types/auth.types'

// Normalize mixed backend and runtime errors into one user-facing string.
export function toErrorMessage(error: unknown, fallback = 'An unexpected error occurred.') {
  if (error instanceof ApiClientError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}

// - Role: Build one auth-friendly error object with both message and optional code.
// - Notes: This keeps auth stores from repeating ApiClientError branching in every action.
export function toAuthErrorState(error: unknown): AuthErrorState {
  if (error instanceof ApiClientError) {
    return {
      code: error.code,
      message: error.message,
    }
  }

  return {
    message: toErrorMessage(error),
  }
}

export function isNetworkFailure(error: unknown) {
  return !(error instanceof ApiClientError)
}
