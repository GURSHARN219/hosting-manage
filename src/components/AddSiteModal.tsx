import React, { useState, useRef } from 'react';
import { Plus, X, Folder, Globe, Server, Code } from 'lucide-react';
import { Site } from '../types';

interface AddSiteModalProps {
  onAdd: (site: Omit<Site, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [siteType, setSiteType] = useState<Site['type']>('static');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const siteTypes = [
    { type: 'static' as const, icon: Globe, title: 'Static', emoji: '📄' },
    { type: 'node' as const, icon: Server, title: 'Node.js', emoji: '⚡' },
    { type: 'php' as const, icon: Code, title: 'PHP', emoji: '🐘' },
    { type: 'python' as const, icon: Code, title: 'Python', emoji: '🐍' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type: siteType,
      path,
      homePage: siteType === 'static' ? 'index.html' : 'index.js',
      env: {},
      dependencies: [],
      autoStart: false,
      ssl: { enabled: false, type: 'letsencrypt' },
      domain: { custom: false, name: '' },
      port: 3000 + Math.floor(Math.random() * 1000)
    });
    setIsOpen(false);
    setName('');
    setPath('');
    setSiteType('static');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPath(files[0].path || files[0].name);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white/10 backdrop-blur-2xl text-white rounded-full p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
      >
        <Plus size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-md border border-white/20">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white/90">Add Site</h2>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/60 hover:text-white/90 p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Site Type */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {siteTypes.map((type) => (
                    <button
                      key={type.type}
                      type="button"
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        siteType === type.type
                          ? 'border-blue-400 bg-blue-400/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                      onClick={() => setSiteType(type.type)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.emoji}</span>
                        <span className="text-sm font-medium">{type.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Site"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Path */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Path</label>
                <div className="flex rounded-xl border border-white/20 overflow-hidden">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/path/to/project"
                    className="flex-1 px-3 py-2 bg-white/10 text-white placeholder-white/50 border-0 focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-1 border-l border-white/20"
                  >
                    <Folder size={16} className="text-white/60" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  webkitdirectory=""
                  directory=""
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-white/70 hover:text-white/90 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500/80 text-white rounded-xl hover:bg-blue-500 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};