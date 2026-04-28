import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    FileText,
    CheckCircle2,
    XCircle,
    User,
    Clock,
    DollarSign,
    ExternalLink,
    AlertCircle,
    Trash2
} from 'lucide-react';

const Proposals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [activeMenu, setActiveMenu] = useState(null);

    // Mock Data for Proposals
    const [proposals, setProposals] = useState([
        { 
            id: 'PROP-1234', 
            jobId: 'JH-9021', 
            jobTitle: 'Senior React Developer',
            freelancer: 'John Doe', 
            bidAmount: 4800, 
            status: 'Pending',
            submittedDate: '2026-03-12',
            isSpam: false
        },
        { 
            id: 'PROP-1235', 
            jobId: 'JH-8832', 
            jobTitle: 'UX/UI Designer for Fintech',
            freelancer: 'Jane Smith', 
            bidAmount: 3200, 
            status: 'Accepted',
            submittedDate: '2026-03-13',
            isSpam: false
        },
        { 
            id: 'PROP-1236', 
            jobId: 'JH-9021', 
            jobTitle: 'Senior React Developer',
            freelancer: 'Spam Bot 007', 
            bidAmount: 100, 
            status: 'Pending',
            submittedDate: '2026-03-14',
            isSpam: true
        },
    ]);

    const handleRemoveSpam = (id) => {
        if (window.confirm('Mark this proposal as spam and remove it?')) {
            setProposals(proposals.filter(p => p.id !== id));
        }
    };

    const filteredProposals = proposals.filter(p => {
        const matchesSearch = p.freelancer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        const matchesSpam = filterStatus === 'Spam' ? p.isSpam : true;
        return matchesSearch && (filterStatus === 'Spam' ? p.isSpam : matchesStatus);
    });

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-primary" />
                        Proposal Management
                    </h1>
                    <p className="text-text-muted text-sm italic">Review freelancer bids and moderate platform activity</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search proposals..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[300px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mr-2">
                    <Filter size={16} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Filters</span>
                </div>
                
                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Proposals</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Spam">Flagged as Spam</option>
                </select>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Proposal Details</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Freelancer</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Bid Amount</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProposals.map((prop) => (
                            <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                            {prop.jobTitle}
                                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                        <span className="text-[10px] font-mono text-text-muted tracking-tighter uppercase mt-1">ID: {prop.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User size={14} className="text-primary" />
                                        </div>
                                        <span className="text-sm text-white">{prop.freelancer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-white">₹{prop.bidAmount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                        prop.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        prop.status === 'Pending' ? 'bg-primary/10 text-primary border-primary/20' :
                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                        {prop.status}
                                    </span>
                                    {prop.isSpam && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                            SPAM
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleRemoveSpam(prop.id)}
                                            className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                            title="Mark as Spam"
                                        >
                                            <AlertCircle size={18} />
                                        </button>
                                        <button 
                                            className="p-2 text-text-muted hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Proposals;
