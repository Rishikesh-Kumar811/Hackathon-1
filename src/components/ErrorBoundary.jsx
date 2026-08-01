import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);


    const isChunkLoadError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Cannot convert object to primitive value');

    if (isChunkLoadError) {
      const hasRefreshed = sessionStorage.getItem('chunk-load-refreshed');
      if (!hasRefreshed) {
        sessionStorage.setItem('chunk-load-refreshed', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {

      return (
        <div className="flex flex-col items-center justify-center p-8 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Oops! Something went wrong loading a module.</h2>
          <p className="text-sm text-red-500/80 dark:text-red-300/80 mb-6">
            This usually happens when the app is updated in the background.
          </p>
          <button 
            onClick={() => {
              sessionStorage.removeItem('chunk-load-refreshed');
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
