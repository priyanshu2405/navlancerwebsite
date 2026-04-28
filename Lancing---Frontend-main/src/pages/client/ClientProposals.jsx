import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Users, Loader2, Search, Filter } from 'lucide-react';
import ProposalCard from '../../components/dashboard/ProposalCard';
import { useProposals } from '../../hooks/useProposals';
import { useContract } from '../../hooks/useContract';
import API_BASE_URL from '../../config/api';

const ClientProposals = () => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { getJobProposals, hireFreelancer, rejectProposal } = useProposals();
    const { getAllContracts } = useContract();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            // 1. Fetch All Client Jobs
            const jobsRes = await fetch(`${API_BASE_URL}/client/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!jobsRes.ok) throw new Error('Failed to fetch jobs');
            const jobsData = await jobsRes.json();
            const jobs = jobsData.jobs || [];

            // 2. Fetch Proposals for Each Job
            const allProposals = [];
            const contractsPromise = getAllContracts(); // Start fetching contracts in parallel

            await Promise.all(jobs.map(async (job) => {
                const jobId = job._id || job.id;
                try {
                    const result = await getJobProposals(jobId);
                    if (result.success) {
                        const proposalsList = Array.isArray(result.data) ? result.data : (result.data?.proposals || []);
                        const jobProposals = proposalsList.map(p => ({
                            ...p,
                            jobTitle: job.title,
                            jobId: jobId
                        }));
                        allProposals.push(...jobProposals);
                    }
                } catch (e) {
                    console.warn(`Failed to fetch proposals for job ${jobId}`, e);
                }
            }));

            // 3. DISCOVERY: Link contracts to accepted proposals
            const discoveredContracts = await contractsPromise;
            const finalProposals = allProposals.map(p => {
                if (p.status === 'accepted') {
                    const matchingContract = discoveredContracts.find(c =>
                        (c.proposalId?._id || c.proposalId) === p._id ||
                        (c.proposal?._id || c.proposal) === p._id
                    );
                    if (matchingContract) {
                        return { ...p, contractId: matchingContract._id || matchingContract.id, contract: matchingContract };
                    }
                }
                return p;
            });

            // Sort by newest first
            finalProposals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProposals(finalProposals);

        } catch (err) {
            console.error("Fetch data error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [getJobProposals]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleHire = async (proposalId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer? This will create a contract.')) return;

        setProcessingId(proposalId);
        const result = await hireFreelancer(proposalId);

        if (result.success) {
            // FRONTEND FALLBACK: remember mapping proposalId -> contractId (also from this screen)
            const contractId = result.data?.contractId || result.data?.contract?._id || result.data?._id;
            if (contractId) {
                try {
                    const raw = localStorage.getItem('proposalContractMap');
                    const map = raw ? JSON.parse(raw) : {};
                    map[proposalId] = contractId;
                    localStorage.setItem('proposalContractMap', JSON.stringify(map));
                } catch (e) {
                    console.warn('Failed to cache proposal->contract mapping from ClientProposals', e);
                }
            }

            alert('Freelancer hired successfully!');
            // Refresh to update status
            fetchData();
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
            setProposals(prev => prev.map(p => p._id === proposalId ? { ...p, status: 'rejected' } : p));
        } else {
            alert(result.error);
        }
        setProcessingId(null);
    };

    // Filter and Search Logic
    const filteredProposals = proposals.filter(proposal => {
        const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
        const matchesSearch =
            proposal.coverLetter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proposal.freelancer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proposal.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    if (loading && proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted">Loading proposals...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">All Proposals</h1>
                    <p className="text-text-muted text-sm font-medium">
                        Manage applications across all your active jobs
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search by freelancer or job title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                    {['all', 'pending', 'accepted', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize whitespace-nowrap transition-all ${filterStatus === status
                                ? 'bg-primary text-black'
                                : 'bg-white/5 text-text-muted hover:bg-white/10'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center">
                    {error}. <button onClick={fetchData} className="underline font-bold">Retry</button>
                </div>
            )}

            {filteredProposals.length === 0 ? (
                <div className="mt-8 p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5">
                    <div className="p-4 bg-primary/20 rounded-full mb-4">
                        <Users className="text-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No proposals found</h2>
                    <p className="text-text-muted mb-6">
                        {searchQuery || filterStatus !== 'all'
                            ? "Try adjusting your filters or search terms."
                            : "You haven't received any proposals yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProposals.map((proposal) => (
                            <div key={proposal._id} className="relative group">
                                {/* Job Context Badge */}
                                <div className="absolute -top-3 left-6 z-10 px-3 py-1 bg-bg-dark border border-white/10 rounded-full shadow-lg flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    <span className="text-xs font-bold text-text-muted">
                                        For: <span className="text-white">{proposal.jobTitle}</span>
                                    </span>
                                </div>
                                <ProposalCard
                                    proposal={proposal}
                                    onHire={handleHire}
                                    onReject={handleReject}
                                    onChat={(p) => {
                                        // Handle cases where contract might be populated object or just ID string
                                        const contractId = (typeof p.contract === 'string' ? p.contract : p.contract?._id) || p.contractId;

                                        if (contractId) {
                                            navigate(`/chat/${contractId}`, { state: { recipientName: p.freelancer?.name || 'Freelancer' } });
                                        } else {
                                            // Enhanced debug alert
                                            console.error('Proposal missing contract details:', p);
                                            alert(`Contract details not found.\nProposal ID: ${p._id}\nStatus: ${p.status}\nContract Field: ${JSON.stringify(p.contract)}`);
                                        }
                                    }}
                                    onViewContract={(p) => {
                                        const contractId = (typeof p.contract === 'string' ? p.contract : p.contract?._id) || p.contractId;
                                        if (contractId) {
                                            navigate(`/contract/${contractId}`);
                                        } else {
                                            alert('Contract details not found.');
                                        }
                                    }}
                                    isProcessing={processingId === proposal._id}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ClientProposals;
