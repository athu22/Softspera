import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ref as databaseRef, set, remove } from '@firebase/database';
import { database } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Plus, GraduationCap } from 'lucide-react';
import type { Internship } from '../../types';
import { useOptimizedData, clearDataCache } from '../../hooks/useOptimizedData';

export default function AdminInternships() {
    const { data: internshipsData, loading, error, refetch } = useOptimizedData<{ [key: string]: Internship }>({ path: 'internships' });
    const internships = internshipsData ? Object.values(internshipsData) : [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        description: '',
        duration: '',
        rate: '',
        offer: '',
        requirements: '',
        applyLink: '',
        active: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const id = editingInternship?.id || Date.now().toString();
            const internshipData: Internship = {
                id,
                title: formData.title,
                department: formData.department,
                description: formData.description,
                duration: formData.duration,
                rate: formData.rate,
                offer: formData.offer,
                requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
                applyLink: formData.applyLink,
                active: formData.active,
            };

            await set(databaseRef(database, `internships/${id}`), internshipData);

            setIsModalOpen(false);
            setEditingInternship(null);
            setFormData({ title: '', department: '', description: '', duration: '', rate: '', offer: '', requirements: '', applyLink: '', active: true });

            clearDataCache('internships');
            refetch();

            toast.success(editingInternship ? 'Internship updated!' : 'Internship added!');
        } catch (error) {
            console.error('Error saving internship:', error);
            toast.error('Failed to save internship');
        }
    };

    const handleEdit = (internship: Internship) => {
        setEditingInternship(internship);
        setFormData({
            title: internship.title,
            department: internship.department,
            description: internship.description,
            duration: internship.duration,
            rate: internship.rate || '',
            offer: internship.offer || '',
            requirements: internship.requirements.join('\n'),
            applyLink: internship.applyLink || '',
            active: internship.active,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (internship: Internship) => {
        if (!window.confirm('Are you sure you want to delete this internship?')) return;

        try {
            await remove(databaseRef(database, `internships/${internship.id}`));
            clearDataCache('internships');
            refetch();
            toast.success('Internship deleted!');
        } catch (error) {
            console.error('Error deleting internship:', error);
            toast.error('Failed to delete internship');
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Internships - Softspera Admin</title>
            </Helmet>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Internships</h1>
                        <p className="text-gray-600">Manage open internship positions</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingInternship(null);
                            setFormData({ title: '', department: '', description: '', duration: '', rate: '', offer: '', requirements: '', applyLink: '', active: true });
                            setIsModalOpen(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Internship</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-500">Loading internships...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center py-12">
                        <p className="text-red-500">Error loading data. Please try again.</p>
                    </div>
                ) : internships.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-500">No internships yet. Add your first internship program!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {internships.map((internship) => (
                            <div key={internship.id} className={`rounded-lg p-6 shadow-lg border-l-4 ${internship.active ? 'bg-white border-green-500' : 'bg-gray-50 border-gray-400'}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-primary">
                                            <GraduationCap size={20} />
                                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 rounded-full">{internship.department}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Duration: {internship.duration}</p>
                                        {(internship.rate || internship.offer) && (
                                            <div className="flex gap-2 flex-wrap text-sm mb-2">
                                                {internship.rate && <span className="text-gray-600">Cost: <span className="font-semibold text-gray-800">{internship.rate}</span></span>}
                                                {internship.offer && <span className="text-red-500 font-semibold bg-red-50 px-2 rounded">{internship.offer}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${internship.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                        {internship.active ? 'Active' : 'Closed'}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{internship.description}</p>

                                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                    <button onClick={() => handleEdit(internship)} className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(internship)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg rounded-xl bg-white p-8 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-6">{editingInternship ? 'Edit Internship' : 'Add Internship'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input type="text" required className="input mt-1" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Frontend Engineering Intern" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Department</label>
                                        <input type="text" required className="input mt-1" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Engineering" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                                        <input type="text" required className="input mt-1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 6 Months" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rate / Fee</label>
                                        <input type="text" className="input mt-1" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} placeholder="e.g. ₹5000 or Free" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Special Offer</label>
                                        <input type="text" className="input mt-1" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value })} placeholder="e.g. 50% Off / Early Bird Discount" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea required className="input mt-1 min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the internship role..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Requirements (One per line)</label>
                                    <textarea required className="input mt-1 min-h-[100px]" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="- React.js Knowledge&#10;- HTML/CSS" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apply Link (Optional)</label>
                                    <input type="url" className="input mt-1" value={formData.applyLink} onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })} placeholder="https://forms.gle/..." />
                                </div>

                                <div className="flex items-center space-x-3 py-2">
                                    <input type="checkbox" id="active" className="h-5 w-5 rounded text-primary" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
                                    <label htmlFor="active" className="text-sm font-medium text-gray-700">Accepting Applications (Active)</label>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="btn-primary">{editingInternship ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
