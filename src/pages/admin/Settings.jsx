import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Globe, 
  CreditCard, 
  Bell, 
  Users, 
  Save, 
  Database,
  Server,
  Mail,
  Lock,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // General Settings
    platformName: 'Babban Mining',
    platformCurrency: 'NGN',
    timezone: 'Africa/Lagos',
    maintenanceMode: false,
    
    // Payment Settings
    minDeposit: 100,
    maxDeposit: 1000000,
    minWithdrawal: 1000,
    maxWithdrawal: 500000,
    withdrawalFee: 50,
    
    // Mining Settings
    minMiningAmount: 1000,
    maxMiningAmount: 1000000,
    miningRates: [
      { days: 30, rate: 5 },
      { days: 60, rate: 10 },
      { days: 90, rate: 15 }
    ],
    
    // Email Settings
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@babban.com',
    
    // Security Settings
    enable2FA: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: '',
    
    // API Settings
    enableApi: true,
    apiRateLimit: 100,
    apiKey: 'sk_live_***hidden***',
    webhookUrl: 'https://api.babban.com/webhook'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'mining', label: 'Mining', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API', icon: Server },
    { id: 'users', label: 'User Settings', icon: Users },
    { id: 'system', label: 'System', icon: Database }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMiningRateChange = (index, field, value) => {
    const newRates = [...formData.miningRates];
    newRates[index] = { ...newRates[index], [field]: parseFloat(value) };
    setFormData(prev => ({ ...prev, miningRates: newRates }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Test email sent successfully!');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const handleRegenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2)}`;
    setFormData(prev => ({ ...prev, apiKey: newKey }));
    toast.success('API key regenerated!');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `babban-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Settings exported!');
  };

  const handleBackupDatabase = () => {
    toast.success('Database backup initiated. You will receive an email when complete.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportSettings}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={handleSave}
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Platform Name</label>
                    <input
                      type="text"
                      name="platformName"
                      value={formData.platformName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Default Currency</label>
                    <select
                      name="platformCurrency"
                      value={formData.platformCurrency}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New York (GMT-5)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Date Format</label>
                    <select className="input-field">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={formData.maintenanceMode}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Important</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Changes to these settings affect all users. Please review carefully before saving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Minimum Deposit (₦)</label>
                    <input
                      type="number"
                      name="minDeposit"
                      value={formData.minDeposit}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Maximum Deposit (₦)</label>
                    <input
                      type="number"
                      name="maxDeposit"
                      value={formData.maxDeposit}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Minimum Withdrawal (₦)</label>
                    <input
                      type="number"
                      name="minWithdrawal"
                      value={formData.minWithdrawal}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Maximum Withdrawal (₦)</label>
                    <input
                      type="number"
                      name="maxWithdrawal"
                      value={formData.maxWithdrawal}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label">Withdrawal Fee (₦)</label>
                  <input
                    type="number"
                    name="withdrawalFee"
                    value={formData.withdrawalFee}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Fixed fee charged for each withdrawal</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Paystack Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Public Key</span>
                        <span className="text-sm font-mono">pk_live_***</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Secret Key</span>
                        <span className="text-sm font-mono">sk_live_***</span>
                      </div>
                      <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Configure Paystack
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Monnify Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">API Key</span>
                        <span className="text-sm font-mono">MK_***</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Secret Key</span>
                        <span className="text-sm font-mono">SK_***</span>
                      </div>
                      <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Configure Monnify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mining Settings */}
          {activeTab === 'mining' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Mining Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Minimum Mining Amount (₦)</label>
                    <input
                      type="number"
                      name="minMiningAmount"
                      value={formData.minMiningAmount}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Maximum Mining Amount (₦)</label>
                    <input
                      type="number"
                      name="maxMiningAmount"
                      value={formData.maxMiningAmount}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Mining Rates</h3>
                  <div className="space-y-4">
                    {formData.miningRates.map((rate, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
                          <input
                            type="number"
                            value={rate.days}
                            onChange={(e) => handleMiningRateChange(index, 'days', e.target.value)}
                            className="input-field mt-1"
                            min="1"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                          <input
                            type="number"
                            value={rate.rate}
                            onChange={(e) => handleMiningRateChange(index, 'rate', e.target.value)}
                            className="input-field mt-1"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newRates = formData.miningRates.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, miningRates: newRates }));
                          }}
                          className="mt-6 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          miningRates: [...prev.miningRates, { days: 30, rate: 5 }]
                        }));
                      }}
                      className="btn-secondary w-full"
                    >
                      Add New Rate
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Rate Changes</p>
                      <p className="text-sm text-yellow-800 mt-1">
                        Changing mining rates only affects new mining locks. Existing locks will continue with their original rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Email Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">SMTP Host</label>
                    <input
                      type="text"
                      name="smtpHost"
                      value={formData.smtpHost}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">SMTP Port</label>
                    <input
                      type="number"
                      name="smtpPort"
                      value={formData.smtpPort}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">SMTP Username</label>
                    <input
                      type="text"
                      name="smtpUser"
                      value={formData.smtpUser}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">SMTP Password</label>
                    <input
                      type="password"
                      name="smtpPass"
                      value={formData.smtpPass}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label">From Email Address</label>
                  <input
                    type="email"
                    name="fromEmail"
                    value={formData.fromEmail}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Email Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="btn-secondary">Welcome Email</button>
                    <button className="btn-secondary">Deposit Confirmation</button>
                    <button className="btn-secondary">Withdrawal Notification</button>
                    <button className="btn-secondary">Password Reset</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Test Email Configuration</p>
                    <p className="text-sm text-gray-500">Send a test email to verify your settings</p>
                  </div>
                  <button
                    onClick={handleTestEmail}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Mail size={20} />
                    <span>Send Test Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Require 2FA for admin access</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enable2FA"
                      checked={formData.enable2FA}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={formData.sessionTimeout}
                    onChange={handleInputChange}
                    className="input-field"
                    min="5"
                    max="1440"
                  />
                </div>
                
                <div>
                  <label className="label">Max Login Attempts</label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    value={formData.maxLoginAttempts}
                    onChange={handleInputChange}
                    className="input-field"
                    min="1"
                    max="20"
                  />
                  <p className="text-sm text-gray-500 mt-1">After this many failed attempts, account will be locked</p>
                </div>
                
                <div>
                  <label className="label">IP Whitelist</label>
                  <textarea
                    name="ipWhitelist"
                    value={formData.ipWhitelist}
                    onChange={handleInputChange}
                    className="input-field h-32"
                    placeholder="Enter IP addresses, one per line"
                  />
                  <p className="text-sm text-gray-500 mt-1">Only these IPs will be allowed to access admin panel</p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Security Audit Log</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-red-800">Last security scan:</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-800">Failed login attempts:</span>
                          <span className="font-medium">12 (today)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-800">Suspicious activities:</span>
                          <span className="font-medium">3</span>
                        </div>
                      </div>
                      <button className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium">
                        View Security Log
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">API Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Enable API</p>
                    <p className="text-sm text-gray-500">Allow external systems to connect via API</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enableApi"
                      checked={formData.enableApi}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="label">API Rate Limit (requests per minute)</label>
                  <input
                    type="number"
                    name="apiRateLimit"
                    value={formData.apiRateLimit}
                    onChange={handleInputChange}
                    className="input-field"
                    min="1"
                    max="1000"
                  />
                </div>
                
                <div>
                  <label className="label">Webhook URL</label>
                  <input
                    type="url"
                    name="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">URL to send payment notifications</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">API Key</p>
                      <p className="text-sm text-gray-500">Secret key for API authentication</p>
                    </div>
                    <button
                      onClick={handleRegenerateApiKey}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <RefreshCw size={16} />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <div className="p-3 bg-gray-100 rounded">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {formData.apiKey}
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep this key secret. It provides full access to your API.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="btn-secondary">API Documentation</button>
                  <button className="btn-secondary">View API Logs</button>
                </div>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">User Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Default User Role</label>
                    <select className="input-field">
                      <option>User</option>
                      <option>Premium User</option>
                      <option>VIP</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Signup Bonus (₦)</label>
                    <input
                      type="number"
                      className="input-field"
                      defaultValue="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require KYC for Withdrawals</p>
                      <p className="text-sm text-gray-500">Users must complete KYC before withdrawing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Allow Multiple Accounts</p>
                      <p className="text-sm text-gray-500">Allow users to create multiple accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Auto-approve KYC</p>
                      <p className="text-sm text-gray-500">Automatically approve KYC submissions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="label">Welcome Message</label>
                  <textarea
                    className="input-field h-32"
                    placeholder="Welcome message for new users..."
                    defaultValue="Welcome to Babban Mining! We're excited to have you join our platform. Start by making your first deposit to begin earning rewards."
                  />
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">System Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Version</span>
                        <span className="font-medium">v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium">2024-01-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database Size</span>
                        <span className="font-medium">245 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Users</span>
                        <span className="font-medium">1,245</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Server Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">API Server</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Database</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Healthy
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Redis Cache</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Connected
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Gateway</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={handleBackupDatabase}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Backup Database</p>
                        <p className="text-sm text-gray-500">Create a full database backup</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Server size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Clear Cache</p>
                        <p className="text-sm text-gray-500">Clear all system cache</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-3">Danger Zone</h3>
                  <p className="text-sm text-red-800 mb-4">
                    These actions are irreversible. Proceed with extreme caution.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                      Reset All Settings
                    </button>
                    <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                      Purge All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Save Settings</p>
                <p className="text-sm text-gray-500">Apply changes to the platform</p>
              </div>
              <div className="flex space-x-3">
                <button className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
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
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;