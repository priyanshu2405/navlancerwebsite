import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Briefcase,
    Calendar,
    DollarSign,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    MapPin,
    X,
    Send,
    Heart
} from 'lucide-react';
import { useJobDetails } from '../../hooks/useFreelancerJobs';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { useState } from 'react';

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { job, loading, error, reportJob } = useJobDetails(jobId);
    const { savedJobs, saveJob, removeSavedJob } = useSavedJobs();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    const isJobSaved = savedJobs.some(sj => (sj._id || sj.id) === jobId);

    const handleSaveToggle = () => {
        if (isJobSaved) {
            removeSavedJob(jobId);
        } else {
            saveJob(jobId);
        }
    };

    const handleReport = async () => {
        if (!reportReason) return alert('Please select or enter a reason for reporting.');
        setIsReporting(true);
        const result = await reportJob(jobId, reportReason);
        if (result.success) {
            alert('Job reported successfully. Thank you for keeping the community safe.');
            setIsReportModalOpen(false);
            setReportReason('');
        } else {
            alert(result.error);
        }
        setIsReporting(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Loading Job Details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Job</h2>
                    <p className="text-text-muted mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!job) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            {/* Header / Breadcrumb */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest">Back</span>
            </button>

            {/* Main Content */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-12 opacity-5 -mr-8 -mt-8 pointer-events-none">
                    <Briefcase size={200} className="text-primary" />
                </div>

                <div className="p-8 md:p-12 relative z-10">
                    {/* Top Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
                            {job.category || 'General'}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${job.status === 'open' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                            }`}>
                            {job.status || 'Open'}
                        </span>
                        <span className="text-text-muted text-xs font-medium ml-auto flex items-center gap-1">
                            <Clock size={14} />
                            Posted {formatDate(job.createdAt)}
                        </span>

                        {/* Report Button */}
                        <div className="ml-auto flex items-center gap-3">
                            <button
                                onClick={handleSaveToggle}
                                title={isJobSaved ? "Remove from saved" : "Save job"}
                                className={`flex items-center gap-2 px-4 py-1.5 border rounded-full text-xs font-black uppercase tracking-widest transition-all ${isJobSaved
                                    ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                    : 'bg-white/5 border-white/10 text-white hover:border-primary/50'
                                    }`}
                            >
                                <Heart size={14} className={isJobSaved ? 'fill-red-500' : ''} />
                                {isJobSaved ? 'Saved' : 'Save Job'}
                            </button>
                            
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all"
                            >
                                <AlertCircle size={12} />
                                Report
                            </button>
                        </div>
                    </div>

                    {/* Job Title */}
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                        {job.title}
                    </h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={16} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Budget</span>
                            </div>
                            <p className="text-xl font-black text-white">₹{job.budget?.toLocaleString()}</p>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Deadline</span>
                            </div>
                            <p className="text-xl font-black text-white">{formatDate(job.expiryDate || job.deadline)}</p>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={16} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Proposals</span>
                            </div>
                            <p className="text-xl font-black text-white">{job.proposalsCount || 0}</p>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Type</span>
                            </div>
                            <p className="text-xl font-black text-white capitalize">{job.type || 'Remote'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4 mb-12">
                        <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2">Project Description</h2>
                        <div className="text-text-muted leading-relaxed whitespace-pre-wrap text-lg">
                            {job.description}
                        </div>
                    </div>

                    {/* Skills/Tags */}
                    {job.tags && job.tags.length > 0 && (
                        <div className="space-y-4 mb-12">
                            <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2">Required Skills</h2>
                            <div className="flex flex-wrap gap-3">
                                {job.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium hover:border-primary/50 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Client Info Section */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <h2 className="text-lg font-bold text-white mb-6">About the Client</h2>
                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-black border border-primary/20">
                                {job.clientId?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-white">{job.clientId?.name || 'Client Name'}</h3>
                                    {job.clientId?.isVerified && (
                                        <CheckCircle size={18} className="text-primary" />
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-text-muted">
                                    <span className="flex items-center gap-1 text-primary">
                                        ★ {job.clientId?.rating?.toFixed(1) || '0.0'}
                                    </span>
                                    <span>•</span>
                                    <span>{job.clientId?.reviewCount || 0} reviews</span>
                                    <span>•</span>
                                    <span>India</span>
                                </div>
                            </div>
                            <button className="ml-auto px-6 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Footer / CTA */}
            {job.status === 'open' && (
                <div className="flex items-center justify-between p-8 bg-primary rounded-3xl shadow-[0_0_40px_rgba(204,255,0,0.2)]">
                    <div>
                        <h3 className="text-black text-2xl font-black mb-1">Interested in this project?</h3>
                        <p className="text-black/70 font-semibold">Submit your proposal today to get started.</p>
                    </div>
                    <button
                        onClick={() => navigate('/freelancer/browse-jobs')}
                        className="px-10 py-4 bg-black text-primary rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        Apply Now
                    </button>
                </div>
            )}

            {/* Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsReportModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-bg-dark border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-white">Report Project</h3>
                                <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} className="text-text-muted" />
                                </button>
                            </div>

                            <p className="text-text-muted text-sm mb-6 leading-relaxed">
                                Please select a reason for reporting this project. Our team will review it shortly.
                            </p>

                            <div className="space-y-3 mb-8">
                                {[
                                    'Scam or Fraud',
                                    'Inappropriate Content',
                                    'Spam',
                                    'Low Quality or Unclear',
                                    'Other'
                                ].map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-bold ${reportReason === reason
                                            ? 'bg-red-500/10 border-red-500 text-red-500'
                                            : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
                                            }`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleReport}
                                disabled={isReporting || !reportReason}
                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                {isReporting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {isReporting ? 'Reporting...' : 'Submit Report'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetails;
