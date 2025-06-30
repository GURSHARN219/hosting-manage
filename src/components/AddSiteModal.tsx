import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Folder, Code, Globe, Server, CheckCircle } from 'lucide-react';
import { Site } from '../types';

interface AddSiteModalProps {
  onAdd: (site: Omit<Site, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [siteType, setSiteType] = useState<Site['type']>('static');
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [newDependency, setNewDependency] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const siteTypes = [
    {
      type: 'static' as const,
      icon: Globe,
      title: 'Static Site',
      description: 'HTML, CSS, JavaScript files served directly',
      examples: 'React build, Vue build, plain HTML',
      color: 'blue',
      emoji: '📄'
    },
    {
      type: 'node' as const,
      icon: Server,
      title: 'Node.js App',
      description: 'Server-side JavaScript application',
      examples: 'Express, Next.js, Nuxt.js',
      color: 'green',
      emoji: '⚡'
    },
    {
      type: 'php' as const,
      icon: Code,
      title: 'PHP Application',
      description: 'PHP web application with server processing',
      examples: 'WordPress, Laravel, CodeIgniter',
      color: 'purple',
      emoji: '🐘'
    },
    {
      type: 'python' as const,
      icon: Code,
      title: 'Python App',
      description: 'Python web application',
      examples: 'Django, Flask, FastAPI',
      color: 'amber',
      emoji: '🐍'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type: siteType,
      path,
      homePage: siteType === 'static' ? 'index.html' : 'index.js',
      env: {},
      dependencies,
      autoStart: false,
      ssl: {
        enabled: false,
        type: 'letsencrypt'
      },
      domain: {
        custom: false,
        name: ''
      },
      port: 3000 + Math.floor(Math.random() * 1000)
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setName('');
    setPath('');
    setSiteType('static');
    setDependencies([]);
    setNewDependency('');
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

  const addDependency = () => {
    if (newDependency && !dependencies.includes(newDependency)) {
      setDependencies([...dependencies, newDependency]);
      setNewDependency('');
    }
  };

  const removeDependency = (dep: string) => {
    setDependencies(dependencies.filter(d => d !== dep));
  };

  const canProceed = () => {
    if (currentStep === 1) return siteType && name.trim();
    if (currentStep === 2) return path.trim();
    return true;
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const colors = {
      blue: selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300',
      green: selected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-300',
      purple: selected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300',
      amber: selected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Plus size={24} className="relative z-10" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Site</h2>
                    <p className="text-blue-100 text-sm mt-1">Step {currentStep} of 3 - Let's get started</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Step 1: Site Type and Name */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Site Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {siteTypes.map((type) => (
                        <div
                          key={type.type}
                          className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${getColorClasses(type.color, siteType === type.type)}`}
                          onClick={() => setSiteType(type.type)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{type.emoji}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">{type.title}</h4>
                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{type.description}</p>
                              <p className="text-xs text-gray-500 mt-3 font-medium">{type.examples}</p>
                            </div>
                          </div>
                          {siteType === type.type && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Site Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Awesome Website"
                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Project Path */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Project Location</h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Project Path</label>
                      <div className="flex rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
                        <input
                          type="text"
                          value={path}
                          onChange={(e) => setPath(e.target.value)}
                          placeholder="/path/to/your/project"
                          className="flex-1 px-6 py-4 border-0 focus:ring-2 focus:ring-blue-500 text-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleFileSelect}
                          className="px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center space-x-3 border-l border-gray-300"
                        >
                          <Folder size={20} className="text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">Browse</span>
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
                      <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                        Select the folder containing your {siteType} project files. This should be the root directory of your application.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dependencies */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Dependencies (Optional)</h3>
                    <div className="space-y-6">
                      {dependencies.length > 0 && (
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-900">Added Dependencies</label>
                          <div className="space-y-2">
                            {dependencies.map((dep) => (
                              <div key={dep} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <span className="font-semibold text-gray-900">{dep}</span>
                                <button
                                  type="button"
                                  onClick={() => removeDependency(dep)}
                                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">Add Dependency</label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={newDependency}
                            onChange={(e) => setNewDependency(e.target.value)}
                            placeholder="express, react, lodash..."
                            className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
                          />
                          <button
                            type="button"
                            onClick={addDependency}
                            disabled={!newDependency.trim()}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsOpen(false)}
                  className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-2xl hover:bg-gray-50"
                >
                  {currentStep > 1 ? 'Back' : 'Cancel'}
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold"
                  >
                    Create Site
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};