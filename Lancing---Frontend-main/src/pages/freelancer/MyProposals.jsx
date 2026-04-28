import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, Filter, Edit2, Eye, XCircle, Calendar, DollarSign, Check } from 'lucide-react';
import { useMyProposals, useProposals } from '../../hooks/useProposals';
import { useContract } from '../../hooks/useContract';

const MyProposals = () => {
    const navigate = useNavigate();
    const { proposals, loading, refetch } = useMyProposals();
    const { withdrawProposal } = useProposals();
    const [statusFilter, setStatusFilter] = useState('all');
    const { getAllContracts } = useContract();

    const statusFilters = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' }
    ];

    const filteredProposals = statusFilter === 'all'
        ? proposals
        : proposals.filter(p => p.status === statusFilter);

    const handleWithdraw = async (proposalId) => {
        if (!window.confirm('Are you sure you want to withdraw this proposal?')) return;

        const result = await withdrawProposal(proposalId);
        if (result.success) {
            alert('Proposal withdrawn successfully');
            refetch();
        } else {
            alert(result.error || 'Failed to withdraw proposal');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'accepted':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'withdrawn':
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default:
                return 'bg-white/10 text-white border-white/20';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Proposals</h1>
                    <p className="text-text-muted text-lg">
                        Track and manage all your submitted proposals
                    </p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Filter by Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${statusFilter === filter.value
                                ? 'bg-primary text-black'
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Proposals List */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary mb-4" size={48} />
                        <p className="text-text-muted">Loading proposals...</p>
                    </div>
                ) : filteredProposals.length === 0 ? (
                    <div className="mt-8 p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-4 bg-primary/20 rounded-full mb-4">
                            <FileText className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No proposals found</h2>
                        <p className="text-text-muted mb-6 max-w-md">
                            {statusFilter === 'all'
                                ? "You haven't submitted any proposals yet. Start browsing jobs to apply!"
                                : `You don't have any ${statusFilter} proposals.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredProposals.map((proposal) => (
                                <motion.div
                                    key={proposal._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {proposal.jobId?.title || 'Job Title'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                                <span className={`px-3 py-1 rounded-full font-bold border ${getStatusColor(proposal.status)}`}>
                                                    {proposal.status?.toUpperCase()}
                                                </span>
                                                <span className="text-text-muted flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    Submitted: {formatDate(proposal.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cover Letter Preview */}
                                    <div className="mb-4 p-4 bg-white/5 rounded-xl">
                                        <p className="text-sm text-text-muted mb-1 font-semibold">Cover Letter:</p>
                                        <p className="text-white text-sm line-clamp-2">
                                            {proposal.coverLetter || 'No cover letter provided'}
                                        </p>
                                    </div>

                                    {/* Proposal Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/5">
                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Proposed Budget</p>
                                            <p className="text-white font-semibold flex items-center gap-1">
                                                <DollarSign size={14} className="text-primary" />
                                                ₹{proposal.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Client Budget</p>
                                            <p className="text-white font-semibold">
                                                ₹{proposal.jobId?.budget?.toLocaleString() || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Est. Days</p>
                                            <p className="text-white font-semibold">
                                                {proposal.estimatedDays || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Expires At</p>
                                            <p className="text-white font-semibold text-xs">
                                                {proposal.expiresAt ? formatDate(proposal.expiresAt) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/freelancer/jobs/${proposal.jobId?._id || proposal.jobId}`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
                                        >
                                            <Eye size={16} />
                                            View Job
                                        </button>

                                        {/* Show Chat as soon as proposal is accepted; use contractId provided by backend */}
                                        {proposal.status === 'accepted' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        // Exhaustive contract ID detection
                                                        const p = proposal;
                                                        console.log('📋 [MyProposals] Full Proposal Keys:', Object.keys(p));
                                                        console.log('📋 [MyProposals] Full Proposal Data:', JSON.stringify(p, null, 2));

                                                        const contractId = p.contractId
                                                            || (typeof p.contract === 'string' ? p.contract : p.contract?._id)
                                                            || p.contract?.id
                                                            || p.jobId?.contractId
                                                            || p.jobId?.contract?._id
                                                            || (typeof p.jobId?.contract === 'string' ? p.jobId?.contract : null)
                                                            || p.jobId?.activeContract?._id
                                                            || (typeof p.jobId?.activeContract === 'string' ? p.jobId?.activeContract : null);

                                                        if (!contractId) {
                                                            const p = proposal;
                                                            console.warn('📋 [MyProposals] NO CONTRACT ID FOUND FOR ACCEPTED PROPOSAL:', p._id);
                                                            console.log('📋 [MyProposals] Full data:', p);
                                                            alert(`Chat contract is still being initialized (Contract not found yet).\n\nIf you just accepted this proposal, please wait 10-15 seconds and refresh this page.\n\nDebug Info: ID ${p._id}`);
                                                            return;
                                                        }

                                                        console.log('💬 [MyProposals] Opening session:', contractId);
                                                        navigate(`/chat/${contractId}`, {
                                                            state: { recipientName: proposal.jobId?.title || 'Client' }
                                                        });
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500/20 transition-colors text-sm font-medium"
                                                >
                                                    <Check size={16} />
                                                    Chat
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        const p = proposal;
                                                        const contractId = p.contractId
                                                            || (typeof p.contract === 'string' ? p.contract : p.contract?._id)
                                                            || p.contract?.id
                                                            || p.jobId?.contractId
                                                            || p.jobId?.contract?._id
                                                            || (typeof p.jobId?.contract === 'string' ? p.jobId?.contract : null)
                                                            || p.jobId?.activeContract?._id
                                                            || (typeof p.jobId?.activeContract === 'string' ? p.jobId?.activeContract : null);

                                                        if (contractId) {
                                                            navigate(`/contract/${contractId}`);
                                                        } else {
                                                            alert('Contract details not found.');
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-colors text-sm font-medium"
                                                >
                                                    <FileText size={16} />
                                                    Contract
                                                </button>
                                            </>
                                        )}

                                        {proposal.status === 'pending' && (
                                            <>
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleWithdraw(proposal._id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium"
                                                >
                                                    <XCircle size={16} />
                                                    Withdraw
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProposals;
