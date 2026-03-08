// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import 'allotment/dist/style.css'

import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { AppRouter } from '@/app/router'

import { AppProviders } from '@/app/providers/AppProviders'

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppErrorBoundary>
  )
}
