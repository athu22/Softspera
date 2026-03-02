import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ref as databaseRef, onValue, remove } from '@firebase/database';
import { database } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Trash2, Phone, Mail, GraduationCap } from 'lucide-react';
import type { InternshipEnquiry } from '../../types';

export default function AdminInternshipEnquiries() {
    const [enquiries, setEnquiries] = useState<InternshipEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const enquiriesRef = databaseRef(database, 'internshipEnquiries');

        const unsubscribe = onValue(enquiriesRef, (snapshot) => {
            setLoading(false);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const enquiriesList = Object.values(data) as InternshipEnquiry[];
                // Sort by newest first
                setEnquiries(enquiriesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setEnquiries([]);
            }
        }, (err) => {
            console.error('Error fetching internship enquiries:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (enquiry: InternshipEnquiry) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            await remove(databaseRef(database, `internshipEnquiries/${enquiry.id}`));
            toast.success('Enquiry deleted!');
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            toast.error('Failed to delete enquiry');
        }
    };

    return (
        <>
            <Helmet>
                <title>Internship Enquiries - Softspera Admin</title>
            </Helmet>

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Internship Enquiries</h1>
                    <p className="text-gray-600">View and manage applications/enquiries for internships</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-500">Loading enquiries...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center py-12">
                        <p className="text-red-500">Error loading data. Please try again.</p>
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-500">No enquiries found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enquiries.map((enquiry) => (
                            <div key={enquiry.id} className="rounded-lg bg-white p-6 shadow-lg border border-gray-100 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{enquiry.name}</h3>
                                        <p className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(enquiry)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Applied For</p>
                                            <p className="text-sm font-medium text-gray-900">{enquiry.internshipTitle}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${enquiry.phone}`} className="text-sm text-blue-600 hover:underline">{enquiry.phone}</a>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <a href={`mailto:${enquiry.email}`} className="text-sm text-blue-600 hover:underline truncate">{enquiry.email}</a>
                                    </div>

                                    {enquiry.college && (
                                        <div className="bg-gray-50 rounded p-2 mt-2">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">College/University</p>
                                            <p className="text-sm text-gray-800">{enquiry.college}</p>
                                        </div>
                                    )}

                                    {enquiry.message && (
                                        <div className="bg-blue-50/50 rounded p-2 mt-2">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">Additional Message</p>
                                            <p className="text-sm text-gray-800 break-words">{enquiry.message}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
