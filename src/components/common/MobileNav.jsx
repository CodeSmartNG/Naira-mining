import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Cpu, 
  History, 
  User, 
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Cpu, label: 'Mining', path: '/mining' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (user?.isAdmin) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Admin', path: '/admin/dashboard' }
    );
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary-600 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="px-4 py-3">
          <div className="grid grid-cols-5 gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex flex-col items-center p-2 rounded-lg text-xs font-medium
                  ${isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon size={20} className="mb-1" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;