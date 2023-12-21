import React from "react"

type ErrorBoundaryProps = {
  fallback: React.ReactNode
  children: React.ReactNode
}

/* Class component is not great, but React still recommends doing it this way
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends React.Component {
  public state = { hasError: false }
  public props: ErrorBoundaryProps

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.props = props
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
