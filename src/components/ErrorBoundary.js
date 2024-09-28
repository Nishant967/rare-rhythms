import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors in its child component tree.
 */
class ErrorBoundary extends React.Component {
  /**
   * Creates an instance of ErrorBoundary.
   * @param {Object} props - The component props.
   */
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred
    this.state = { hasError: false };
  }

  /**
   * Updates state when an error is caught.
   * @param {Error} error - The error that was thrown.
   * @returns {Object} - The new state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true }; // Set hasError to true
  }

  /**
   * Logs error information.
   * @param {Error} error - The error that was thrown.
   * @param {Object} errorInfo - Information about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  /**
   * Renders the fallback UI if an error has occurred.
   * @returns {JSX.Element} - The rendered output.
   */
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>; // Fallback UI
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary; // Export the ErrorBoundary component