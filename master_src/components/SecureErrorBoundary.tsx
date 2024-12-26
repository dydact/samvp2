import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class SecureErrorBoundary extends Component<Props, State> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error without exposing sensitive data
    console.error('Secure operation failed');
    
    // You could send sanitized error info to your error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h3>Something went wrong</h3>
          <p>Please try again or contact support if the problem persists.</p>
        </div>
      );
    }
    
    return this.props.children;
  }
} 