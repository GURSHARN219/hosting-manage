import React, { useState } from 'react';
import { Site, SiteStats } from '../types';
import { 
  Server, 
  Globe, 
  Power, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu, 
  HardDrive, 
  Activity, 
  Settings,
  Shield,
  ExternalLink,
  Play,
  Square
} from 'lucide-react';
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
    responseTime: Math.floor(Math.random() * 300) + 100,
    cpu: Math.random() * 10,
    memory: Math.floor(Math.random() * 200) + 50,
    bandwidth: { in: Math.floor(Math.random() * 5000) + 1000, out: Math.floor(Math.random() * 8000) + 2000 }
  });

  const statusConfig = {
    running: {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: Play,
      label: 'Running'
    },
    stopped: {
      color: 'bg-gray-400',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: Square,
      label: 'Stopped'
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: Square,
      label: 'Error'
    }
  }[site.status];

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getUrl = () => {
    const protocol = site.ssl.enabled ? 'https' : 'http';
    const domain = site.domain.custom ? site.domain.name : `localhost:${site.port}`;
    return `${protocol}://${domain}`;
  };

  return (
    <>
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border ${statusConfig.borderColor} overflow-hidden group`}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-3 h-3 rounded-full ${statusConfig.color} shadow-sm`} />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{site.name}</h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} mt-1`}>
                  <statusConfig.icon size={12} className="mr-1" />
                  {statusConfig.label}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => onToggle(site.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  site.status === 'running' 
                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
                title={site.status === 'running' ? 'Stop' : 'Start'}
              >
                <Power size={18} />
              </button>
              <button
                onClick={() => onDelete(site.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* URL and Type */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Globe size={16} className="text-gray-400 flex-shrink-0" />
              <a 
                href={getUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium truncate flex items-center space-x-1 group/link"
              >
                <span className="truncate">{site.domain.custom ? site.domain.name : `localhost:${site.port}`}</span>
                <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
              </a>
              {site.ssl.enabled && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Shield size={14} />
                  <span className="text-xs font-medium">SSL</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Server size={16} className="text-gray-400" />
              <span className="capitalize font-medium">{site.type}</span>
              {site.status === 'running' && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-green-600 font-medium">{stats.responseTime}ms</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {site.status === 'running' && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">CPU</div>
                <div className="text-sm font-semibold text-gray-900">{stats.cpu.toFixed(1)}%</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Memory</div>
                <div className="text-sm font-semibold text-gray-900">{stats.memory}MB</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Uptime</div>
                <div className="text-sm font-semibold text-green-600">{stats.uptime}%</div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center justify-center w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" /> Show details
              </>
            )}
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6">
            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Activity size={16} className="mr-2" />
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Cpu size={14} className="mr-2" />
                      CPU Usage
                    </div>
                    <span className="text-sm font-medium">{stats.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <HardDrive size={14} className="mr-2" />
                      Memory
                    </div>
                    <span className="text-sm font-medium">{stats.memory} MB</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity size={14} className="mr-2" />
                      Response Time
                    </div>
                    <span className="text-sm font-medium">{stats.responseTime}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-2" />
                      Uptime
                    </div>
                    <span className="text-sm font-medium text-green-600">{stats.uptime}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bandwidth Usage */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Bandwidth Usage</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Incoming</div>
                  <div className="text-lg font-semibold text-blue-600">↓ {formatBytes(stats.bandwidth.in)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Outgoing</div>
                  <div className="text-lg font-semibold text-green-600">↑ {formatBytes(stats.bandwidth.out)}</div>
                </div>
              </div>
            </div>

            {/* Configuration Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Home Page:</span>
                  <span className="font-medium">{site.homePage}</span>
                </div>
                {site.serverFile && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Server File:</span>
                    <span className="font-medium">{site.serverFile}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Dependencies:</span>
                  <span className="font-medium">{site.dependencies.length || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment Variables:</span>
                  <span className="font-medium">{Object.keys(site.env).length || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Last updated: {new Date(site.updatedAt).toLocaleString()}
              </div>
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