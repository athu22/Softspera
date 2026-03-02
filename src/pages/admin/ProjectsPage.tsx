import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ref as databaseRef,
  set,
  remove,
} from '@firebase/database';
import { database } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import type { Project } from '../../types';
import { useOptimizedData, clearDataCache } from '../../hooks/useOptimizedData';

export default function ProjectsPage() {
  const { data: projectsData, loading, error, refetch } = useOptimizedData<Project[]>({ path: 'projects' });
  const projects = projectsData ? Object.values(projectsData) as Project[] : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    // convert file to base64 data URL and store in formData.image
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) setFormData((s) => ({ ...s, image: result }));
    };
    reader.onerror = (err) => {
      console.error('Error reading image file', err);
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const id = editingProject?.id || Date.now().toString();
      // image is already set on formData (base64 data URL) by handleImageChange
      await set(databaseRef(database, `projects/${id}`), {
        id,
        ...formData,
        image: formData.image,
      });

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', link: '', image: '' });
      setImageFile(null);
      
      // Clear cache and refetch
      clearDataCache('projects');
      refetch();
      
      toast.success(
        editingProject ? 'Project updated!' : 'Project created!'
      );
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      link: project.link,
      image: project.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      // If the image is a data URL (base64) there's nothing in Storage to delete.
      // If it's a remote storage URL (https://firebasestorage...), deleting
      // reliably requires the original storage path or server-side deletion.
      if (project.image && project.image.startsWith('data:')) {
        // nothing to do
      } else if (project.image && project.image.startsWith('https://firebasestorage.googleapis.com')) {
        console.warn('Project image is a storage URL; skipping client-side delete. Remove via cloud console or server-side Admin SDK if needed.');
      }

      // Delete project data
      await remove(databaseRef(database, `projects/${project.id}`));
      
      // Clear cache and refetch
      clearDataCache('projects');
      refetch();
      
      toast.success('Project deleted!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Projects - Softspera Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your projects</p>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setFormData({
                name: '',
                description: '',
                link: '',
                image: '',
              });
              setImageFile(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-500">Error loading projects. Please try again.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="aspect-video">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="mt-2 text-gray-600">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  View Project →
                </a>

                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
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
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="input mt-1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
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
                    htmlFor="link"
                  >
                    Project Link
                  </label>
                  <input
                    type="url"
                    id="link"
                    required
                    className="input mt-1"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="image"
                  >
                    Project Image
                  </label>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 h-32 w-full rounded object-cover"
                    />
                  )}
                  <div className="mt-2">
                    <label className="btn-secondary flex cursor-pointer items-center justify-center space-x-2">
                      <ImageIcon size={20} />
                      <span>
                        {imageFile
                          ? 'Change Image'
                          : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
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
                    {editingProject ? 'Update' : 'Create'}
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
