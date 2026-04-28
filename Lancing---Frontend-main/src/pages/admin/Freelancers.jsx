import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    ShieldCheck, 
    ShieldAlert, 
    UserX, 
    UserCheck, 
    CheckCircle2,
    XCircle,
    Star,
    Eye,
    FileText,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';

const Freelancers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterApproval, setFilterApproval] = useState('All');
    const [activeMenu, setActiveMenu] = useState(null);
    
    // Mock Data
    const [freelancers, setFreelancers] = useState([
        { id: '1', name: 'Alex Riviera', email: 'alex.r@design.com', status: 'Active', approval: 'Approved', verification: true, earnings: '₹1,50,000', projects: 42, rating: 4.9 },
        { id: '2', name: 'Monica Geller', email: 'monica@chef.io', status: 'Active', approval: 'Pending', verification: false, earnings: '₹0', projects: 0, rating: 0 },
        { id: '3', name: 'Chandler Bing', email: 'chan.b@transpondster.com', status: 'Suspended', approval: 'Rejected', verification: false, earnings: '₹4,500', projects: 2, rating: 3.5 },
        { id: '4', name: 'Joey Tribbiani', email: 'howyoudoin@actor.com', status: 'Active', approval: 'Pending', verification: true, earnings: '₹12,000', projects: 5, rating: 4.2 },
        { id: '5', name: 'Rachel Green', email: 'rachel@fashion.co', status: 'Active', approval: 'Approved', verification: true, earnings: '₹2,10,000', projects: 58, rating: 5.0 },
    ]);

    const handleAction = (id, action) => {
        if (action === 'suspend') {
            if (window.confirm('Are you sure you want to suspend this freelancer?')) {
                setFreelancers(freelancers.map(f => f.id === id ? { ...f, status: 'Suspended' } : f));
            }
        } else if (action === 'activate') {
            setFreelancers(freelancers.map(f => f.id === id ? { ...f, status: 'Active' } : f));
        } else if (action === 'approve') {
            setFreelancers(freelancers.map(f => f.id === id ? { ...f, approval: 'Approved' } : f));
        } else if (action === 'reject') {
            const reason = window.prompt('Reason for rejection:');
            if (reason) {
                setFreelancers(freelancers.map(f => f.id === id ? { ...f, approval: 'Rejected' } : f));
            }
        } else if (action === 'verify') {
            setFreelancers(freelancers.map(f => f.id === id ? { ...f, verification: true } : f));
        }
    };

    const filteredFreelancers = freelancers.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             f.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
        const matchesApproval = filterApproval === 'All' || f.approval === filterApproval;
        return matchesSearch && matchesStatus && matchesApproval;
    });

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Freelancer Management</h1>
                    <p className="text-text-muted text-sm">Review quality and approve platform experts</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search name or email..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[250px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Filters</span>
                </div>
                
                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All" className="bg-zinc-900">All Status</option>
                    <option value="Active" className="bg-zinc-900">Active</option>
                    <option value="Suspended" className="bg-zinc-900">Suspended</option>
                </select>

                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterApproval}
                    onChange={(e) => setFilterApproval(e.target.value)}
                >
                    <option value="All" className="bg-zinc-900">All Approval</option>
                    <option value="Pending" className="bg-zinc-900">Pending</option>
                    <option value="Approved" className="bg-zinc-900">Approved</option>
                    <option value="Rejected" className="bg-zinc-900">Rejected</option>
                </select>
                
                <button 
                    onClick={() => { setSearchTerm(''); setFilterStatus('All'); setFilterApproval('All'); }}
                    className="text-xs font-bold text-primary hover:underline ml-auto"
                >
                    Clear All
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        Freelancer <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Approval</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Earnings</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Projects</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Rating</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredFreelancers.map((f, index) => (
                                    <motion.tr 
                                        key={f.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    {f.name}
                                                    {f.verification && (
                                                        <ShieldCheck size={14} className="text-primary" title="Verified Badge" />
                                                    )}
                                                </span>
                                                <span className="text-xs text-text-muted">{f.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                f.status === 'Active' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {f.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                f.approval === 'Approved' ? 'bg-primary/10 text-primary border-primary/20' :
                                                f.approval === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-white/5 text-text-muted border-white/10'
                                            }`}>
                                                {f.approval}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{f.earnings}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{f.projects}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm font-bold text-white">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                {f.rating > 0 ? f.rating : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {f.approval === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAction(f.id, 'approve')}
                                                            className="p-2 hover:bg-primary/10 text-text-muted hover:text-primary transition-all rounded-lg"
                                                            title="Approve Freelancer"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(f.id, 'reject')}
                                                            className="p-2 hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all rounded-lg"
                                                            title="Reject Freelancer"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => handleAction(f.id, f.status === 'Active' ? 'suspend' : 'activate')}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        f.status === 'Active' 
                                                        ? 'hover:bg-red-500/10 text-text-muted hover:text-red-500' 
                                                        : 'hover:bg-green-500/10 text-text-muted hover:text-green-500'
                                                    }`}
                                                    title={f.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                                >
                                                    {f.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenu(activeMenu === f.id ? null : f.id)}
                                                        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${activeMenu === f.id ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    <AnimatePresence>
                                                        {activeMenu === f.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className={`absolute right-0 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 py-2 text-left ${
                                                                        index >= filteredFreelancers.length - 2 && filteredFreelancers.length > 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                                                                    }`}
                                                                >
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <Eye size={16} /> View Portfolio
                                                                    </button>
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <FileText size={16} /> View Reviews
                                                                    </button>
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    <button 
                                                                        onClick={() => { handleAction(f.id, f.status === 'Active' ? 'suspend' : 'activate'); setActiveMenu(null); }}
                                                                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${f.status === 'Active' ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                                                                    >
                                                                        {f.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                                                        {f.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
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

                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">Showing {filteredFreelancers.length} of {freelancers.length} results</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-text-muted hover:text-white disabled:opacity-30" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-black text-xs font-bold">1</button>
                        <button className="p-2 text-text-muted hover:text-white">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Freelancers;
