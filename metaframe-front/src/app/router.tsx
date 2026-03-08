// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ReactElement } from 'react'
import { useEffect } from 'react'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { LoadingOverlay } from '@/components/common/LoadingOverlay'
import { useAuthStore } from '@/store'
import AccountSettingsPage from '@/pages/AccountSettingsPage'
import IdeWorkspacePage from '@/pages/IdeWorkspacePage'
import InitialAdminSetupPage from '@/pages/InitialAdminSetupPage'
import LoginPage from '@/pages/LoginPage'
import ProjectsHomePage from '@/pages/ProjectsHomePage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import SignupPage from '@/pages/SignupPage'

function HomeRedirect() {
  const bootstrapState = useAuthStore((state) => state.bootstrapState)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (bootstrapState?.bootstrapRequired && !currentUser) {
    return <Navigate to="/setup/admin" replace />
  }

  if (currentUser) {
    return <Navigate to="/projects" replace />
  }

  return <Navigate to="/login" replace />
}

function PublicAuthRoute({ children }: { children: ReactElement }) {
  const bootstrapState = useAuthStore((state) => state.bootstrapState)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (bootstrapState?.bootstrapRequired) {
    return <Navigate to="/setup/admin" replace />
  }

  if (currentUser) {
    return <Navigate to="/projects" replace />
  }

  return children
}

function SetupRoute({ children }: { children: ReactElement }) {
  const bootstrapState = useAuthStore((state) => state.bootstrapState)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (currentUser) {
    return <Navigate to="/projects" replace />
  }

  if (bootstrapState && !bootstrapState.bootstrapRequired) {
    return <Navigate to="/login" replace />
  }

  return children
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const bootstrapState = useAuthStore((state) => state.bootstrapState)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (bootstrapState?.bootstrapRequired && !currentUser) {
    return <Navigate to="/setup/admin" replace />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RouterContent() {
  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)
  const initializing = useAuthStore((state) => state.initializing)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (!initialized || initializing) {
    return <LoadingOverlay label="Loading application..." />
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <LoginPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <SignupPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicAuthRoute>
            <ResetPasswordPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/setup/admin"
        element={
          <SetupRoute>
            <InitialAdminSetupPage />
          </SetupRoute>
        }
      />
      <Route
        path="/account/settings"
        element={
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/ide"
        element={
          <ProtectedRoute>
            <IdeWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  )
}
