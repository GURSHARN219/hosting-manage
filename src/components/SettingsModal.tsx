import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Bell, Moon, Sun, Database, Clock, Shield, Palette } from 'lucide-react';
import { AppSettings } from '../types';
import { useSiteStore } from '../store/siteStore';

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings } = useSiteStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
  };

  const settingSections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage notification preferences'
    },
    {
      id: 'backup',
      title: 'Backup & Storage',
      icon: Database,
      description: 'Configure backup settings'
    },
    {
      id: 'system',
      title: 'System',
      icon: Clock,
      description: 'System-wide preferences'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'SSL and security settings'
    }
  ];

  const [activeSection, setActiveSection] = useState('appearance');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex h-full max-h-[80vh]">
              {/* Sidebar */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-start space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <section.icon size={20} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm opacity-75">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Appearance Settings */}
                {activeSection === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Preferences</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            localSettings.theme === 'light'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Sun size={20} className="text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Light Mode</h4>
                              <p className="text-sm text-gray-500">Clean and bright interface</p>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            localSettings.theme === 'dark'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Moon size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Dark Mode</h4>
                              <p className="text-sm text-gray-500">Easy on the eyes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Desktop Notifications</h4>
                            <p className="text-sm text-gray-500">Get notified about site status changes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localSettings.notifications.desktop}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                notifications: { ...localSettings.notifications, desktop: e.target.checked }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive email alerts for critical events</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localSettings.notifications.email}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                notifications: { ...localSettings.notifications, email: e.target.checked }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {localSettings.notifications.email && (
                          <div className="ml-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={localSettings.notifications.emailAddress || ''}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                notifications: { ...localSettings.notifications, emailAddress: e.target.value }
                              })}
                              placeholder="your@email.com"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup Settings */}
                {activeSection === 'backup' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Directory</label>
                          <input
                            type="text"
                            value={localSettings.backupPath}
                            onChange={(e) => setLocalSettings({ ...localSettings, backupPath: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Schedule</label>
                          <select
                            value={localSettings.backupSchedule}
                            onChange={(e) => setLocalSettings({ ...localSettings, backupSchedule: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeSection === 'system' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-start with System</h4>
                            <p className="text-sm text-gray-500">Launch the application when your computer starts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localSettings.autoStart}
                              onChange={(e) => setLocalSettings({ ...localSettings, autoStart: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Port</label>
                          <input
                            type="number"
                            value={localSettings.defaultPort}
                            onChange={(e) => setLocalSettings({ ...localSettings, defaultPort: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">SSL Configuration</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default SSL Provider</label>
                        <select
                          value={localSettings.sslProvider}
                          onChange={(e) => setLocalSettings({ ...localSettings, sslProvider: e.target.value as 'letsencrypt' | 'custom' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="letsencrypt">Let's Encrypt (Automatic)</option>
                          <option value="custom">Custom Certificates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 mt-8 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};