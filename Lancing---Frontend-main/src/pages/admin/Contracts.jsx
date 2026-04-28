import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    FileText,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    DollarSign,
    User,
    ArrowRight,
    PauseCircle,
    PlayCircle,
    History,
    ShieldAlert
} from 'lucide-react';

const Contracts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [activeMenu, setActiveMenu] = useState(null);

    // Mock Data based on useContract.js logic and platform structures
    const [contracts, setContracts] = useState([
        { 
            id: 'CT-7701', 
            jobTitle: 'Senior React Developer', 
            client: 'Acme Corp', 
            freelancer: 'Alex Riviera',
            amount: 5000, 
            startDate: '2026-03-01', 
            status: 'active' 
        },
        { 
            id: 'CT-6643', 
            jobTitle: 'UX/UI Designer for Fintech', 
            client: 'Globex Inc', 
            freelancer: 'Sarah Jenkins',
            amount: 3200, 
            startDate: '2026-03-05', 
            status: 'disputed',
            disputeReason: 'Client claims missed milestone'
        },
        { 
            id: 'CT-5512', 
            jobTitle: 'Senior Graphic Designer', 
            client: 'Initech', 
            freelancer: 'David Bose',
            amount: 2000, 
            startDate: '2026-02-20', 
            status: 'completed' 
        },
        { 
            id: 'CT-4402', 
            jobTitle: 'Full Stack Node.js Engineer', 
            client: 'Soylent Corp', 
            freelancer: 'Monica Geller',
            amount: 8000, 
            startDate: '2026-03-10', 
            status: 'paused' 
        },
        { 
            id: 'CT-3321', 
            jobTitle: 'Mobile App Developer', 
            client: 'Cyberdyne', 
            freelancer: 'John Connor',
            amount: 4500, 
            startDate: '2026-03-12', 
            status: 'cancelled_mutual' 
        },
    ]);

    const handleAction = (id, action) => {
        if (action === 'terminate') {
            if (window.confirm('CRITICAL ACTION: Terminate this contract immediately? This will trigger an automatic dispute resolution process.')) {
                setContracts(contracts.map(c => c.id === id ? { ...c, status: 'terminated' } : c));
            }
        } else if (action === 'resolve') {
            if (window.confirm('Resolve this dispute and return contract to active status?')) {
                setContracts(contracts.map(c => c.id === id ? { ...c, status: 'active', disputeReason: null } : c));
            }
        }
    };

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             c.freelancer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             c.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'paused':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'disputed':
                return 'bg-orange-600/10 text-orange-500 border-orange-600/20';
            case 'cancelled_mutual':
            case 'terminated':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-white/5 text-text-muted border-white/10';
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-primary" />
                        Contract Management
                    </h1>
                    <p className="text-text-muted text-sm italic">Monitor agreements, manage disputes and ensure fair play</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Title, Client or Freelancer..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[350px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mr-2">
                    <Filter size={16} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Agreement Filters</span>
                </div>
                
                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="disputed">Disputed</option>
                    <option value="cancelled_mutual">Cancelled (Mutual)</option>
                    <option value="terminated">Terminated</option>
                </select>
                
                <button 
                    onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                    className="text-xs font-bold text-primary hover:underline ml-auto"
                >
                    Clear All Filters
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Agreement ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Project & Parties</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Financials</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Timeline</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Lifecycle Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredContracts.map((contract, index) => (
                                    <motion.tr 
                                        key={contract.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono font-black text-text-muted tracking-widest uppercase">{contract.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col max-w-[250px]">
                                                <span className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors cursor-pointer">{contract.jobTitle}</span>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                                                        <User size={10} /> {contract.client}
                                                    </span>
                                                    <ArrowRight size={10} className="text-text-muted opacity-30" />
                                                    <span className="text-[10px] text-primary flex items-center gap-1 font-bold">
                                                        <User size={10} /> {contract.freelancer}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm font-black text-white">
                                                <DollarSign size={14} className="text-primary" />
                                                {contract.amount.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-text-muted mt-0.5 uppercase tracking-tighter">Fixed Price Contract</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <Clock size={12} />
                                                Started: {contract.startDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`w-fit px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(contract.status)}`}>
                                                    {contract.status.replace('_', ' ')}
                                                </span>
                                                {contract.status === 'disputed' && (
                                                    <span className="text-[10px] text-orange-500 font-bold italic truncate max-w-[150px]">
                                                        "{contract.disputeReason}"
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenu(activeMenu === contract.id ? null : contract.id)}
                                                        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${activeMenu === contract.id ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    <AnimatePresence>
                                                        {activeMenu === contract.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className={`absolute right-0 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-30 py-2 text-left ${
                                                                        index >= filteredContracts.length - 2 && filteredContracts.length > 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                                                                    }`}
                                                                >
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <Eye size={16} /> View Full Detail
                                                                    </button>
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <History size={16} /> Activity Logs
                                                                    </button>
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    
                                                                    {contract.status === 'disputed' && (
                                                                        <button 
                                                                            onClick={() => { handleAction(contract.id, 'resolve'); setActiveMenu(null); }}
                                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-400 hover:bg-green-500/10 transition-colors"
                                                                        >
                                                                            <ShieldAlert size={16} /> Resolve Dispute
                                                                        </button>
                                                                    )}

                                                                    {contract.status === 'active' && (
                                                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10 transition-colors">
                                                                            <PauseCircle size={16} /> Suspend Temporarily
                                                                        </button>
                                                                    )}

                                                                    {contract.status === 'paused' && (
                                                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-500 hover:bg-green-500/10 transition-colors">
                                                                            <PlayCircle size={16} /> Reactive Contract
                                                                        </button>
                                                                    )}

                                                                    <button 
                                                                        onClick={() => { handleAction(contract.id, 'terminate'); setActiveMenu(null); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                                                    >
                                                                        <XCircle size={16} /> Terminate Agreement
                                                                    </button>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <span className="text-xs text-text-muted">Showing {filteredContracts.length} platform agreements</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-text-muted hover:text-white disabled:opacity-30" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-black text-[10px] font-black">01</button>
                        <button className="p-2 text-text-muted hover:text-white">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Health Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Successful Completion</p>
                        <p className="text-xl font-black text-white">98.2%</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <AlertCircle className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Disputes</p>
                        <p className="text-xl font-black text-white">12</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <DollarSign className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Escrow Volume</p>
                        <p className="text-xl font-black text-white">₹8.4M</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <History className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Avg. Duration</p>
                        <p className="text-xl font-black text-white">24 Days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contracts;
