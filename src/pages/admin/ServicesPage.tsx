import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ref, set, remove } from '@firebase/database';
import { database } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Service } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useOptimizedData, clearDataCache } from '../../hooks/useOptimizedData';

// Initialize FontAwesome library
library.add(fas, far);

// Helper function to convert Font Awesome class string to icon name
const convertIconClassToName = (iconClass: string) => {
  if (!iconClass) return null;
  
  const match = iconClass.match(/fa[brs]?\s+fa-([a-z0-9-]+)/);
  if (!match) return null;

  const prefix = iconClass.startsWith('far') ? ('far' as const) : ('fas' as const);
  const name = match[1] as IconName;

  // Return the icon configuration
  return [prefix, name] as [IconPrefix, IconName];
};

export default function ServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: servicesData, loading, error, refetch } = useOptimizedData<{ [key: string]: Service }>({ path: 'services' });
  const services = servicesData ? Object.values(servicesData) as Service[] : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to perform this action');
      navigate('/admin/login');
      return;
    }

    try {
      const id = editingService?.id || Date.now().toString();
      const serviceRef = ref(database, `services/${id}`);
      
      // Test write permission first
      try {
        await set(serviceRef, {
          id,
          ...formData,
          updatedAt: Date.now(),
          updatedBy: user.email
        });
        
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ title: '', description: '', icon: '' });
        
        // Clear cache and refetch
        clearDataCache('services');
        refetch();
        
        toast.success(editingService ? 'Service updated!' : 'Service created!');
      } catch (writeError: any) {
        console.error('Write error:', writeError);
        if (writeError.code === 'PERMISSION_DENIED') {
          toast.error('You do not have permission to modify services');
        } else {
          toast.error('Failed to save service: ' + writeError.message);
        }
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service: ' + error.message);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await remove(ref(database, `services/${id}`));
      
      // Clear cache and refetch
      clearDataCache('services');
      refetch();
      
      toast.success('Service deleted!');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Services - Softspera Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-600">Manage your services</p>
          </div>

          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ title: '', description: '', icon: '' });
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Service</span>
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-500">Error loading services. Please try again.</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">No services yet. Create your first service!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
            <div
              key={service.id}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="mb-4 text-4xl text-primary">
                {(() => {
                  const iconInfo = convertIconClassToName(service.icon);
                  return iconInfo ? (
                    <FontAwesomeIcon icon={iconInfo} />
                  ) : (
                    <span className={service.icon} />
                  );
                })()}
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-gray-600">{service.description}</p>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="text-xl font-bold">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    className="input mt-1"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    className="input mt-1"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="icon"
                  >
                    Icon (Font Awesome Class)
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      id="icon"
                      required
                      placeholder="e.g., fas fa-code"
                      className="input font-mono"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                    />
                    {formData.icon && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Preview:</span>
                        <div className="text-xl text-primary">
                          {(() => {
                            const iconInfo = convertIconClassToName(formData.icon);
                            return iconInfo ? (
                              <FontAwesomeIcon icon={iconInfo} />
                            ) : (
                              <span className={formData.icon} />
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingService ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
