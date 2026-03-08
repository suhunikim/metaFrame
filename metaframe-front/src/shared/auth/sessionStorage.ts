// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

const SESSION_TOKEN_KEY = 'metaframe.session.token'

export function readSessionToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY)
}

export function writeSessionToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SESSION_TOKEN_KEY, token)
}

export function clearSessionToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY)
}
