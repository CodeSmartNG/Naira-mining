import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, CreditCard, HelpCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Customize your Babban experience</p>
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
          {activeTab === 'general' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="label">Language</label>
                  <select className="input-field">
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>Arabic</option>
                  </select>
                </div>

                <div>
                  <label className="label">Time Zone</label>
                  <select className="input-field">
                    <option>Africa/Lagos (GMT+1)</option>
                    <option>UTC (GMT)</option>
                    <option>America/New_York (GMT-5)</option>
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

                <div>
                  <label className="label">Currency</label>
                  <select className="input-field">
                    <option>NGN - Nigerian Naira</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toast.success('Settings saved!')}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Help & Support</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <HelpCircle size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                      <p className="text-sm text-blue-700">
                        Our support team is available 24/7 to assist you with any questions or issues.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="/faq"
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <HelpCircle size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">FAQ</p>
                        <p className="text-sm text-gray-500">Frequently asked questions</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/contact"
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Contact Support</p>
                        <p className="text-sm text-gray-500">Get in touch with our team</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Documentation</h3>
                  <div className="space-y-2">
                    <a href="/guides/getting-started" className="flex items-center text-primary-600 hover:text-primary-700">
                      <Download size={16} className="mr-2" />
                      Getting Started Guide
                    </a>
                    <a href="/guides/mining" className="flex items-center text-primary-600 hover:text-primary-700">
                      <Download size={16} className="mr-2" />
                      Mining Guide
                    </a>
                    <a href="/guides/security" className="flex items-center text-primary-600 hover:text-primary-700">
                      <Download size={16} className="mr-2" />
                      Security Best Practices
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would have similar structure */}
          {activeTab !== 'general' && activeTab !== 'help' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                {tabs.find(t => t.id === activeTab)?.label} Settings
              </h2>
              <p className="text-gray-600">Settings for this section will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;