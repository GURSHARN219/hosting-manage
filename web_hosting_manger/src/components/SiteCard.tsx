import React, { useState } from 'react';
import { Site, SiteStats } from '../types';
import { Server, Globe, Power, Trash2, ChevronDown, ChevronUp, Clock, Cpu, HardDrive, Activity, Settings } from 'lucide-react';
import { SiteSettingsModal } from './SiteSettingsModal';

interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Site>) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, onDelete, onToggle, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats] = useState<SiteStats>({
    id: crypto.randomUUID(),
    siteId: site.id,
    uptime: 99.9,
    lastChecked: new Date().toISOString(),
    responseTime: 250,
    cpu: 2.5,
    memory: 128,
    bandwidth: { in: 1024, out: 2048 }
  });

  const statusColor = {
    running: 'bg-green-500',
    stopped: 'bg-gray-500',
    error: 'bg-red-500'
  }[site.status];

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${statusColor}`} />
              <h3 className="text-lg font-semibold">{site.name}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => onToggle(site.id)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title={site.status === 'running' ? 'Stop' : 'Start'}
              >
                <Power size={20} />
              </button>
              <button
                onClick={() => onDelete(site.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Globe size={16} />
              <span>
                {site.domain.custom ? site.domain.name : `localhost:${site.port}`}
                {site.ssl.enabled && <span className="ml-2 text-green-600">🔒 SSL</span>}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Server size={16} />
              <span className="capitalize">{site.type}</span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" /> Show more
              </>
            )}
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Cpu size={16} className="mr-2" />
                  <span>CPU: {stats.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <HardDrive size={16} className="mr-2" />
                  <span>Memory: {stats.memory} MB</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Activity size={16} className="mr-2" />
                  <span>Response: {stats.responseTime}ms</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Uptime: {stats.uptime}%</span>
                </div>
              </div>
            </div>

            {/* Bandwidth */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">Bandwidth</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>↓ {formatBytes(stats.bandwidth.in)}</div>
                <div>↑ {formatBytes(stats.bandwidth.out)}</div>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Configuration</h4>
              <div className="text-sm text-gray-600">
                <p>Home Page: {site.homePage}</p>
                {site.serverFile && <p>Server: {site.serverFile}</p>}
                {site.dependencies.length > 0 && (
                  <p>Dependencies: {site.dependencies.join(', ')}</p>
                )}
                {Object.keys(site.env).length > 0 && (
                  <p>Environment Variables: {Object.keys(site.env).length}</p>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500">
              Last updated: {new Date(site.updatedAt).toLocaleString()}
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