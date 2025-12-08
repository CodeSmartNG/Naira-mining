import React, { useState, useEffect } from 'react';
import { Wrench, Clock, Mail, RefreshCw } from 'lucide-react';

const Maintenance = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-6">
            <Wrench size={48} className="text-primary-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          System Maintenance
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We're currently performing scheduled maintenance to improve your experience.
          The platform will be back online shortly.
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Estimated time remaining:
            </span>
          </div>
          
          <div className="flex justify-center space-x-4">
            <div className="bg-white p-4 rounded-lg shadow-sm min-w-20">
              <div className="text-3xl font-bold text-primary-600">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">Hours</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm min-w-20">
              <div className="text-3xl font-bold text-primary-600">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">Minutes</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm min-w-20">
              <div className="text-3xl font-bold text-primary-600">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">Seconds</div>
            </div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">Maintenance Updates</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Database Optimization</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Security Updates</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Performance Enhancements</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            <RefreshCw size={20} className="mr-2" />
            Refresh Page
          </button>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">Need immediate assistance?</p>
            <a
              href="mailto:support@babban.com"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <Mail size={16} className="mr-2" />
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Thank you for your patience. We're working hard to bring you a better experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;