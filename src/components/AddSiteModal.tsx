import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Folder, Code, Globe, Server } from 'lucide-react';
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
      examples: 'React build, Vue build, plain HTML'
    },
    {
      type: 'node' as const,
      icon: Server,
      title: 'Node.js App',
      description: 'Server-side JavaScript application',
      examples: 'Express, Next.js, Nuxt.js'
    },
    {
      type: 'php' as const,
      icon: Code,
      title: 'PHP Application',
      description: 'PHP web application with server processing',
      examples: 'WordPress, Laravel, CodeIgniter'
    },
    {
      type: 'python' as const,
      icon: Code,
      title: 'Python App',
      description: 'Python web application',
      examples: 'Django, Flask, FastAPI'
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-50"
      >
        <Plus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Add New Site</h2>
                  <p className="text-blue-100 text-sm mt-1">Step {currentStep} of 3</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Site Type and Name */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Site Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {siteTypes.map((type) => (
                        <div
                          key={type.type}
                          className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                            siteType === type.type
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          onClick={() => setSiteType(type.type)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              siteType === type.type ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <type.icon size={20} className={
                                siteType === type.type ? 'text-blue-600' : 'text-gray-600'
                              } />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{type.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                              <p className="text-xs text-gray-500 mt-2">{type.examples}</p>
                            </div>
                          </div>
                          {siteType === type.type && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Awesome Website"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Project Path */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Location</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Project Path</label>
                      <div className="flex rounded-xl shadow-sm">
                        <input
                          type="text"
                          value={path}
                          onChange={(e) => setPath(e.target.value)}
                          placeholder="/path/to/your/project"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleFileSelect}
                          className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-xl hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                          <Folder size={18} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Browse</span>
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
                      <p className="text-sm text-gray-500 mt-2">
                        Select the folder containing your {siteType} project files
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dependencies */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies (Optional)</h3>
                    <div className="space-y-4">
                      {dependencies.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900">Added Dependencies</label>
                          {dependencies.map((dep) => (
                            <div key={dep} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{dep}</span>
                              <button
                                type="button"
                                onClick={() => removeDependency(dep)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Add Dependency</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newDependency}
                            onChange={(e) => setNewDependency(e.target.value)}
                            placeholder="express, react, lodash..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
                          />
                          <button
                            type="button"
                            onClick={addDependency}
                            disabled={!newDependency.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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
              <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsOpen(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  {currentStep > 1 ? 'Back' : 'Cancel'}
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
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