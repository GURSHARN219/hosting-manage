import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Bell, Moon, Sun, Database, Clock, Shield } from 'lucide-react';
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

  const sections = [
    { id: 'appearance', title: 'Theme', icon: Sun },
    { id: 'notifications', title: 'Alerts', icon: Bell },
    { id: 'backup', title: 'Backup', icon: Database },
    { id: 'system', title: 'System', icon: Clock },
    { id: 'security', title: 'Security', icon: Shield }
  ];

  const [activeSection, setActiveSection] = useState('appearance');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-xl transition-all duration-200"
      >
        <SettingsIcon size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-2xl border border-white/20 max-h-[80vh] overflow-hidden">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-32 border-r border-white/10 p-3">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-white/90">Settings</h2>
                </div>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex flex-col items-center p-2 rounded-xl text-xs transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-400/20 text-white border border-blue-400/30'
                          : 'text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <section.icon size={16} className="mb-1" />
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white/90">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-white/60 hover:text-white/90 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Theme Settings */}
                {activeSection === 'appearance' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          localSettings.theme === 'light'
                            ? 'border-blue-400 bg-blue-400/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Sun size={16} className="text-yellow-400" />
                          <span className="text-sm text-white/80">Light</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          localSettings.theme === 'dark'
                            ? 'border-blue-400 bg-blue-400/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Moon size={16} className="text-blue-400" />
                          <span className="text-sm text-white/80">Dark</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === 'notifications' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-white/80">Desktop</span>
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
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-white/80">Email</span>
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
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Other sections with minimal content */}
                {activeSection === 'backup' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={localSettings.backupPath}
                      onChange={(e) => setLocalSettings({ ...localSettings, backupPath: e.target.value })}
                      placeholder="Backup path"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    />
                  </div>
                )}

                {activeSection === 'system' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-white/80">Auto-start</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.autoStart}
                          onChange={(e) => setLocalSettings({ ...localSettings, autoStart: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-3">
                    <select
                      value={localSettings.sslProvider}
                      onChange={(e) => setLocalSettings({ ...localSettings, sslProvider: e.target.value as 'letsencrypt' | 'custom' })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                    >
                      <option value="letsencrypt">Let's Encrypt</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-white/70 hover:text-white/90 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};