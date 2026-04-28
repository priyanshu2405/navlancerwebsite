import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClientJobCard from '../../components/dashboard/ClientJobCard';
import PostJobModal from '../../components/dashboard/PostJobModal';
import { useAuth } from '../../context/AuthContext';
import { useClientJobs } from '../../hooks/useClientJobs';
import API_BASE_URL from '../../config/api';

const MyJobs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { deleteJob, duplicateJob, reopenJob, loading: actionLoading } = useClientJobs();
    const [jobs, setJobs] = useState([]);
    const [deletedJobIds, setDeletedJobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'
    const [searchTerm, setSearchTerm] = useState('');
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    const [editJob, setEditJob] = useState(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const rawJobs = data.jobs || data.recentJobs || data.recent || [];
                setJobs(rawJobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    }, [deletedJobIds]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleJobAction = async (action, jobId) => {
        let result;
        switch (action) {
            case 'edit':
                const jobToEdit = jobs.find(j => (j._id === jobId || j.id === jobId));
                setEditJob(jobToEdit);
                setIsPostJobModalOpen(true);
                break;
            case 'delete':
                if (window.confirm('Are you sure you want to delete this job?')) {
                    const result = await deleteJob(jobId);
                    const isNotFound = result.error?.toLowerCase().includes('not found');

                    if (result.success || isNotFound) {
                        setDeletedJobIds(prev => [...prev, jobId]);
                        setJobs(prev => prev.filter(j => (j._id !== jobId && j.id !== jobId)));
                        if (result.success) fetchJobs();
                    } else {
                        alert(result.error);
                    }
                }
                break;
            case 'duplicate':
                result = await duplicateJob(jobId);
                if (result.success) fetchJobs();
                else alert(result.error);
                break;
            case 'reopen':
                result = await reopenJob(jobId);
                if (result.success) {
                    // Remove from blacklist if it was there
                    setDeletedJobIds(prev => prev.filter(id => id !== jobId));
                    fetchJobs();
                } else {
                    alert(result.error);
                }
                break;
            default:
                break;
        }
    };

    const isDeleted = (job) => {
        const id = job._id || job.id;
        const status = job.status?.toLowerCase();
        const isLocallyDeleted = deletedJobIds.includes(id);
        const isServerDeleted = status === 'deleted' || status === 'inactive' || job.isDeleted;
        return isLocallyDeleted || isServerDeleted;
    };

    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'active') {
            return !isDeleted(job);
        } else {
            return isDeleted(job);
        }
    }).filter(job => {
        const title = job.title || '';
        const desc = job.description || '';
        const search = searchTerm.toLowerCase();
        return title.toLowerCase().includes(search) || desc.toLowerCase().includes(search);
    });

    return (
        <div className="space-y-4 pb-4">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">My Jobs</h1>
                    <p className="text-text-muted text-sm font-medium">Manage and monitor all your job postings</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-black uppercase tracking-wider text-[10px] shadow-lg shadow-primary/20"
                >
                    <Plus size={16} strokeWidth={3} />
                    Post New Job
                </motion.button>
            </div>

            {/* Filters and Search (Elite Bar Style) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                {/* Status Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start">
                    {[
                        { id: 'active', label: 'Active', count: jobs.filter(j => !isDeleted(j)).length },
                        { id: 'deleted', label: 'Deleted / Expired', count: jobs.filter(j => isDeleted(j)).length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-text-muted'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search your jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-primary/30 transition-all placeholder:text-text-muted/50"
                        />
                    </div>
                </div>
            </div>

            {/* Jobs List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary mb-4" size={32} />
                    <p className="text-text-muted text-xs font-black uppercase tracking-widest">Loading Postings...</p>
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredJobs.map((job) => (
                        <ClientJobCard
                            key={job._id || job.id}
                            job={job}
                            forceIsDeleted={activeTab === 'deleted'}
                            onAction={handleJobAction}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                        <Briefcase size={24} className="text-text-muted opacity-50" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">No jobs found</h3>
                    <p className="text-text-muted text-[11px] max-w-[240px] text-center mb-6">
                        {searchTerm ? "Try a different search term or clear filters." : "You haven't posted any jobs yet. Start by posting your first project!"}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setIsPostJobModalOpen(true)}
                            className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-primary text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Post Your First Job
                        </button>
                    )}
                </div>
            )}

            <PostJobModal
                isOpen={isPostJobModalOpen}
                onClose={() => {
                    setIsPostJobModalOpen(false);
                    setEditJob(null);
                }}
                onJobPosted={fetchJobs}
                editJob={editJob}
            />
        </div>
    );
};

export default MyJobs;
