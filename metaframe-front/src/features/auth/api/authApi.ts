// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { apiRequest } from '@/shared/api/apiClient'
import type {
  AccountSettingsPayload,
  BootstrapAdminPayload,
  BootstrapState,
  ChangePasswordPayload,
  CurrentUser,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  SignupPayload,
  SignupResponse,
} from '@/types/auth.types'

export function getBootstrapState() {
  return apiRequest<BootstrapState>('/api/bootstrap/state', undefined, { auth: false })
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false })
}

export function getCurrentUser() {
  return apiRequest<CurrentUser>('/api/auth/me')
}

export function logout() {
  return apiRequest<void>('/api/auth/logout', {
    method: 'POST',
  })
}

export function signup(payload: SignupPayload) {
  return apiRequest<SignupResponse>('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false })
}

export function bootstrapAdmin(payload: BootstrapAdminPayload) {
  return apiRequest<LoginResponse>('/api/bootstrap/admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false })
}

export function updateAccountSettings(payload: AccountSettingsPayload) {
  return apiRequest<CurrentUser>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiRequest<void>('/api/auth/password/change', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function requestPasswordReset(payload: ResetPasswordPayload) {
  return apiRequest<void>('/api/auth/password/reset-request', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false })
}
