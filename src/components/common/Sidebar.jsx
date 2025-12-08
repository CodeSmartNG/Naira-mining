import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Cpu, 
  History, 
  User, 
  Shield,
  Settings,
  Users,
  BarChart3,
  CreditCard,
  FileText,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isAdmin }) => {
  const { logout } = useAuth();

  const userMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Cpu, label: 'Mining', path: '/mining' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Shield, label: 'KYC Verification', path: '/kyc' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: BarChart3, label: 'Payouts', path: '/admin/payouts' },
    { icon: FileText, label: 'KYC Reviews', path: '/admin/kyc' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems = isAdmin ? adminMenu : userMenu;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Home size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Babban</h1>
            <p className="text-xs text-gray-500">{isAdmin ? 'Admin Panel' : 'Mining Platform'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard' || item.path === '/admin/dashboard'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {isAdmin ? 'Administrator' : 'User Account'}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;