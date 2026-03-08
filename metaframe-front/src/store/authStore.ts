// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { create } from 'zustand'

import {
  bootstrapAdmin,
  changePassword,
  getBootstrapState,
  getCurrentUser,
  login,
  logout,
  requestPasswordReset,
  signup,
  updateAccountSettings,
} from '@/features/auth/api/authApi'
import { ApiClientError, setUnauthorizedHandler } from '@/shared/api/apiClient'
import { clearSessionToken, readSessionToken, writeSessionToken } from '@/shared/auth/sessionStorage'
import { DEV_LOGIN_BYPASS_ENABLED } from '@/shared/dev/devMode'
import type {
  AccountSettingsPayload,
  AuthErrorState,
  AuthState,
  BootstrapAdminPayload,
  BootstrapSetupState,
  BootstrapState,
  ChangePasswordPayload,
  CurrentUser,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
  SignupResponse,
  SignupState,
} from '@/types/auth.types'
import { isNetworkFailure, toAuthErrorState } from '@/utils/errorMessage'

const BYPASS_BOOTSTRAP_STATE: BootstrapState = {
  bootstrapRequired: false,
  selfSignupEnabled: true,
  signupMode: 'pending_approval',
}

const BYPASS_USER: CurrentUser = {
  userId: 'local-dev-user',
  email: 'local-dev@metaframe.app',
  displayName: 'Local Dev User',
  globalRole: 'owner',
  accountStatus: 'active',
  themePreference: 'system',
  uiFontSize: 14,
  autosaveInterval: 30,
}

