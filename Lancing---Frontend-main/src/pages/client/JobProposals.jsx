import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Briefcase, Users, Loader2, AlertCircle } from 'lucide-react';
import ProposalCard from '../../components/dashboard/ProposalCard';
import { useProposals } from '../../hooks/useProposals';
import { useContract } from '../../hooks/useContract';
import API_BASE_URL from '../../config/api';

const JobProposals = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const { getJobProposals, hireFreelancer, rejectProposal, loading: proposalLoading, error: proposalError } = useProposals();
    const { getAllContracts } = useContract();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            // 1. Fetch Job Details
            const jobRes = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!jobRes.ok) throw new Error('Failed to fetch job details');
            const jobData = await jobRes.json();
            setJob(jobData);

            // 2. Fetch Proposals & Contracts in parallel
            const contractsPromise = getAllContracts();
            const result = await getJobProposals(jobId);

            if (result.success) {
                const proposalsList = Array.isArray(result.data) ? result.data : (result.data?.proposals || []);
                const discoveredContracts = await contractsPromise;

                // 3. Link contracts to accepted proposals
                const finalProposals = proposalsList.map(p => {
                    if (p.status === 'accepted') {
                        const matchingContract = discoveredContracts.find(c =>
                            (c.proposalId?._id || c.proposalId) === p._id ||
                            (c.proposal?._id || c.proposal) === p._id
                        );
                        if (matchingContract) {
                            return {
                                ...p,
                                contractId: matchingContract._id || matchingContract.id,
                                contract: matchingContract
                            };
                        }
                    }
                    return p;
                });

                setProposals(finalProposals);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [jobId, getJobProposals]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleHire = async (proposalId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer? This will create a contract.')) return;

        setProcessingId(proposalId);
        const result = await hireFreelancer(proposalId);

        if (result.success) {
            // Navigate to chat with the new contract ID returned by backend
            const contractId = result.data?.contractId || result.data?.contract?._id || result.data?._id;

            // FRONTEND FALLBACK: remember mapping proposalId -> contractId
            // so freelancer side can retrieve it from /api/proposals/my
            if (contractId) {
                try {
                    const raw = localStorage.getItem('proposalContractMap');
                    const map = raw ? JSON.parse(raw) : {};
                    map[proposalId] = contractId;
                    localStorage.setItem('proposalContractMap', JSON.stringify(map));
                } catch (e) {
                    console.warn('Failed to cache proposal->contract mapping', e);
                }
            }

            if (contractId) {
                navigate(`/chat/${contractId}`, {
                    state: { recipientName: 'Freelancer' }
                });
            } else {
                alert('Freelancer hired, but failed to get contract ID for chat.');
                navigate('/client/dashboard');
            }
        } else {
            alert(result.error);
        }
        setProcessingId(null);
    };

    const handleReject = async (proposalId) => {
        if (!window.confirm('Are you sure you want to reject this proposal?')) return;

        setProcessingId(proposalId);
        const result = await rejectProposal(proposalId);

        if (result.success) {
            // Local update to reflect rejection immediately
            setProposals(prev => prev.map(p => p._id === proposalId ? { ...p, status: 'rejected' } : p));
        } else {
            alert(result.error);
        }
        setProcessingId(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Fetching Proposals...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
            <button
                onClick={() => navigate('/client/dashboard')}
                className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Back to Dashboard</span>
            </button>

            {/* Compact Job Header & Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 -mr-6 -mt-6 group-hover:scale-110 transition-transform duration-700">
                    <Briefcase size={120} className="text-primary" />
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded border border-primary/20">
                            {job?.category || 'Project'}
                        </span>
                        <span className="px-2.5 py-0.5 bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-wider rounded border border-white/10 uppercase">
                            Status: <span className="text-white">{job?.status}</span>
                        </span>
                        <span className="text-text-muted text-[10px] font-black uppercase tracking-wider ml-auto">
                            Posted {new Date(job?.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl font-black text-white leading-tight">
                        {job?.title}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Budget</p>
                            <p className="text-lg font-black text-primary">₹{job?.budget?.toLocaleString()}</p>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Expires On</p>
                            <p className="text-lg font-black text-white">{job?.expiryDate ? new Date(job?.expiryDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Applications</p>
                            <p className="text-lg font-black text-white">{proposals.length}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Project Description</p>
                        <p className="text-sm text-text-muted leading-relaxed max-w-3xl whitespace-pre-wrap">
                            {job?.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Proposals Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Recent Applications
                    <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded text-text-muted uppercase tracking-wider">
                        {proposals.length} Total
                    </span>
                </h2>

                {error && (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex flex-col items-center gap-4 text-center">
                        <p className="font-medium">{error}</p>
                        <button onClick={fetchData} className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg shadow-red-500/20">Retry</button>
                    </div>
                )}

                {proposals.length === 0 ? (
                    <div className="p-20 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-5 bg-primary/20 rounded-full mb-6 text-primary">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">No applications yet</h3>
                        <p className="text-text-muted max-w-sm mb-8 leading-relaxed">
                            Freelancers haven't submitted any proposals for this job yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {proposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal._id}
                                    proposal={proposal}
                                    onHire={handleHire}
                                    onReject={handleReject}
                                    onChat={(p) => {
                                        const cid = p.contractId || (typeof p.contract === 'string' ? p.contract : p.contract?._id);
                                        if (cid) {
                                            navigate(`/chat/${cid}`, { state: { recipientName: p.freelancerId?.name || 'Freelancer' } });
                                        } else {
                                            alert('Contract details not found.');
                                        }
                                    }}
                                    onViewContract={(p) => {
                                        const cid = p.contractId || (typeof p.contract === 'string' ? p.contract : p.contract?._id);
                                        if (cid) {
                                            navigate(`/contract/${cid}`);
                                        } else {
                                            alert('Contract details not found.');
                                        }
                                    }}
                                    isProcessing={processingId === proposal._id}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobProposals;
