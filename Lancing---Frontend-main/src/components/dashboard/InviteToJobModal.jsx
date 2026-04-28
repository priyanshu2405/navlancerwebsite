import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Loader2, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useClientJobs } from '../../hooks/useClientJobs';
import API_BASE_URL from '../../config/api';

const InviteToJobModal = ({ isOpen, onClose, freelancerId, freelancerName }) => {
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { inviteFreelancer } = useClientJobs();

    useEffect(() => {
        if (isOpen) {
            fetchActiveJobs();
            setSuccess(false);
            setSelectedJobId('');
        }
    }, [isOpen]);

    const fetchActiveJobs = async () => {
        setLoadingJobs(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const rawJobs = data.jobs || data.recentJobs || [];
                // Only show active jobs that are not deleted
                setJobs(rawJobs.filter(j =>
                    j.status?.toLowerCase() === 'active' ||
                    (!j.isDeleted && j.status?.toLowerCase() !== 'deleted')
                ));
            }
        } catch (error) {
            console.error('Error fetching jobs for invitation:', error);
        } finally {
            setLoadingJobs(false);
        }
    };

    const handleInvite = async () => {
        if (!selectedJobId) return;
        setIsInviting(true);
        const result = await inviteFreelancer(selectedJobId, freelancerId);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            alert(result.error || 'Failed to send invitation');
        }
        setIsInviting(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white leading-tight">Invite to Project</h2>
                            <p className="text-text-muted font-medium mt-1">Invite <span className="text-primary">{freelancerName}</span> to one of your active jobs.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="text-text-muted" size={24} />
                        </button>
                    </div>

                    {success ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
                                <CheckCircle2 size={48} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Invitation Sent!</h3>
                            <p className="text-text-muted">We've notified the freelancer about your invite.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Select Active Job</label>
                                {loadingJobs ? (
                                    <div className="py-10 flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-2xl">
                                        <Loader2 className="animate-spin text-primary mb-2" size={24} />
                                        <p className="text-[10px] font-black uppercase text-text-muted">Fetching your jobs...</p>
                                    </div>
                                ) : jobs.length > 0 ? (
                                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {jobs.map(job => (
                                            <button
                                                key={job._id || job.id}
                                                onClick={() => setSelectedJobId(job._id || job.id)}
                                                className={`w-full p-4 flex items-center gap-4 rounded-2xl border transition-all text-left ${selectedJobId === (job._id || job.id)
                                                        ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(204,255,0,0.1)]'
                                                        : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${selectedJobId === (job._id || job.id) ? 'bg-primary text-black' : 'bg-white/5'}`}>
                                                    <Briefcase size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-bold transition-colors ${selectedJobId === (job._id || job.id) ? 'text-white' : ''}`}>{job.title}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">₹{job.budget?.toLocaleString()}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-2xl text-center px-6">
                                        <AlertCircle className="text-orange-500 mb-3" size={32} />
                                        <h4 className="text-white font-bold mb-1">No Active Jobs</h4>
                                        <p className="text-text-muted text-xs">You need to have an active job posting to invite freelancers.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleInvite}
                                disabled={!selectedJobId || isInviting}
                                className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                            >
                                {isInviting ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : <Send size={20} strokeWidth={3} />}
                                {isInviting ? 'Sending Invite...' : 'Send Invitation'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InviteToJobModal;
