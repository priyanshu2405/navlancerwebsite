import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Search,
    User,
    Clock,
    ChevronRight,
    Loader2,
    Filter
} from 'lucide-react';
import { useContract } from '../../hooks/useContract';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const { getAllContracts, loading: loadingContracts } = useContract();
    const [contracts, setContracts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    // Returns the OTHER person's name (the recipient) based on current user's role
    const getRecipientName = (contract) => {
        const isClient = role === 'client' || role === 'Client';
        return isClient
            ? (contract.freelancerId?.name || 'Freelancer')
            : (contract.clientId?.name || 'Client');
    };

    useEffect(() => {
        const fetchContracts = async () => {
            const data = await getAllContracts();
            setContracts(data);
        };
        fetchContracts();
    }, [getAllContracts]);

    const filteredContracts = contracts.filter(c => {
        const matchesSearch =
            c.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.clientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.freelancerId?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'active') return matchesSearch && c.status === 'active';
        if (filter === 'completed') return matchesSearch && c.status === 'completed';
        return matchesSearch;
    });

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Messages</h1>
                    <p className="text-text-muted text-sm font-medium">
                        Manage your active conversations and project contracts
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                    {['all', 'active', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize whitespace-nowrap transition-all ${filter === f
                                ? 'bg-primary text-black'
                                : 'bg-white/5 text-text-muted hover:bg-white/10'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loadingContracts ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary mb-4" size={48} />
                    <p className="text-text-muted">Loading your conversations...</p>
                </div>
            ) : filteredContracts.length === 0 ? (
                <div className="p-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/5">
                    <div className="p-4 bg-primary/20 rounded-full mb-4 text-primary">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">No messages yet</h3>
                    <p className="text-text-muted text-[11px] max-w-xs mx-auto leading-relaxed">
                        When you start working on a contract, your conversations will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredContracts.map((contract, idx) => (
                            <motion.div
                                key={contract._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/chat/${contract._id}`, {
                                    state: { recipientName: getRecipientName(contract) }
                                })}
                                className="group bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/50 hover:bg-white/[0.07] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                                                {contract.jobId?.title || 'Project Chat'}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted uppercase tracking-wider font-black">
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {getRecipientName(contract)}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {contract.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden md:block text-right mr-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${contract.status === 'active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-white/5 text-text-muted border-white/10'
                                                }`}>
                                                {contract.status}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Messages;
