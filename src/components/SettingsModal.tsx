import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Bell, Moon, Sun, Database, Clock, Shield, Palette, User, Globe } from 'lucide-react';
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
      description: 'Theme and visual preferences',
      color: 'blue'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Alert and notification settings',
      color: 'green'
    },
    {
      id: 'backup',
      title: 'Backup & Storage',
      icon: Database,
      description: 'Data backup configuration',
      color: 'purple'
    },
    {
      id: 'system',
      title: 'System',
      icon: Clock,
      description: 'System-wide preferences',
      color: 'amber'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'SSL and security settings',
      color: 'red'
    }
  ];

  const [activeSection, setActiveSection] = useState('appearance');

  const getSectionColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 hover:bg-blue-50',
      green: isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-gray-700 hover:bg-emerald-50',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-700 hover:bg-purple-50',
      amber: isActive ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-gray-700 hover:bg-amber-50',
      red: isActive ? 'bg-red-50 text-red-700 border-red-200' : 'text-gray-700 hover:bg-red-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-105"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] border border-white/20">
            <div className="flex h-full max-h-[80vh]">
              {/* Sidebar */}
              <div className="w-80 bg-gradient-to-br from-gray-50 to-blue-50/30 border-r border-gray-200 p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Customize your experience</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl p-2 transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-start space-x-4 p-4 rounded-2xl text-left transition-all duration-200 border ${getSectionColorClasses(section.color, activeSection === section.id)}`}
                    >
                      <div className={`p-2 rounded-xl ${activeSection === section.id ? 'bg-white/80' : 'bg-gray-100'}`}>
                        <section.icon size={18} className="flex-shrink-0" />
                      </div>
                      <div>
                        <div className="font-semibold">{section.title}</div>
                        <div className="text-sm opacity-75 mt-1">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Appearance Settings */}
                {activeSection === 'appearance' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Theme Preferences</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className={`p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            localSettings.theme === 'light'
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-yellow-100 rounded-2xl">
                              <Sun size={24} className="text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Light Mode</h4>
                              <p className="text-sm text-gray-600 mt-1">Clean and bright interface</p>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          className={`p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            localSettings.theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-100 rounded-2xl">
                              <Moon size={24} className="text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Dark Mode</h4>
                              <p className="text-sm text-gray-600 mt-1">Easy on the eyes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === 'notifications' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-200">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Desktop Notifications</h4>
                            <p className="text-sm text-gray-600 mt-1">Get notified about site status changes</p>
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
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-200">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Email Notifications</h4>
                            <p className="text-sm text-gray-600 mt-1">Receive email alerts for critical events</p>
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
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {localSettings.notifications.email && (
                          <div className="ml-6 mt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
                            <input
                              type="email"
                              value={localSettings.notifications.emailAddress || ''}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                notifications: { ...localSettings.notifications, emailAddress: e.target.value }
                              })}
                              placeholder="your@email.com"
                              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup Settings */}
                {activeSection === 'backup' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Backup Configuration</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Backup Directory</label>
                          <input
                            type="text"
                            value={localSettings.backupPath}
                            onChange={(e) => setLocalSettings({ ...localSettings, backupPath: e.target.value })}
                            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Backup Schedule</label>
                          <select
                            value={localSettings.backupSchedule}
                            onChange={(e) => setLocalSettings({ ...localSettings, backupSchedule: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">System Preferences</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-200">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Auto-start with System</h4>
                            <p className="text-sm text-gray-600 mt-1">Launch the application when your computer starts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localSettings.autoStart}
                              onChange={(e) => setLocalSettings({ ...localSettings, autoStart: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Default Port</label>
                          <input
                            type="number"
                            value={localSettings.defaultPort}
                            onChange={(e) => setLocalSettings({ ...localSettings, defaultPort: parseInt(e.target.value) })}
                            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">SSL Configuration</h3>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Default SSL Provider</label>
                        <select
                          value={localSettings.sslProvider}
                          onChange={(e) => setLocalSettings({ ...localSettings, sslProvider: e.target.value as 'letsencrypt' | 'custom' })}
                          className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        >
                          <option value="letsencrypt">Let's Encrypt (Automatic)</option>
                          <option value="custom">Custom Certificates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-2xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold"
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