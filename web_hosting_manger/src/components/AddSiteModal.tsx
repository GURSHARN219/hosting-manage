import React, { useState, useRef } from 'react';
import { Plus, X, Upload } from 'lucide-react';

interface AddSiteModalProps {
  onAdd: (site: Omit<Site, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [newDependency, setNewDependency] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type: 'static',
      path,
      homePage: 'index.html',
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
      port: 3000
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPath('');
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Add New Site</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Project Path */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Path</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    <Upload size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    webkitdirectory=""
                    directory=""
                  />
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dependencies</label>
                <div className="space-y-2">
                  {dependencies.map((dep) => (
                    <div key={dep} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={dep}
                        readOnly
                        className="flex-1 rounded-md border-gray-300 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setDependencies(dependencies.filter(d => d !== dep))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newDependency}
                      onChange={(e) => setNewDependency(e.target.value)}
                      placeholder="Package name"
                      className="flex-1 rounded-md border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addDependency}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};