import React from 'react';
import { useSiteStore } from './store/siteStore';
import { SiteCard } from './components/SiteCard';
import { AddSiteModal } from './components/AddSiteModal';
import { SettingsModal } from './components/SettingsModal';
import { Layout, Plus, Server } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-indigo-900/20 backdrop-blur-3xl">
      {/* Compact Header */}
      <header className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                <Layout className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white/90">WebHost</h1>
                <p className="text-xs text-white/60">Minimal hosting</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {totalCount > 0 && (
                <div className="flex items-center space-x-4 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-white/80">{runningCount}</span>
                  </div>
                  <div className="w-px h-3 bg-white/20"></div>
                  <span className="text-xs font-medium text-white/60">{totalCount}</span>
                </div>
              )}
              <SettingsModal />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Sites Grid */}
        {sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <Server className="text-white/60" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white/90 mb-2">No sites yet</h3>
            <p className="text-sm text-white/60 mb-6 max-w-sm mx-auto">
              Add your first site to get started
            </p>
            <AddSiteModal onAdd={handleAddSite} />
          </div>
        )}

        {/* Floating Add Button */}
        {sites.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <AddSiteModal onAdd={handleAddSite} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;