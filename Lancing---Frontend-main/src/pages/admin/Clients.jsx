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
    Eye, 
    FileText,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';

const Clients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterVerification, setFilterVerification] = useState('All');
    const [activeMenu, setActiveMenu] = useState(null);
    
    // Mock Data
    const [clients, setClients] = useState([
        { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', verification: 'Verified', spending: '₹45,000', projects: 12, joinDate: '2023-10-15', isSuspicious: false },
        { id: '2', name: 'Sarah Smith', email: 'sarah.s@outlook.com', status: 'Active', verification: 'Unverified', spending: '₹12,400', projects: 4, joinDate: '2023-11-02', isSuspicious: true },
        { id: '3', name: 'Michael Brown', email: 'mbrown@gmail.com', status: 'Suspended', verification: 'Unverified', spending: '₹0', projects: 1, joinDate: '2024-01-20', isSuspicious: false },
        { id: '4', name: 'Emilia Clarke', email: 'emilia@kingdom.com', status: 'Active', verification: 'Verified', spending: '₹1,20,000', projects: 25, joinDate: '2023-08-10', isSuspicious: false },
        { id: '5', name: 'David Wilson', email: 'david.w@tech.co', status: 'Active', verification: 'Verified', spending: '₹85,500', projects: 18, joinDate: '2023-09-25', isSuspicious: false },
    ]);

    const handleAction = (id, action) => {
        if (action === 'suspend') {
            if (window.confirm('Are you sure you want to suspend this client?')) {
                setClients(clients.map(c => c.id === id ? { ...c, status: 'Suspended' } : c));
            }
        } else if (action === 'activate') {
            setClients(clients.map(c => c.id === id ? { ...c, status: 'Active' } : c));
        } else if (action === 'verify') {
            setClients(clients.map(c => c.id === id ? { ...c, verification: 'Verified' } : c));
        } else if (action === 'unverify') {
            setClients(clients.map(c => c.id === id ? { ...c, verification: 'Unverified' } : c));
        }
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             client.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
        const matchesVerification = filterVerification === 'All' || client.verification === filterVerification;
        return matchesSearch && matchesStatus && matchesVerification;
    });

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Client Management</h1>
                    <p className="text-text-muted text-sm">Monitor and manage all platform clients</p>
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
                    value={filterVerification}
                    onChange={(e) => setFilterVerification(e.target.value)}
                >
                    <option value="All" className="bg-zinc-900">All Verification</option>
                    <option value="Verified" className="bg-zinc-900">Verified</option>
                    <option value="Unverified" className="bg-zinc-900">Unverified</option>
                </select>
                
                <button 
                    onClick={() => { setSearchTerm(''); setFilterStatus('All'); setFilterVerification('All'); }}
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
                                        Client Name <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Verification</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Spending</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Projects</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Join Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredClients.map((client, index) => (
                                    <motion.tr 
                                        key={client.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    {client.name}
                                                    {client.isSuspicious && (
                                                        <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-red-500/20">
                                                            <AlertCircle size={10} /> Risk Flag
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-text-muted">{client.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                client.status === 'Active' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {client.verification === 'Verified' ? (
                                                    <span className="flex items-center gap-1.5 text-xs text-primary font-bold">
                                                        <ShieldCheck size={14} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs text-text-muted font-bold opacity-50">
                                                        <ShieldAlert size={14} /> Unverified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{client.spending}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{client.projects}</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">{client.joinDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleAction(client.id, client.status === 'Active' ? 'suspend' : 'activate')}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        client.status === 'Active' 
                                                        ? 'hover:bg-red-500/10 text-text-muted hover:text-red-500' 
                                                        : 'hover:bg-green-500/10 text-text-muted hover:text-green-500'
                                                    }`}
                                                    title={client.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                                >
                                                    {client.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(client.id, client.verification === 'Verified' ? 'unverify' : 'verify')}
                                                    className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-all"
                                                    title={client.verification === 'Verified' ? 'Mark as Unverified' : 'Verify Account'}
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                                                        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${activeMenu === client.id ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    <AnimatePresence>
                                                        {activeMenu === client.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className={`absolute right-0 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 py-2 ${
                                                                        index >= filteredClients.length - 2 && filteredClients.length > 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                                                                    }`}
                                                                >
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <Eye size={16} /> View Profile
                                                                    </button>
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <FileText size={16} /> View Projects
                                                                    </button>
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    <button 
                                                                        onClick={() => { handleAction(client.id, client.status === 'Active' ? 'suspend' : 'activate'); setActiveMenu(null); }}
                                                                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${client.status === 'Active' ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                                                                    >
                                                                        {client.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                                                        {client.status === 'Active' ? 'Suspend Client' : 'Activate Client'}
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

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">Showing {filteredClients.length} of {clients.length} results</span>
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

export default Clients;
