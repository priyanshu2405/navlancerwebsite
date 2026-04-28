import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Search, Bell, Star, Briefcase, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { useFreelancerJobs } from '../../hooks/useFreelancerJobs';
import { useMyProposals } from '../../hooks/useProposals';
import FreelancerJobCard from '../../components/dashboard/FreelancerJobCard';
import ProposalSubmissionModal from '../../components/dashboard/ProposalSubmissionModal';
import ActiveContractsWidget from '../../components/dashboard/ActiveContractsWidget';
import API_BASE_URL from '../../config/api';

const FreelancerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        earnings: 0,
        activeProposals: 0,
        completedJobs: 0,
        rating: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // Fetch recommended jobs (first 6)
    const { jobs: recommendedJobs, loading: loadingJobs } = useFreelancerJobs({});
    const { proposals, loading: loadingProposals, refetch: refetchProposals } = useMyProposals();

    // Proposal modal state
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch freelancer stats
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                // Note: Backend might not have /api/freelancer/stats yet
                // Using proposals and basic data for now
                const proposalsRes = await fetch(`${API_BASE_URL}/proposals/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (proposalsRes.ok) {
                    const proposalsData = await proposalsRes.json();
                    const activeCount = proposalsData.filter(p => p.status === 'pending').length;

                    setStats({
                        earnings: 0, // TODO: Get from API when available
                        activeProposals: activeCount,
                        completedJobs: 0, // TODO: Get from API when available
                        rating: 4.9 // TODO: Get from API when available
                    });
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
        refetchProposals();
    }, [refetchProposals]);

    const handleApply = (job) => {
        setSelectedJob(job);
        setIsProposalModalOpen(true);
    };

    const handleViewDetails = (job) => {
        // TODO: Navigate to job details page
        console.log('View job details:', job);
    };

    const handleProposalSuccess = () => {
        refetchProposals();
    };

    const displayedJobs = recommendedJobs.slice(0, 6);
    const recentProposals = proposals.slice(0, 3);

    if (loadingStats && loadingJobs && loadingProposals) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Freelancer Hub</h1>
                    <p className="text-text-muted text-lg">
                        Welcome back, <span className="text-primary font-bold">{user?.name?.split(' ')[0] || 'there'}</span>!
                    </p>
                </div>
                <button
                    onClick={() => navigate('/freelancer/browse-jobs')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
                >
                    <Search size={20} />
                    Browse All Jobs
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { icon: <Wallet className="text-primary" />, label: 'Total Earnings', value: `₹${stats.earnings.toLocaleString()}`, color: 'primary' },
                    { icon: <FileText className="text-blue-400" />, label: 'Active Proposals', value: stats.activeProposals, color: 'blue' },
                    { icon: <Briefcase className="text-green-400" />, label: 'Completed Jobs', value: stats.completedJobs, color: 'green' },
                    { icon: <Star className="text-yellow-400" />, label: 'Rating', value: `${stats.rating}/5`, color: 'yellow' },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            {React.cloneElement(item.icon, { size: 80 })}
                        </div>
                        <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl">{item.icon}</div>
                        <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider">{item.label}</h3>
                        <p className="text-3xl font-bold mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Active Contracts Section */}
            <ActiveContractsWidget userType="freelancer" />

            {/* Recommended Jobs */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-primary" size={28} />
                            Recommended for You
                        </h2>
                        <p className="text-text-muted text-sm mt-1">Jobs matching your skills and experience</p>
                    </div>
                    <button
                        onClick={() => navigate('/freelancer/browse-jobs')}
                        className="text-primary hover:underline font-semibold"
                    >
                        View All →
                    </button>
                </div>

                {loadingJobs ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : displayedJobs.length === 0 ? (
                    <div className="mt-8 p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-4 bg-primary/20 rounded-full mb-4">
                            <Search className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No jobs available right now</h2>
                        <p className="text-text-muted mb-6 max-w-md">
                            Check back later for new opportunities that match your skills.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {displayedJobs.map((job) => {
                                const hasApplied = proposals.some(p => (p.jobId?._id || p.jobId) === (job._id || job.id));
                                return (
                                    <FreelancerJobCard
                                        key={job._id || job.id}
                                        job={job}
                                        onApply={handleApply}
                                        onViewDetails={handleViewDetails}
                                        hasApplied={hasApplied}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Recent Proposals */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recent Proposals</h2>
                    <button
                        onClick={() => navigate('/freelancer/proposals')}
                        className="text-primary hover:underline font-semibold"
                    >
                        View All →
                    </button>
                </div>

                {loadingProposals ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : recentProposals.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center bg-white/5">
                        <FileText className="text-primary/50 mx-auto mb-3" size={32} />
                        <p className="text-text-muted">You haven't submitted any proposals yet.</p>
                        <p className="text-text-muted text-sm">Start applying to jobs to see them here!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentProposals.map((proposal) => (
                            <motion.div
                                key={proposal._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/30 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">
                                            {proposal.jobId?.title || 'Job Title'}
                                        </h3>
                                        <p className="text-sm text-text-muted mt-1">
                                            Proposed: ₹{proposal.price?.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${proposal.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                        proposal.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                            proposal.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {proposal.status?.toUpperCase()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Proposal Submission Modal */}
            <ProposalSubmissionModal
                isOpen={isProposalModalOpen}
                onClose={() => {
                    setIsProposalModalOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
                onSuccess={handleProposalSuccess}
            />
        </div>
    );
};

export default FreelancerDashboard;

