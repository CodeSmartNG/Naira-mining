import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary();
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
    window.location.reload(); // Full reset
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">We apologize for the inconvenience. The application has encountered an error.</p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium text-red-800 mb-1">Error details:</p>
          <p className="text-sm text-red-600 truncate">{error.message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;