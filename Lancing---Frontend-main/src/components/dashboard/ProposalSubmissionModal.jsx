import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, IndianRupee, Calendar, Paperclip, AlertCircle } from 'lucide-react';
import { useProposals } from '../../hooks/useProposals';

const ProposalSubmissionModal = ({ isOpen, onClose, job, onSuccess }) => {
    const [formData, setFormData] = useState({
        coverLetter: '',
        price: '',
        estimatedDays: ''
    });
    const [attachments, setAttachments] = useState([]);
    const [errors, setErrors] = useState({});
    const { submitProposal, loading } = useProposals();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, idx) => idx !== index));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = 'Cover letter is required';
        } else if (formData.coverLetter.length < 50) {
            newErrors.coverLetter = 'Cover letter must be at least 50 characters';
        } else if (formData.coverLetter.length > 1000) {
            newErrors.coverLetter = 'Cover letter must not exceed 1000 characters';
        }

        if (!formData.price) {
            newErrors.price = 'Proposed price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        if (formData.estimatedDays && (isNaN(formData.estimatedDays) || parseInt(formData.estimatedDays) <= 0)) {
            newErrors.estimatedDays = 'Estimated days must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const proposalData = {
            jobId: job._id || job.id,
            coverLetter: formData.coverLetter.trim(),
            price: parseFloat(formData.price)
        };

        if (formData.estimatedDays) {
            proposalData.estimatedDays = parseInt(formData.estimatedDays);
        }

        const result = await submitProposal(proposalData);

        if (result.success) {
            // TODO: Handle attachments if proposal creation returns proposal ID
            // For now, we'll just notify success
            onSuccess && onSuccess();
            handleClose();
        } else {
            setErrors({ submit: result.error });
        }
    };

    const handleClose = () => {
        setFormData({ coverLetter: '', price: '', estimatedDays: '' });
        setAttachments([]);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-bg-dark border-b border-white/10 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Submit Proposal</h2>
                            <p className="text-text-muted text-sm mt-1">
                                Applying for: <span className="text-primary font-semibold">{job?.title}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Cover Letter <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                placeholder="Explain why you're the best fit for this project..."
                                rows={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.coverLetter && (
                                    <span className="text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.coverLetter}
                                    </span>
                                )}
                                <span className={`text-xs ml-auto ${formData.coverLetter.length > 1000 ? 'text-red-500' : 'text-text-muted'
                                    }`}>
                                    {formData.coverLetter.length}/1000
                                </span>
                            </div>
                        </div>

                        {/* Price and Estimated Days */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Proposed Budget <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="5000"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                {errors.price && (
                                    <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} />
                                        {errors.price}
                                    </span>
                                )}
                                {job?.budget && (
                                    <p className="text-xs text-text-muted mt-1">
                                        Client's budget: ₹{job.budget.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Estimated Days
                                </label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                                    <input
                                        type="number"
                                        name="estimatedDays"
                                        value={formData.estimatedDays}
                                        onChange={handleChange}
                                        placeholder="7"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                {errors.estimatedDays && (
                                    <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} />
                                        {errors.estimatedDays}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Attachments (Optional)
                            </label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors">
                                <input
                                    type="file"
                                    id="attachments"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <label
                                    htmlFor="attachments"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <Paperclip size={24} className="text-primary mb-2" />
                                    <p className="text-sm text-white font-medium">Click to upload files</p>
                                    <p className="text-xs text-text-muted mt-1">PDF, DOC, or Images (Max 5MB each)</p>
                                </label>
                            </div>

                            {/* Attachment List */}
                            {attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                            <span className="text-sm text-white truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(idx)}
                                                className="text-red-500 hover:text-red-400 text-xs ml-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errors.submit}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Proposal'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProposalSubmissionModal;
