// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { clearSessionToken, readSessionToken } from '@/shared/auth/sessionStorage'

const API_BASE_URL = import.meta.env.VITE_METAFRAME_API_BASE_URL ?? 'http://127.0.0.1:4300'

export interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  data: T
  timestamp: string
}

export class ApiClientError extends Error {
  readonly status: number
  readonly code: string
  readonly data?: unknown

  constructor(message: string, status: number, code: string, data?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.data = data
  }
}

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  options?: { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init?.headers)
  const shouldAttachAuth = options?.auth !== false
  const token = shouldAttachAuth ? readSessionToken() : null

  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const rawText = await response.text()
  const payload = rawText ? (JSON.parse(rawText) as ApiEnvelope<T>) : null

  if (!response.ok || !payload?.success) {
    const code = payload?.code ?? 'API_REQUEST_FAILED'
    const message = payload?.message ?? `MetaFrame API request failed with status ${response.status}.`

    if (response.status === 401 && shouldAttachAuth) {
      clearSessionToken()
      unauthorizedHandler?.()
    }

    throw new ApiClientError(message, response.status, code, payload?.data)
  }

  return payload.data
}
