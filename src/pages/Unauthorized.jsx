import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
            <Shield size={40} className="text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Home size={20} />
            <span>Go to Dashboard</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">Need Access?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you believe you should have access to this page, please contact your administrator.
          </p>
          <div className="space-y-2 text-sm">
            <a
              href="mailto:admin@babban.com"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Administrator →
            </a>
            <a
              href="mailto:support@babban.com"
              className="block text-gray-600 hover:text-gray-700"
            >
              Technical Support →
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Unauthorized access attempts are logged for security purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;