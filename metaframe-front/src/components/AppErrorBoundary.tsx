// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react'
import { Component } from 'react'

import { BugOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import './ErrorBoundary.css'

interface AppErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public override state: AppErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an application error.', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.assign('/')
  }

  public override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-boundary" role="alert" aria-live="assertive">
            <div className="error-boundary__icon">
              <BugOutlined />
            </div>
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__description">
              MetaFrame protected the current session from a full white screen. You can reload
              the application or move back to the home entry point.
            </p>
            <div className="error-boundary__actions">
              <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
                Go Home
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
