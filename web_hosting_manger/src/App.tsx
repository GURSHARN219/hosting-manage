import React from 'react';
import { useSiteStore } from './store/siteStore';
import { SiteCard } from './components/SiteCard';
import { AddSiteModal } from './components/AddSiteModal';
import { SettingsModal } from './components/SettingsModal';
import { Layout } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Layout className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">Web Hosting Manager</h1>
            </div>
            <SettingsModal />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onDelete={removeSite}
              onToggle={handleToggle}
            />
          ))}
        </div>
        
        {sites.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No sites yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first site.</p>
          </div>
        )}

        <AddSiteModal onAdd={handleAddSite} />
      </main>
    </div>
  );
}

export default App;