import React from 'react';
import { useSiteStore } from './store/siteStore';
import { SiteCard } from './components/SiteCard';
import { AddSiteModal } from './components/AddSiteModal';
import { SettingsModal } from './components/SettingsModal';
import { Layout, Plus, Server, Globe, Activity, Shield, Zap } from 'lucide-react';
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
  const sslCount = sites.filter(s => s.ssl.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Layout className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  WebHost Manager
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">Professional web hosting management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-sm font-semibold text-gray-700">{runningCount} Active</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <Server size={14} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">{totalCount} Sites</span>
                </div>
                {sslCount > 0 && (
                  <>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <Shield size={14} className="text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">{sslCount} SSL</span>
                    </div>
                  </>
                )}
              </div>
              <SettingsModal />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        {sites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Sites</p>
                  <p className="text-3xl font-bold text-emerald-600">{runningCount}</p>
                  <p className="text-xs text-emerald-600 mt-1">Currently running</p>
                </div>
                <div className="p-4 bg-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Activity className="text-emerald-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Sites</p>
                  <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
                  <p className="text-xs text-blue-600 mt-1">Managed projects</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Server className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">SSL Secured</p>
                  <p className="text-3xl font-bold text-purple-600">{sslCount}</p>
                  <p className="text-xs text-purple-600 mt-1">HTTPS enabled</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Performance</p>
                  <p className="text-3xl font-bold text-amber-600">98%</p>
                  <p className="text-xs text-amber-600 mt-1">Average uptime</p>
                </div>
                <div className="p-4 bg-amber-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sites Grid */}
        {sites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="text-center py-20">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-sm"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center border border-blue-100">
                <Server className="text-blue-500" size={40} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to WebHost Manager</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Start managing your web applications with ease. Add your first site to monitor performance, 
              manage SSL certificates, and deploy with confidence.
            </p>
            <AddSiteModal onAdd={handleAddSite} />
          </div>
        )}

        {/* Floating Add Button - only show when sites exist */}
        {sites.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <AddSiteModal onAdd={handleAddSite} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;