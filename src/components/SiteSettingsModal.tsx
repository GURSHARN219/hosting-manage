import React, { useState } from 'react';
import { X, Globe, Server, Database, Shield, Network, Cpu, HardDrive, Activity, Settings2, ChevronRight } from 'lucide-react';

interface SiteSettingsModalProps {
  site: Site;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Site>) => void;
}

export const SiteSettingsModal: React.FC<SiteSettingsModalProps> = ({ site, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('server');
  const [name, setName] = useState(site.name);
  const [port, setPort] = useState(site.port);
  const [homePage, setHomePage] = useState(site.homePage);
  const [serverFile, setServerFile] = useState(site.serverFile || '');
  const [serverType, setServerType] = useState(site.type);
  const [customDomain, setCustomDomain] = useState(site.domain.custom);
  const [domainName, setDomainName] = useState(site.domain.name);
  const [sslEnabled, setSslEnabled] = useState(site.ssl.enabled);
  const [sslType, setSslType] = useState(site.ssl.type);
  const [databaseType, setDatabaseType] = useState('none');
  const [publicIP, setPublicIP] = useState('Loading...');
  const [privateIP, setPrivateIP] = useState('192.168.1.1');

  React.useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setPublicIP(data.ip))
      .catch(() => setPublicIP('Failed to load'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(site.id, {
      name,
      port,
      type: serverType,
      homePage,
      serverFile,
      domain: {
        custom: customDomain,
        name: domainName,
      },
      ssl: {
        enabled: sslEnabled,
        type: sslType,
      },
    });
    onClose();
  };

  const tabs = [
    { id: 'server', label: 'Server', icon: Server },
    { id: 'domain', label: 'Domain & SSL', icon: Globe },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Activity },
  ];

  const serverTypes = [
    { value: 'node', label: 'Node.js', description: 'JavaScript runtime environment' },
    { value: 'static', label: 'Static', description: 'Simple static file serving' },
    { value: 'php', label: 'PHP', description: 'PHP web server' },
    { value: 'python', label: 'Python', description: 'Python web server' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4">
        <div className="flex h-[calc(100vh-8rem)] max-h-[800px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} className="mr-3" />
                  {tab.label}
                  <ChevronRight size={16} className="ml-auto" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Server Settings */}
              {activeTab === 'server' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Server Configuration</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Server Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          {serverTypes.map((type) => (
                            <div
                              key={type.value}
                              className={`relative rounded-lg border p-4 cursor-pointer ${
                                serverType === type.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setServerType(type.value as Site['type'])}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{type.label}</h4>
                                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    serverType === type.value
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Site Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Port</label>
                          <input
                            type="number"
                            value={port}
                            onChange={(e) => setPort(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Home Page</label>
                          <input
                            type="text"
                            value={homePage}
                            onChange={(e) => setHomePage(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Server File</label>
                          <input
                            type="text"
                            value={serverFile}
                            onChange={(e) => setServerFile(e.target.value)}
                            placeholder="e.g., server.js"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Domain & SSL Settings */}
              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Domain Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="customDomain"
                          checked={customDomain}
                          onChange={(e) => setCustomDomain(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="customDomain" className="text-sm font-medium text-gray-700">
                          Use Custom Domain
                        </label>
                      </div>
                      {customDomain && (
                        <input
                          type="text"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          placeholder="example.com"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">SSL Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="ssl"
                          checked={sslEnabled}
                          onChange={(e) => setSslEnabled(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="ssl" className="text-sm font-medium text-gray-700">
                          Enable SSL
                        </label>
                      </div>
                      {sslEnabled && (
                        <select
                          value={sslType}
                          onChange={(e) => setSslType(e.target.value as 'letsencrypt' | 'custom')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="letsencrypt">Let's Encrypt (Automatic)</option>
                          <option value="custom">Custom Certificate</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Database Settings */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Database Configuration</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Database Type</label>
                        <select
                          value={databaseType}
                          onChange={(e) => setDatabaseType(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="none">No Database</option>
                          <option value="mysql">MySQL</option>
                          <option value="postgresql">PostgreSQL</option>
                          <option value="mongodb">MongoDB</option>
                          <option value="sqlite">SQLite</option>
                        </select>
                      </div>
                      {databaseType !== 'none' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Database Name</label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Database User</label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Network Settings */}
              {activeTab === 'network' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Network Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Public IP</label>
                        <input
                          type="text"
                          value={publicIP}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Private IP</label>
                        <input
                          type="text"
                          value={privateIP}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};