import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SimpleToast from './components/common/SimpleToast'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import MobileNav from './components/common/MobileNav';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Pages
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Mining from './pages/Mining';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import KycVerification from './pages/KycVerification';
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTransactions from './pages/admin/Transactions';
import AdminPayouts from './pages/admin/Payouts';
import AdminKyc from './pages/admin/Kyc';
import AdminSettings from './pages/admin/Settings';

// Error Pages
import NotFound from './pages/404';
import Maintenance from './pages/Maintenance';
import Unauthorized from './pages/Unauthorized';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Babban...</p>
    </div>
  </div>
);

// Main App Component
function AppContent() {
  const { isLoading, user } = useAuth();
  const location = useLocation();
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Check maintenance mode (could be from API or env variable)
  useEffect(() => {
    const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
    setIsMaintenance(maintenanceMode);
  }, []);

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show maintenance page if in maintenance mode
  if (isMaintenance && !location.pathname.includes('/maintenance')) {
    return <Maintenance />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#059669',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected User Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="mining" element={<Mining />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="kyc" element={<KycVerification />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="kyc" element={<AdminKyc />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Redirect from old routes */}
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/account" element={<Navigate to="/profile" replace />} />

        {/* Error Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Mobile Navigation (only for authenticated users) */}
      {user && <MobileNav />}
    </>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;