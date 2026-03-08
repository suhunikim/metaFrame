// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { ErrorInfo, PropsWithChildren } from 'react'
import { Component } from 'react'

import { BugOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import './ErrorBoundary.css'

interface PanelErrorBoundaryProps extends PropsWithChildren {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
}

interface PanelErrorBoundaryState {
  hasError: boolean
}

export class PanelErrorBoundary extends Component<
  PanelErrorBoundaryProps,
  PanelErrorBoundaryState
> {
  public override state: PanelErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): PanelErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PanelErrorBoundary caught a panel rendering error.', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
    this.props.onRetry?.()
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary error-boundary--panel" role="alert" aria-live="assertive">
          <div className="error-boundary__icon">
            <BugOutlined />
          </div>
          <h2 className="error-boundary__title">
            {this.props.title ?? 'This panel could not be rendered'}
          </h2>
          <p className="error-boundary__description">
            {this.props.description ??
              'The rest of the IDE is still available. Retry this panel after the state stabilizes.'}
          </p>
          <div className="error-boundary__actions">
            <Button icon={<ReloadOutlined />} onClick={this.handleRetry}>
              {this.props.retryLabel ?? 'Retry Panel'}
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
