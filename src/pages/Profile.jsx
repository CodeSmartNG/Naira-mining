import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Globe, Save, X, Check, Camera } from 'lucide-react';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailDeposits: true,
    emailWithdrawals: true,
    emailRewards: true,
    smsTransactions: false,
    marketingEmails: true,
    securityAlerts: true
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const response = await authApi.updateProfile(profileForm);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setSaving(true);
      await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* KYC Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="px-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">KYC Status</span>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${user?.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        user?.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {user?.kycStatus || 'Unverified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Account Type</span>
                    <span className="text-sm font-medium">
                      {user?.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
              
              {/* Profile Photo */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                    {user?.firstName ? (
                      <span className="text-3xl font-bold text-primary-600">
                        {user.firstName.charAt(0)}
                      </span>
                    ) : (
                      <User size={40} className="text-primary-600" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Click camera icon to update photo</p>
                </div>
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="label">
                      First Name *
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="pl-10 input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="label">
                      Last Name *
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="pl-10 input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email Address *
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="pl-10 input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="label">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="pl-10 input-field"
                        placeholder="08012345678"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X size={20} />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSave}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="label">
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={20} className="text-gray-400" />
                        </div>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          required
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="label">
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={20} className="text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 input-field"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="label">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={20} className="text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 input-field"
                        />
                      </div>
                      {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn-primary flex items-center space-x-2"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              <span>Update Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <button className="btn-secondary">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Session Management</p>
                      <p className="text-sm text-gray-500">View and manage active sessions</p>
                    </div>
                    <button className="btn-secondary">
                      View Sessions
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Login History</p>
                      <p className="text-sm text-gray-500">Review recent account activity</p>
                    </div>
                    <button className="btn-secondary">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications)
                      .filter(([key]) => key.startsWith('email'))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {key.replace('email', '').replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Receive email notifications for {key.replace('email', '').toLowerCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(key)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full
                              ${value ? 'bg-primary-600' : 'bg-gray-200'}
                            `}
                          >
                            <span className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition
                              ${value ? 'translate-x-6' : 'translate-x-1'}
                            `} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications)
                      .filter(([key]) => key.startsWith('sms'))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {key.replace('sms', '').replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Receive SMS notifications for {key.replace('sms', '').toLowerCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(key)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full
                              ${value ? 'bg-primary-600' : 'bg-gray-200'}
                            `}
                          >
                            <span className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition
                              ${value ? 'translate-x-6' : 'translate-x-1'}
                            `} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toast.success('Notification preferences saved!')}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save size={20} />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Display Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="label mb-3">Currency Display</label>
                    <select className="input-field">
                      <option>NGN - Nigerian Naira (₦)</option>
                      <option>USD - US Dollar ($)</option>
                      <option>EUR - Euro (€)</option>
                      <option>GBP - British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label mb-3">Date Format</label>
                    <select className="input-field">
                      <option>DD/MM/YYYY (UK/International)</option>
                      <option>MM/DD/YYYY (US)</option>
                      <option>YYYY-MM-DD (ISO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label mb-3">Time Zone</label>
                    <select className="input-field">
                      <option>Africa/Lagos (GMT+1)</option>
                      <option>UTC (GMT)</option>
                      <option>America/New_York (GMT-5)</option>
                      <option>Europe/London (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-500">Allow others to see your profile</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Activity Status</p>
                      <p className="text-sm text-gray-500">Show when you're online</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Data Sharing</p>
                      <p className="text-sm text-gray-500">Allow data for analytics (anonymous)</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card border border-red-200 bg-red-50">
                <h2 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                      Delete Account
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Export Data</p>
                      <p className="text-sm text-red-700">
                        Download all your personal data
                      </p>
                    </div>
                    <button className="btn-secondary">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;