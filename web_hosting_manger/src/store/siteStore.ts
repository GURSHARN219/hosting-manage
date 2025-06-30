import { create } from 'zustand';
import { Site, AppSettings } from '../types';

interface SiteStore {
  sites: Site[];
  settings: AppSettings;
  addSite: (site: Site) => void;
  removeSite: (id: string) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: {
    desktop: true,
    email: false,
  },
  autoStart: true,
  backupPath: './backups',
  backupSchedule: 'daily',
  defaultPort: 3000,
  sslProvider: 'letsencrypt',
};

export const useSiteStore = create<SiteStore>((set) => ({
  sites: [],
  settings: defaultSettings,
  addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),
  removeSite: (id) => set((state) => ({ 
    sites: state.sites.filter((site) => site.id !== id) 
  })),
  updateSite: (id, updates) => set((state) => ({
    sites: state.sites.map((site) => 
      site.id === id ? { ...site, ...updates } : site
    )
  })),
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
}));