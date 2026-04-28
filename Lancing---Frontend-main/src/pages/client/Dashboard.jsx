import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Users,
    DollarSign,
    Plus,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import ClientJobCard from '../../components/dashboard/ClientJobCard';
import { useAuth } from '../../context/AuthContext';
import { useClientStats } from '../../hooks/useClientStats';
import { useClientJobs } from '../../hooks/useClientJobs';
import PostJobModal from '../../components/dashboard/PostJobModal';
import ActiveContractsWidget from '../../components/dashboard/ActiveContractsWidget';
import API_BASE_URL from '../../config/api';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { stats, loading: statsLoading } = useClientStats();
    const { deleteJob, duplicateJob, reopenJob } = useClientJobs();

    // Independent state for jobs list
    const [jobs, setJobs] = useState([]);
    const [deletedJobIds, setDeletedJobIds] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    const [editJob, setEditJob] = useState(null);

    // Fetch jobs independently
    const fetchJobs = useCallback(async () => {
        setJobsLoading(true);
        try {
            const authToken = token || localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Prioritize recentJobs as it's typically filtered by the backend
                const rawJobs = data.recentJobs || data.jobs || data.recent || [];
                setJobs(rawJobs.filter(j => {
                    const id = j._id || j.id;
                    if (deletedJobIds.includes(id)) return false;
                    const status = j.status?.toLowerCase();
                    return status !== 'deleted' && status !== 'inactive' && !j.isDeleted;
                }));
            }
        } catch (error) {
            console.error("Error fetching dashboard jobs:", error);
        } finally {
            setJobsLoading(false);
        }
    }, [token, deletedJobIds]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleJobPosted = () => {
        fetchJobs();
    };

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
                    // Handle "not found" as a success for the UI since it means the job isn't there
                    const isNotFound = result.error?.toLowerCase().includes('not found');

                    if (result.success || isNotFound) {
                        // Add to blacklist to prevent reappearing during refresh
                        setDeletedJobIds(prev => [...prev, jobId]);
                        // Immediately filter out from local state for better responsiveness
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


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        Dashboard
                    </h1>
                    <p className="text-text-muted text-lg">
                        Welcome back, <span className="text-primary font-bold">{user?.name || 'Client'}</span>!
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="px-6 py-3 bg-primary text-black rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Post New Job</span>
                </motion.button>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard
                    title="Total Spent"
                    value={`$${stats?.totalSpent || 0}`}
                    icon={DollarSign}
                    trend="&nbsp;"
                    color="text-green-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Active Jobs"
                    value={stats?.activeJobs || 0}
                    icon={Briefcase}
                    trend="&nbsp;"
                    color="text-blue-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Total Hires"
                    value={stats?.totalHires || 0}
                    icon={Users}
                    trend="&nbsp;"
                    color="text-purple-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Completed Jobs"
                    value={stats?.completedContracts || 0}
                    icon={CheckCircle2}
                    trend="&nbsp;"
                    color="text-primary"
                    loading={statsLoading}
                />
            </motion.div>

            {/* Active Contracts Section */}
            <ActiveContractsWidget userType="client" />

            {/* Recent Jobs Section */}

            {/* Recent Jobs Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="text-primary" />
                        Recent Job Postings
                    </h2>
                    <button
                        onClick={() => navigate('/client/my-jobs')}
                        className="text-text-muted hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                    >
                        View All
                    </button>
                </div>

                {jobsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.slice(0, 4).map((job) => (
                            <ClientJobCard
                                key={job._id || job.id}
                                job={job}
                                onAction={handleJobAction}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                            <Briefcase className="text-text-muted" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Active Jobs</h3>
                        <p className="text-text-muted mb-6">You haven't posted any jobs yet.</p>
                        <button
                            onClick={() => setIsPostJobModalOpen(true)}
                            className="text-primary font-bold hover:underline"
                        >
                            Post your first job
                        </button>
                    </div>
                )}
            </div>

            <PostJobModal
                isOpen={isPostJobModalOpen}
                onClose={() => {
                    setIsPostJobModalOpen(false);
                    setEditJob(null);
                }}
                onJobPosted={handleJobPosted}
                editJob={editJob}
            />
        </div>
    );
};

export default ClientDashboard;
