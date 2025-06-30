import React, { useState } from 'react';
import { Site } from '../types';
import { 
  Globe, 
  Power, 
  Trash2, 
  Settings,
  Shield,
  ExternalLink,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import { SiteSettingsModal } from './SiteSettingsModal';

interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Site>) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, onDelete, onToggle, onUpdate }) => {
  const [showSettings, setShowSettings] = useState(false);

  const statusConfig = {
    running: {
      color: 'bg-emerald-400',
      icon: Play,
      label: 'Running',
      pulse: true
    },
    stopped: {
      color: 'bg-gray-400',
      icon: Square,
      label: 'Stopped',
      pulse: false
    },
    error: {
      color: 'bg-red-400',
      icon: AlertCircle,
      label: 'Error',
      pulse: false
    }
  }[site.status];

  const getUrl = () => {
    const protocol = site.ssl.enabled ? 'https' : 'http';
    const domain = site.domain.custom ? site.domain.name : `localhost:${site.port}`;
    return `${protocol}://${domain}`;
  };

  const getTypeIcon = () => {
    switch (site.type) {
      case 'node': return '⚡';
      case 'static': return '📄';
      case 'php': return '🐘';
      case 'python': return '🐍';
      default: return '🌐';
    }
  };

  return (
    <>
      <div className="group bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className={`relative w-2 h-2 rounded-full ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
              {statusConfig.pulse && (
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 mb-1">
                <h3 className="text-sm font-semibold text-white/90 truncate">{site.name}</h3>
                <span className="text-sm">{getTypeIcon()}</span>
              </div>
              <div className="text-xs text-white/60">{statusConfig.label}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => onToggle(site.id)}
              className="p-1.5 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Power size={14} />
            </button>
            <button
              onClick={() => onDelete(site.id)}
              className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* URL */}
        <div className="flex items-center space-x-2 text-xs mb-3">
          <Globe size={12} className="text-white/40 flex-shrink-0" />
          <a 
            href={getUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 font-medium truncate flex items-center space-x-1 group/link"
          >
            <span className="truncate">{site.domain.custom ? site.domain.name : `localhost:${site.port}`}</span>
            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
          </a>
          {site.ssl.enabled && (
            <div className="flex items-center space-x-1 text-emerald-300">
              <Shield size={10} />
            </div>
          )}
        </div>

        {/* Stats */}
        {site.status === 'running' && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-white/50">CPU</div>
              <div className="text-xs font-semibold text-white/80">{(Math.random() * 10 + 2).toFixed(1)}%</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-white/50">RAM</div>
              <div className="text-xs font-semibold text-white/80">{Math.floor(Math.random() * 100 + 50)}MB</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-white/50">MS</div>
              <div className="text-xs font-semibold text-emerald-300">{Math.floor(Math.random() * 200 + 80)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SiteSettingsModal
          site={site}
          onClose={() => setShowSettings(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};