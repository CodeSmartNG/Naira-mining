import React, { useState, useEffect } from 'react';

const SimpleToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Global toast function
    window.showToast = (message, type = 'info') => {
      const id = Date.now();
      const newToast = { id, message, type, visible: true };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 4000);
    };

    // Success shortcut
    window.toastSuccess = (message) => window.showToast(message, 'success');
    
    // Error shortcut
    window.toastError = (message) => window.showToast(message, 'error');
    
    // Info shortcut
    window.toastInfo = (message) => window.showToast(message, 'info');
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getTypeStyles(toast.type)}
            border rounded-lg shadow-lg px-4 py-3 max-w-sm 
            transform transition-all duration-300
            ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {toast.type === 'success' && (
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleToast;