// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

export type AuthState =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'success'
  | 'error'
  | 'sessionExpired'
  | 'networkError'

export type SignupState =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'pendingApproval'
  | 'activated'
  | 'duplicateEmail'
  | 'error'

export type BootstrapSetupState =
  | 'required'
  | 'validating'
  | 'creating'
  | 'success'
  | 'failed'
  | 'alreadyInitialized'

export interface BootstrapState {
  bootstrapRequired: boolean
  selfSignupEnabled: boolean
  signupMode: 'pending_approval' | 'active' | string
}

export interface CurrentUser {
  userId: string
  email: string
  displayName: string
  globalRole: string
  accountStatus: string
  themePreference: 'light' | 'dark' | 'system' | string
  uiFontSize: number
  autosaveInterval: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  sessionToken: string
  expiresAt: string
  currentUser: CurrentUser
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  extraIdentifier?: string
}

export interface SignupResponse {
  userId: string
  email: string
  status: string
}

export interface BootstrapAdminPayload {
  organizationName: string
  adminName: string
  adminEmail: string
  password: string
}

export interface AccountSettingsPayload {
  displayName: string
  themePreference: 'light' | 'dark' | 'system'
  uiFontSize: number
  autosaveInterval: number
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordPayload {
  email: string
  extraIdentifier?: string
}

export interface AuthErrorState {
  code?: string
  message: string
}
