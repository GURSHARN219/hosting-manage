import React from 'react';
import { useSiteStore } from './store/siteStore';
import { SiteCard } from './components/SiteCard';
import { AddSiteModal } from './components/AddSiteModal';
import { SettingsModal } from './components/SettingsModal';
import { Layout, Plus, Server, Globe, Activity } from 'lucide-react';
import { Site } from './types';

function App() {
  const { sites, addSite, removeSite, updateSite } = useSiteStore();

  const handleAddSite = (siteData: Omit<Site, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newSite = {
      ...siteData,
      id: crypto.randomUUID(),
      status: 'stopped' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSite(newSite);
  };

  const handleToggle = (id: string) => {
    const site = sites.find(s => s.id === id);
    if (site) {
      updateSite(id, {
        status: site.status === 'running' ? 'stopped' : 'running',
        updatedAt: new Date().toISOString()
      });
    }
  };

  const runningCount = sites.filter(s => s.status === 'running').length;
  const totalCount = sites.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Layout className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Web Hosting Manager
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your web applications with ease</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-6 px-4 py-2 bg-white/60 rounded-xl border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">{runningCount} Running</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <Server size={14} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{totalCount} Total</span>
                </div>
              </div>
              <SettingsModal />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sites</p>
                <p className="text-3xl font-bold text-green-600">{runningCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sites</p>
                <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Server className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SSL Enabled</p>
                <p className="text-3xl font-bold text-purple-600">{sites.filter(s => s.ssl.enabled).length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Globe className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Sites Grid */}
        {sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onDelete={removeSite}
                onToggle={handleToggle}
                onUpdate={updateSite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Server className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Get started by adding your first web application. We'll help you manage and monitor it.
            </p>
            <div className="flex justify-center">
              <AddSiteModal onAdd={handleAddSite} />
            </div>
          </div>
        )}

        {/* Floating Add Button - only show when sites exist */}
        {sites.length > 0 && <AddSiteModal onAdd={handleAddSite} />}
      </main>
    </div>
  );
}

export default App;