import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, UserSearch } from 'lucide-react';
import FreelancerCard from '../../components/dashboard/FreelancerCard';
import HireExpertModal from '../../components/dashboard/HireExpertModal';

const BrowseFreelancers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    const handleHireClick = (expert) => {
        setSelectedExpert(expert);
        setIsHireModalOpen(true);
    };

    const categories = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'AI & Data'];

    // This is where API integration will go
    useEffect(() => {
        const fetchFreelancers = async () => {
            // setLoading(true);
            // After actual integration:
            // const response = await fetch('/api/freelancers');
            // const data = await response.json();
            // setFreelancers(data);
            // setLoading(false);

            // For now, keeping it empty as requested by user
            setFreelancers([]);
        };

        fetchFreelancers();
    }, []);

    const filteredFreelancers = freelancers.filter(f => {
        const matchesSearch = f.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    return (
        <div className="space-y-4 pb-4">
            {/* Compact Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Find an <span className="text-primary">Expert</span></h1>
                    <p className="text-text-muted text-sm font-medium">Connect with top-tier freelancers instantly</p>
                </div>
            </div>

            {/* Elite Bar: Search & Category Filters Combined */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
                <div className="relative group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="e.g. React Developer, UI Designer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-primary/30 transition-all placeholder:text-text-muted/50"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide border-t border-white/5 pt-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${activeCategory === cat
                                ? 'bg-primary text-black border-primary'
                                : 'bg-white/5 text-text-muted hover:text-white border-white/5 hover:border-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary mb-4" size={32} />
                    <p className="text-text-muted text-sm font-bold uppercase tracking-widest">Searching Network...</p>
                </div>
            ) : filteredFreelancers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFreelancers.map(freelancer => (
                        <FreelancerCard
                            key={freelancer._id}
                            freelancer={freelancer}
                            onHire={() => handleHireClick(freelancer)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                    <UserSearch size={32} className="text-text-muted mb-3 opacity-50" />
                    <h3 className="text-lg font-bold text-white mb-1">No experts found</h3>
                    <p className="text-text-muted text-[11px] font-medium max-w-[200px] text-center">
                        Wait for the network to sync or try a different search.
                    </p>
                </div>
            )}

            {/* Hire Modal */}
            <HireExpertModal
                isOpen={isHireModalOpen}
                onClose={() => setIsHireModalOpen(false)}
                expert={selectedExpert}
            />
        </div>
    );
};

export default BrowseFreelancers;
