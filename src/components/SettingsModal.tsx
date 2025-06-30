import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Mail, Bell, Moon, Sun, Database, Clock } from 'lucide-react';
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Sun size={20} className="mr-2" />
                  Appearance
                </h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={localSettings.theme}
                    onChange={(e) => setLocalSettings({ ...localSettings, theme: e.target.value as 'light' | 'dark' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Bell size={20} className="mr-2" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="desktopNotifications"
                      checked={localSettings.notifications.desktop}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: { ...localSettings.notifications, desktop: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="desktopNotifications" className="text-sm font-medium text-gray-700">
                      Desktop Notifications
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={localSettings.notifications.email}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: { ...localSettings.notifications, email: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                  </div>

                  {localSettings.notifications.email && (
                    <div>
                      <input
                        type="email"
                        value={localSettings.notifications.emailAddress || ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          notifications: { ...localSettings.notifications, emailAddress: e.target.value }
                        })}
                        placeholder="Email address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Backup Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Database size={20} className="mr-2" />
                  Backup
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Backup Path</label>
                    <input
                      type="text"
                      value={localSettings.backupPath}
                      onChange={(e) => setLocalSettings({ ...localSettings, backupPath: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Backup Schedule</label>
                    <select
                      value={localSettings.backupSchedule}
                      onChange={(e) => setLocalSettings({ ...localSettings, backupSchedule: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock size={20} className="mr-2" />
                  System
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="autoStart"
                      checked={localSettings.autoStart}
                      onChange={(e) => setLocalSettings({ ...localSettings, autoStart: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoStart" className="text-sm font-medium text-gray-700">
                      Start with system
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Port</label>
                    <input
                      type="number"
                      value={localSettings.defaultPort}
                      onChange={(e) => setLocalSettings({ ...localSettings, defaultPort: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">SSL Provider</label>
                    <select
                      value={localSettings.sslProvider}
                      onChange={(e) => setLocalSettings({ ...localSettings, sslProvider: e.target.value as 'letsencrypt' | 'custom' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="letsencrypt">Let's Encrypt</option>
                      <option value="custom">Custom Certificates</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};