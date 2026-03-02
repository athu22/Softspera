import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, MapPin, Clock, ArrowRight, Tag, Sparkles, X } from 'lucide-react';
import { ref as databaseRef, set } from '@firebase/database';
import { database } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import type { Internship } from '../types';
import { useOptimizedData } from '../hooks/useOptimizedData';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function InternshipsPage() {
    const { data: internshipsData, loading } = useOptimizedData<{ [key: string]: Internship }>({ path: 'internships' });
    const internships = internshipsData ? Object.values(internshipsData).filter(i => i.active) : [];

    const availableCourses = [
        { id: '1', title: 'MERN Stack Development', description: 'Master full-stack web development using MongoDB, Express.js, React, and Node.js. Build real-world applications from scratch.', points: ['MongoDB & Mongoose', 'Express Framework', 'React & Redux', 'Node.js Backend', 'RESTful APIs'] },
        { id: '2', title: 'Python Full Stack', description: 'Learn backend with Django/Flask and frontend technologies to build robust, scalable Python web applications.', points: ['Python Fundamentals', 'Django / Flask', 'Database Design', 'Frontend Basics', 'Project Deployment'] },
        { id: '3', title: 'Frontend React / Vue', description: 'Become an expert in creating interactive and responsive user interfaces using modern JavaScript frameworks.', points: ['HTML5 & Modern CSS3', 'JavaScript (ES6+)', 'React or Vue.js Core', 'State Management', 'Responsive Design'] },
        { id: '4', title: 'Backend Node.js / Express', description: 'Focus heavily on server-side logic, database management, and building secure, performant APIs.', points: ['Node.js Architecture', 'Express Server Creation', 'SQL & NoSQL DBs', 'Authentication (JWT)', 'API Security Best Practices'] },
        { id: '5', title: 'UI/UX Design', description: 'Learn design thinking, wireframing, prototyping, and the principles of creating user-centric digital products.', points: ['Figma & Design Tools', 'Wireframing Concepts', 'High-fidelity Prototyping', 'User Research Methods', 'Creating Design Systems'] }
    ];

    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string, title: string, description: string, points: string[] } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInternship) return;

        setIsSubmitting(true);
        try {
            const id = Date.now().toString();
            await set(databaseRef(database, `internshipEnquiries/${id}`), {
                id,
                internshipId: selectedInternship.id,
                internshipTitle: selectedInternship.title,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                message: formData.message,
                createdAt: new Date().toISOString()
            });
            toast.success('Your enquiry has been submitted successfully!');
            setSelectedInternship(null);
            setFormData({ name: '', email: '', phone: '', college: '', message: '' });
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            toast.error('Failed to submit enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <Helmet>
                <title>Courses & Internships - Softspera</title>
                <meta name="description" content="Join Softspera through our exclusive course and internship programs. Launch your career in IT perfectly." />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="container relative z-10">
                    <motion.div className="mx-auto max-w-3xl text-center" initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6">
                            Launch Your Career
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold md:text-6xl text-secondary font-display">
                            Explore <span className="text-gradient">Courses & Internships</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 text-xl text-gray-600">
                            We offer industry-oriented courses along with practical internships. Learn, build, and innovate with us to jumpstart your career in tech.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-12 bg-white/50 backdrop-blur-sm z-20 relative">
                <div className="container max-w-6xl">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-secondary mb-4">Internships & Courses</motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">Get comprehensive training with our courses and real-world internship programs at special discounted prices.</motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
                        {/* 3 Months Package */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full">
                            <div className="glass-card p-8 rounded-3xl border border-primary/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white to-primary/5 h-full flex flex-col">
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">SPECIAL OFFER</div>
                                <h3 className="text-2xl font-bold text-secondary mb-2">3 Months Program</h3>
                                <p className="text-gray-600 mb-6">Complete Course + Real-world Internship</p>

                                <div className="flex items-center mb-6">
                                    <span className="text-gray-400 line-through text-2xl mr-3">₹7,000</span>
                                    <span className="text-4xl font-extrabold text-primary">₹5,000</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Comprehensive Training
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Live Projects & Internship
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Internship Certificate
                                    </li>
                                </ul>

                                <button onClick={() => {
                                    document.getElementById('internships-list')?.scrollIntoView({ behavior: 'smooth' });
                                }} className="btn-primary w-full shadow-xl">
                                    Internships & Courses
                                </button>
                            </div>
                        </motion.div>

                        {/* 6 Months Package */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full">
                            <div className="glass-card p-8 rounded-3xl border border-primary/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white to-primary/5 h-full flex flex-col">
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PREMIUM</div>
                                <h3 className="text-2xl font-bold text-secondary mb-2">6 Months Program</h3>
                                <p className="text-gray-600 mb-6">Advanced Course + Extended Internship</p>

                                <div className="flex items-center mb-6">
                                    <span className="text-gray-400 line-through text-2xl mr-3">₹15,000</span>
                                    <span className="text-4xl font-extrabold text-primary">₹10,000</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Advanced Tech Training
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Multiple Live Projects
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Experience Letter (6 Months)
                                    </li>
                                </ul>

                                <button onClick={() => {
                                    document.getElementById('internships-list')?.scrollIntoView({ behavior: 'smooth' });
                                }} className="btn-primary w-full shadow-xl">
                                    Internships & Courses
                                </button>
                            </div>
                        </motion.div>

                        {/* 11 Months Package */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full">
                            <div className="glass-card p-8 rounded-3xl border border-primary/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white to-primary/5 h-full flex flex-col">
                                <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">ELITE</div>
                                <h3 className="text-2xl font-bold text-secondary mb-2">11 Months Program</h3>
                                <p className="text-gray-600 mb-6">Master Course + Job-Ready Internship</p>

                                <div className="flex items-center mb-6">
                                    <span className="text-gray-400 line-through text-2xl mr-3">₹25,000</span>
                                    <span className="text-4xl font-extrabold text-primary">₹15,000</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Full Stack Mastery
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Enterprise Level Projects
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <Sparkles className="w-5 h-5 text-primary mr-2" /> Exp. Letter + Job Prep
                                    </li>
                                </ul>

                                <button onClick={() => {
                                    document.getElementById('internships-list')?.scrollIntoView({ behavior: 'smooth' });
                                }} className="btn-primary w-full shadow-xl">
                                    Internships & Courses
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Courses Listing */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-secondary mb-6">Available Courses</h3>
                        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                            {availableCourses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course)}
                                    className="px-5 py-2.5 bg-white rounded-full shadow-md border border-gray-100 text-gray-800 font-semibold hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                                >
                                    {course.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center">
                        <Link to="/contact" className="btn-primary inline-flex items-center shadow-2xl text-lg px-10 py-4 rounded-full">
                            Contact Us <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Internships List */}
            <section id="internships-list" className="py-20 -mt-10">
                <div className="container max-w-5xl">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : internships.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card text-center py-20 rounded-3xl">
                            <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-secondary mb-4">No Open Positions</h3>
                            <p className="text-gray-500 max-w-md mx-auto">We are not currently accepting internship applications. Please check back later or follow our social media for updates.</p>
                        </motion.div>
                    ) : (
                        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
                            {internships.map((internship) => (
                                <motion.div key={internship.id} variants={fadeInUp} className="group glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <GraduationCap size={14} /> {internship.department}
                                                </span>
                                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Clock size={14} /> {internship.duration}
                                                </span>
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <MapPin size={14} /> Remote / On-site
                                                </span>
                                            </div>

                                            <h2 className="text-3xl font-bold text-secondary mb-4">{internship.title}</h2>

                                            {(internship.rate || internship.offer) && (
                                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                                    {internship.rate && (
                                                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 font-semibold shadow-sm">
                                                            <Tag size={16} className="text-blue-600" />
                                                            Cost: {internship.rate}
                                                        </div>
                                                    )}
                                                    {internship.offer && (
                                                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 px-4 py-1.5 rounded-lg border border-red-100 font-bold shadow-sm animate-pulse">
                                                            <Sparkles size={16} className="text-red-500" />
                                                            {internship.offer}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl">{internship.description}</p>

                                            <div className="mb-6">
                                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Key Requirements:
                                                </h4>
                                                <ul className="grid sm:grid-cols-2 gap-2">
                                                    {internship.requirements.map((req, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                                            <span className="text-primary mr-2">•</span> {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end md:min-w-[200px]">
                                            <button onClick={() => setSelectedInternship(internship)} className="btn-primary w-full shadow-xl">
                                                Enquire Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Enquiry Modal */}
            <AnimatePresence>
                {selectedInternship && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedInternship(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold text-gray-900 mb-1">Apply for Internship</h3>
                            <p className="text-gray-500 mb-6">Enquire about the <span className="font-semibold text-primary">{selectedInternship.title}</span> program.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        value={formData.name}
                                        className="input w-full"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            value={formData.email}
                                            className="input w-full"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            value={formData.phone}
                                            className="input w-full"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">College / University</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                        value={formData.college}
                                        className="input w-full"
                                        placeholder="optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        value={formData.message}
                                        className="input w-full min-h-[100px]"
                                        placeholder="Any questions or additional information..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full mt-6 flex justify-center py-3"
                                >
                                    {isSubmitting ? (
                                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        'Submit Enquiry'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Course Info Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 border-b border-gray-100 pb-4 pr-8">
                                <h3 className="text-3xl font-bold text-secondary mb-2">{selectedCourse.title}</h3>
                                <div className="inline-flex items-center text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-semibold">
                                    <GraduationCap size={16} className="mr-2" /> Training Course
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 text-lg leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {selectedCourse.description}
                            </p>

                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" /> Key Learning Areas
                                </h4>
                                <ul className="space-y-3">
                                    {selectedCourse.points.map((pt: string, idx: number) => (
                                        <li key={idx} className="flex items-start text-gray-700 bg-white shadow-sm border border-gray-100 p-2.5 rounded-lg">
                                            <span className="text-primary mr-3 text-lg">•</span> {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link to="/contact" className="btn-primary w-full flex justify-center py-3 text-lg font-semibold shadow-xl">
                                Contact Us for Details
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
