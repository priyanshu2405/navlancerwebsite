import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Loader2, SlidersHorizontal, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFreelancerJobs } from '../../hooks/useFreelancerJobs';
import { useMyProposals } from '../../hooks/useProposals';
import FreelancerJobCard from '../../components/dashboard/FreelancerJobCard';
import ProposalSubmissionModal from '../../components/dashboard/ProposalSubmissionModal';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isRemote, setIsRemote] = useState(false);
    const [minBudget, setMinBudget] = useState('');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ page: 1, limit: 12 });
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const { jobs, pagination, loading, refetch: refetchJobs } = useFreelancerJobs(filters);
    const { proposals, loading: proposalsLoading, refetch: refetchProposals } = useMyProposals();

    const categories = [
        'All',
        'Web Development',
        'Mobile Development',
        'Design',
        'Writing',
        'Marketing',
        'Data Science',
        'Other'
    ];

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setPage(1);
        setFilters({
            ...filters,
            search: searchTerm,
            category: selectedCategory === 'All' ? '' : selectedCategory,
            remote: isRemote || undefined,
            minBudget: minBudget || undefined,
            page: 1
        });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
        const newFilters = {
            ...filters,
            category: category === 'All' ? '' : category,
            page: 1
        };
        setFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > (pagination?.pages || 1)) return;
        setPage(newPage);
        setFilters({ ...filters, page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setIsProposalModalOpen(true);
    };

    const handleViewDetails = (job) => {
        navigate(`/freelancer/jobs/${job._id || job.id}`);
    };

    const handleProposalSuccess = () => {
        refetchJobs();
        refetchProposals();
    };

    return (
        <div className="w-full space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Browse Jobs</h1>
                    <p className="text-text-muted text-lg font-medium">
                        Discover {pagination?.total || jobs.length} active opportunities
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search jobs by title, skills, keywords..."
                            className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 transition-all text-lg"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-black/20 border border-white/5 rounded-2xl p-1.5 min-w-[150px]">
                            <input
                                type="number"
                                placeholder="Min Budget"
                                value={minBudget}
                                onChange={(e) => setMinBudget(e.target.value)}
                                className="w-full bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-text-muted/40"
                            />
                            <div className="bg-primary/10 text-primary p-2 rounded-xl">
                                <span className="font-bold text-xs">₹</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="flex-1 md:flex-none px-10 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                        >
                            Find Jobs
                        </button>
                    </div>
                </form>

                <div className="h-px bg-white/5"></div>

                {/* Advanced Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${(category === 'All' && !selectedCategory) || selectedCategory === category
                                    ? 'bg-primary text-black shadow-lg shadow-primary/10'
                                    : 'bg-white/5 border border-white/5 text-text-muted hover:bg-white/10'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Remote Toggle */}
                    <button
                        onClick={() => {
                            const newValue = !isRemote;
                            setIsRemote(newValue);
                            setPage(1);
                            setFilters({ ...filters, remote: newValue || undefined, page: 1 });
                        }}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${isRemote
                            ? 'bg-primary/10 border-primary/50 text-primary'
                            : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
                            }`}
                    >
                        <Globe size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">Remote Only</span>
                        <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center`}>
                            {isRemote && <div className="w-2 h-2 bg-current rounded-full"></div>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-primary mb-6" size={56} />
                        <p className="text-text-muted text-sm font-black uppercase tracking-[0.3em]">Curating Opportunities...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="mt-8 p-24 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-6 bg-primary/20 rounded-full mb-6">
                            <Search className="text-primary" size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">No match found</h2>
                        <p className="text-text-muted mb-8 max-w-sm leading-relaxed font-medium">
                            We couldn't find any jobs matching your elite criteria. Try broadening your perspective or adjusting filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                                setMinBudget('');
                                setIsRemote(false);
                                setFilters({ page: 1, limit: 12 });
                            }}
                            className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {jobs.map((job) => {
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

                        {/* Pagination Controls */}
                        {pagination && pagination.pages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="p-4 bg-white/5 border border-white/5 rounded-2xl text-text-muted hover:border-primary/50 hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <div className="flex items-center gap-2">
                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${page === (i + 1)
                                                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                                : 'bg-white/5 border border-white/5 text-text-muted hover:bg-white/10'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === pagination.pages}
                                    className="p-4 bg-white/5 border border-white/5 rounded-2xl text-text-muted hover:border-primary/50 hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Proposal Modal */}
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

export default BrowseJobs;
