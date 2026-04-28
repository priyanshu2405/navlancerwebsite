import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, IndianRupee, Layout, FileText, Loader2 } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const PostJobModal = ({ isOpen, onClose, onJobPosted, editJob }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        category: 'Web Dev',
        expiryDate: ''
    });

    useEffect(() => {
        if (editJob) {
            setFormData({
                title: editJob.title || '',
                description: editJob.description || '',
                budget: editJob.budget || '',
                category: editJob.category || 'Web Dev',
                expiryDate: editJob.expiryDate ? new Date(editJob.expiryDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                budget: '',
                category: 'Web Dev',
                expiryDate: ''
            });
        }
    }, [editJob, isOpen]);

    const categories = ['Web Dev', 'Design', 'Marketing', 'Writing', 'Video', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please log in again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = editJob
                ? `${API_BASE_URL}/jobs/${editJob._id || editJob.id}`
                : `${API_BASE_URL}/jobs`;

            const method = editJob ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    budget: Number(formData.budget)
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to ${editJob ? 'update' : 'post'} job`);
            }

            const data = await response.json();
            onJobPosted(data.job || data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-bg-dark border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-xl">
                                <Briefcase className="text-primary" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">{editJob ? 'Edit Job' : 'Post a New Job'}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                    <Layout size={16} /> Job Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Build a Modern Landing Page"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Category & Budget */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                        <Briefcase size={16} /> Category
                                    </label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-bg-dark">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                        <IndianRupee size={16} /> Budget (INR)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 5000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Job Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                    <Layout size={16} /> Expiry Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-white"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                    <FileText size={16} /> Description
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Describe the job requirements, deliverables, and timeline..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3.5 md:py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all text-text-muted text-sm md:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] px-8 py-3.5 md:py-4 bg-primary text-black rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        {editJob ? 'Updating...' : 'Posting...'}
                                    </>
                                ) : (
                                    editJob ? 'Update Job' : 'Post Job'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostJobModal;
