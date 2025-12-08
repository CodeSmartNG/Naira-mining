import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isAdmin = user?.isAdmin;
  const hideSidebarPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  if (shouldHideSidebar) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar isAdmin={isAdmin} />
        </div>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        )}
        
        {/* Mobile sidebar */}
        <div className={`
          md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar isAdmin={isAdmin} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;