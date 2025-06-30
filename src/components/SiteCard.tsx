import React, { useState } from 'react';
import { Site } from '../types';
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
  Square,
  AlertCircle,
  TrendingUp
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

  // Generate realistic stats
  const stats = {
    uptime: site.status === 'running' ? 99.2 + Math.random() * 0.7 : 0,
    responseTime: site.status === 'running' ? Math.floor(Math.random() * 200) + 80 : 0,
    cpu: site.status === 'running' ? Math.random() * 15 + 2 : 0,
    memory: site.status === 'running' ? Math.floor(Math.random() * 150) + 50 : 0,
    bandwidth: {
      in: site.status === 'running' ? Math.floor(Math.random() * 5000) + 1000 : 0,
      out: site.status === 'running' ? Math.floor(Math.random() * 8000) + 2000 : 0
    }
  };

  const statusConfig = {
    running: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: Play,
      label: 'Running',
      pulse: true
    },
    stopped: {
      color: 'bg-gray-400',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: Square,
      label: 'Stopped',
      pulse: false
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertCircle,
      label: 'Error',
      pulse: false
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
      <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-white/40 overflow-hidden group hover:scale-[1.02]`}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`relative w-4 h-4 rounded-full ${statusConfig.color} shadow-lg ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                {statusConfig.pulse && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{site.name}</h3>
                  <span className="text-lg">{getTypeIcon()}</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                  <statusConfig.icon size={12} className="mr-1.5" />
                  {statusConfig.label}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => onToggle(site.id)}
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 ${
                  site.status === 'running' 
                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                    : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                title={site.status === 'running' ? 'Stop' : 'Start'}
              >
                <Power size={18} />
              </button>
              <button
                onClick={() => onDelete(site.id)}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* URL and SSL */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Globe size={16} className="text-gray-400 flex-shrink-0" />
              <a 
                href={getUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium truncate flex items-center space-x-1 group/link transition-colors duration-200"
              >
                <span className="truncate">{site.domain.custom ? site.domain.name : `localhost:${site.port}`}</span>
                <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
              </a>
              {site.ssl.enabled && (
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                  <Shield size={12} />
                  <span className="text-xs font-semibold">SSL</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Server size={16} className="text-gray-400" />
                <span className="capitalize font-medium">{site.type}</span>
              </div>
              {site.status === 'running' && (
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span className="text-xs font-semibold">{stats.responseTime}ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Stats */}
          {site.status === 'running' && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CPU</div>
                <div className="text-sm font-bold text-blue-700">{stats.cpu.toFixed(1)}%</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="text-xs text-purple-600 font-medium mb-1">Memory</div>
                <div className="text-sm font-bold text-purple-700">{stats.memory}MB</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                <div className="text-xs text-emerald-600 font-medium mb-1">Uptime</div>
                <div className="text-sm font-bold text-emerald-700">{stats.uptime.toFixed(1)}%</div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-full py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-200 font-medium"
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
          <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50/50 to-blue-50/30 p-6 space-y-6">
            {/* Detailed Performance Metrics */}
            {site.status === 'running' && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                  <Activity size={16} className="mr-2 text-blue-500" />
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-white/40">
                      <div className="flex items-center text-sm text-gray-600">
                        <Cpu size={14} className="mr-2 text-blue-500" />
                        CPU Usage
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-white/40">
                      <div className="flex items-center text-sm text-gray-600">
                        <HardDrive size={14} className="mr-2 text-purple-500" />
                        Memory
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.memory} MB</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-white/40">
                      <div className="flex items-center text-sm text-gray-600">
                        <Activity size={14} className="mr-2 text-emerald-500" />
                        Response
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-white/40">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={14} className="mr-2 text-amber-500" />
                        Uptime
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{stats.uptime.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bandwidth Usage */}
            {site.status === 'running' && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Network Traffic</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 rounded-2xl p-4 border border-white/40">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Incoming</div>
                    <div className="text-lg font-bold text-blue-600">↓ {formatBytes(stats.bandwidth.in)}</div>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-4 border border-white/40">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Outgoing</div>
                    <div className="text-lg font-bold text-emerald-600">↑ {formatBytes(stats.bandwidth.out)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Configuration Details */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">Configuration</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white/40">
                  <span className="text-sm text-gray-600 font-medium">Home Page</span>
                  <span className="text-sm font-bold text-gray-900">{site.homePage}</span>
                </div>
                {site.serverFile && (
                  <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white/40">
                    <span className="text-sm text-gray-600 font-medium">Server File</span>
                    <span className="text-sm font-bold text-gray-900">{site.serverFile}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white/40">
                  <span className="text-sm text-gray-600 font-medium">Dependencies</span>
                  <span className="text-sm font-bold text-gray-900">{site.dependencies.length || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="pt-4 border-t border-white/40">
              <div className="text-xs text-gray-500 font-medium">
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