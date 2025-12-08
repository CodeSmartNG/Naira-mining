import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Go to Dashboard</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center"
          >
            Go Back
          </button>
        </div>
        
        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto">
          <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <a
            href="mailto:support@babban.com"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;