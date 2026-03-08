// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

// Shared types live here so feature packages can agree on the same UI and API shapes.
export type LoadState = 'idle' | 'loading' | 'success' | 'error'

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
  code?: string
}

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}
