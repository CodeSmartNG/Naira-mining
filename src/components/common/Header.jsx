import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, Wallet, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { formatCurrency } from '../../utils/formatters';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { balance, isLoading } = useWallet();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo and Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 mr-2"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to={user?.isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">Babban</span>
            </Link>
          </div>

          {/* Center: Wallet Balance (Desktop only) */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
            <Wallet size={20} className="text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Balance:</span>
            <span className="font-bold text-primary-700">
              {isLoading ? '...' : formatCurrency(balance?.available || 0)}
            </span>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* KYC Badge */}
            {user?.kycStatus === 'unverified' && (
              <Link
                to="/kyc"
                className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium hover:bg-yellow-200"
              >
                <Shield size={14} className="mr-1" />
                Verify KYC
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {user?.firstName ? (
                    <span className="text-primary-600 font-medium">
                      {user.firstName.charAt(0)}
                    </span>
                  ) : (
                    <User size={16} className="text-primary-600" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <span className="block font-medium text-gray-700 text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {user?.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="mr-3" />
                      Profile Settings
                    </Link>
                    <Link
                      to="/wallet"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Wallet size={16} className="mr-3" />
                      Wallet
                    </Link>
                    {user?.kycStatus === 'unverified' && (
                      <Link
                        to="/kyc"
                        className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield size={16} className="mr-3" />
                        Complete KYC
                      </Link>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;