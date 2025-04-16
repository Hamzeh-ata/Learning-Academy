import React from 'react';
import Lottie from 'lottie-react';
import animateFailure from '@assets/lottie/animate-error';

import './error-boundary.css';
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <Lottie className="h-40" loop animationData={animateFailure} />
          <h1>Oops! Something went wrong.</h1>
          <p>The page encountered an unexpected issue.</p>
          <p className="error-message">{this.state.error}</p>

          <button onClick={this.handleReload} className="reload-button">
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
