import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ref as databaseRef,
  set,
  remove,
} from '@firebase/database';
import {
  ref as storageRef,
  deleteObject,
} from '@firebase/storage';
import { database, storage } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import type { TeamMember } from '../../types';
import { useOptimizedData, clearDataCache } from '../../hooks/useOptimizedData';

export default function TeamPage() {
  const { data: teamData, loading, error, refetch } = useOptimizedData<{ [key: string]: TeamMember }>({ path: 'team' });
  const team = teamData ? Object.values(teamData) as TeamMember[] : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    roleLevel: 5,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // We don't need uploadImage anymore since we're using base64

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const id = editingMember?.id || Date.now().toString();

      await set(databaseRef(database, `team/${id}`), {
        id,
        ...formData,
        image: formData.image,
      });

      setIsModalOpen(false);
      setEditingMember(null);
      setFormData({ name: '', role: '', image: '', roleLevel: 5 });
      setImageFile(null);
      
      // Clear cache and refetch
      clearDataCache('team');
      refetch();
      
      toast.success(
        editingMember ? 'Team member updated!' : 'Team member added!'
      );
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

const handleEdit = (member: TeamMember) => {
  setEditingMember(member);
  setFormData({
    name: member.name,
    role: member.role,
    image: member.image,
    roleLevel: member.roleLevel ?? 5,
  });
  setIsModalOpen(true);
};


  const handleDelete = async (member: TeamMember) => {
    if (
      !window.confirm('Are you sure you want to delete this team member?')
    ) {
      return;
    }

    try {
      // Delete image from storage
      if (member.image) {
        const imageRef = storageRef(storage, member.image);
        await deleteObject(imageRef);
      }

      // Delete member data
      await remove(databaseRef(database, `team/${member.id}`));
      
      // Clear cache and refetch
      clearDataCache('team');
      refetch();
      
      toast.success('Team member deleted!');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Team - Softspera Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-gray-600">Manage your team members</p>
          </div>

          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({ name: '', role: '', image: '', roleLevel: 5 });
              setImageFile(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-500">Error loading team members. Please try again.</p>
          </div>
        ) : team.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">No team members yet. Add your first team member!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {team.map((member) => (
            <div
              key={member.id}
              className="rounded-lg bg-white p-6 text-center shadow-lg"
            >
              <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>

              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(member)}
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
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
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
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    required
                    className="input mt-1"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </div>

                {/* Hierarchy level input - moved into modal form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="roleLevel">
                    Hierarchy Level
                  </label>
                  <input
                    id="roleLevel"
                    type="number"
                    min={1}
                    max={10}
                    className="input mt-1"
                    value={formData.roleLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, roleLevel: Number(e.target.value) })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lower number = higher position (1 = Founder)
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="image"
                  >
                    Profile Image
                  </label>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 h-32 w-32 rounded-full object-cover"
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
                    {editingMember ? 'Update' : 'Create'}
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