interface AuthStoreState {
  initialized: boolean
  initializing: boolean
  bootstrapState: BootstrapState | null
  currentUser: CurrentUser | null
  authState: AuthState
  signupState: SignupState
  initialAdminSetupState: BootstrapSetupState
  accountSettingsState: AuthState
  resetPasswordState: AuthState
  changePasswordState: AuthState
  sessionExpired: boolean
  networkState: 'online' | 'offline'
  authError: AuthErrorState | null
  signupResult: SignupResponse | null
  initialize: () => Promise<void>
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<SignupResponse>
  bootstrapAdmin: (payload: BootstrapAdminPayload) => Promise<void>
  logout: () => Promise<void>
  updateAccountSettings: (payload: AccountSettingsPayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
  requestPasswordReset: (payload: ResetPasswordPayload) => Promise<void>
  clearAuthError: () => void
  clearSessionExpired: () => void
  markSessionExpired: () => void
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  initialized: false,
  initializing: false,
  bootstrapState: null,
  currentUser: null,
  authState: 'idle',
  signupState: 'idle',
  initialAdminSetupState: 'required',
  accountSettingsState: 'idle',
  resetPasswordState: 'idle',
  changePasswordState: 'idle',
  sessionExpired: false,
  networkState: 'online',
  authError: null,
  signupResult: null,
  initialize: async () => {
    if (get().initializing) {
      return
    }

    if (DEV_LOGIN_BYPASS_ENABLED) {
      // - Role: Keep the login screen visible, but remove backend dependency in local development.
      // - Notes: Users still click Sign In, then the shell opens with a lightweight local session.
      set({
        initialized: true,
        initializing: false,
        bootstrapState: BYPASS_BOOTSTRAP_STATE,
        currentUser: null,
        authState: 'idle',
        initialAdminSetupState: 'alreadyInitialized',
        sessionExpired: false,
        networkState: 'online',
        authError: null,
      })
      return
    }

    set({
      initializing: true,
      authError: null,
    })

    try {
      const bootstrapState = await getBootstrapState()
      set({
        bootstrapState,
        initialAdminSetupState: bootstrapState.bootstrapRequired ? 'required' : 'alreadyInitialized',
      })
      const token = readSessionToken()

      // - Role: Restore a saved session only after bootstrap state is known.
      // - Notes: The login page and bootstrap page both depend on this ordering.
      if (!token) {
        set({
          initialized: true,
          initializing: false,
          currentUser: null,
          authState: 'idle',
          networkState: 'online',
        })
        return
      }

      const currentUser = await getCurrentUser()
      set({
        initialized: true,
        initializing: false,
        bootstrapState,
        initialAdminSetupState: bootstrapState.bootstrapRequired ? 'required' : 'alreadyInitialized',
        currentUser,
        authState: 'success',
        sessionExpired: false,
        networkState: 'online',
      })
    } catch (error) {
      clearSessionToken()
      set({
        initialized: true,
        initializing: false,
        currentUser: null,
        authState: isNetworkFailure(error) ? 'networkError' : 'idle',
        sessionExpired: error instanceof ApiClientError && error.status === 401,
        authError: toAuthErrorState(error),
        networkState: isNetworkFailure(error) ? 'offline' : 'online',
      })
    }
  },
  login: async (payload) => {
    set({
      authState: 'submitting',
      authError: null,
    })

    if (DEV_LOGIN_BYPASS_ENABLED) {
      set({
        currentUser: BYPASS_USER,
        authState: 'success',
        sessionExpired: false,
        networkState: 'online',
      })
      return
    }

    try {
      const response = await login(payload)
      // - Role: Persist the server-issued session before the shell starts requesting user data.
      writeSessionToken(response.sessionToken)
      set({
        currentUser: response.currentUser,
        authState: 'success',
        sessionExpired: false,
        networkState: 'online',
      })
    } catch (error) {
      set({
        authState: isNetworkFailure(error) ? 'networkError' : 'error',
        authError: toAuthErrorState(error),
        networkState: isNetworkFailure(error) ? 'offline' : 'online',
      })
      throw error
    }
  },
  signup: async (payload) => {
    set({
      signupState: 'submitting',
      authError: null,
      signupResult: null,
    })

    try {
      const result = await signup(payload)
      set({
        signupState: result.status === 'active' ? 'activated' : 'pendingApproval',
        signupResult: result,
      })
      return result
    } catch (error) {
      const apiError = error instanceof ApiClientError ? error : null
      set({
        signupState: apiError?.code === 'DUPLICATE_EMAIL' ? 'duplicateEmail' : 'error',
        authError: toAuthErrorState(error),
      })
      throw error
    }
  },
  bootstrapAdmin: async (payload) => {
    set({
      initialAdminSetupState: 'creating',
      authError: null,
    })

    try {
      const response = await bootstrapAdmin(payload)
      writeSessionToken(response.sessionToken)
      const bootstrapState = await getBootstrapState()
      set({
        bootstrapState,
        initialAdminSetupState: 'success',
        currentUser: response.currentUser,
        authState: 'success',
        sessionExpired: false,
      })
    } catch (error) {
      const apiError = error instanceof ApiClientError ? error : null
      set({
        initialAdminSetupState:
          apiError?.code === 'BOOTSTRAP_ALREADY_INITIALIZED' ? 'alreadyInitialized' : 'failed',
        authError: toAuthErrorState(error),
      })
      throw error
    }
  },
  logout: async () => {
    if (DEV_LOGIN_BYPASS_ENABLED) {
      set({
        currentUser: null,
        authState: 'idle',
        sessionExpired: false,
        signupState: 'idle',
        authError: null,
      })
      return
    }

    try {
      if (readSessionToken()) {
        await logout()
      }
    } catch {
      // - Notes: Local logout must still win even when the server session is already gone.
    } finally {
      clearSessionToken()
      set({
        currentUser: null,
        authState: 'idle',
        sessionExpired: false,
        signupState: 'idle',
        authError: null,
      })
    }
  },
  updateAccountSettings: async (payload) => {
    set({
      accountSettingsState: 'submitting',
      authError: null,
    })

    try {
      const currentUser = await updateAccountSettings(payload)
      set({
        currentUser,
        accountSettingsState: 'success',
      })
    } catch (error) {
      set({
        accountSettingsState: isNetworkFailure(error) ? 'networkError' : 'error',
        authError: toAuthErrorState(error),
      })
      throw error
    }
  },
  changePassword: async (payload) => {
    set({
      changePasswordState: 'submitting',
      authError: null,
    })

    try {
      await changePassword(payload)
      set({
        changePasswordState: 'success',
      })
    } catch (error) {
      set({
        changePasswordState: isNetworkFailure(error) ? 'networkError' : 'error',
        authError: toAuthErrorState(error),
      })
      throw error
    }
  },
  requestPasswordReset: async (payload) => {
    set({
      resetPasswordState: 'submitting',
      authError: null,
    })

    try {
      await requestPasswordReset(payload)
      set({
        resetPasswordState: 'success',
      })
    } catch (error) {
      set({
        resetPasswordState: isNetworkFailure(error) ? 'networkError' : 'error',
        authError: toAuthErrorState(error),
      })
      throw error
    }
  },
  clearAuthError: () => set({ authError: null }),
  clearSessionExpired: () => set({ sessionExpired: false, authState: 'idle' }),
  markSessionExpired: () => {
    if (DEV_LOGIN_BYPASS_ENABLED) {
      set({
        currentUser: null,
        sessionExpired: false,
        authState: 'idle',
      })
      return
    }

    clearSessionToken()
    set({
      currentUser: null,
      sessionExpired: true,
      authState: 'sessionExpired',
    })
  },
}))

setUnauthorizedHandler(() => {
  useAuthStore.getState().markSessionExpired()
})
