import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldAlert, 
    Search, 
    Filter, 
    MoreVertical, 
    Eye, 
    Scale, 
    Clock, 
    AlertTriangle,
    CheckCircle2,
    XCircle,
    User,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

const Disputes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Disputes Data
    const [disputes, setDisputes] = useState([
        { 
            id: 'DISP-7721', 
            project: 'Senior React Developer', 
            client: 'Acme Corp', 
            freelancer: 'John Doe',
            amount: 2500, 
            status: 'Open', 
            priority: 'High',
            openedDate: '2026-03-15' 
        },
        { 
            id: 'DISP-7722', 
            project: 'Logo Design for Startup', 
            client: 'Globex Inc', 
            freelancer: 'Jane Smith',
            amount: 500, 
            status: 'Resolved', 
            priority: 'Medium',
            openedDate: '2026-03-12' 
        },
        { 
            id: 'DISP-7723', 
            project: 'Mobile App Bug Fix', 
            client: 'TechFlow', 
            freelancer: 'Mike Ross',
            amount: 1200, 
            status: 'Escalated', 
            priority: 'Critical',
            openedDate: '2026-03-17' 
        },
    ]);

    const filteredDisputes = disputes.filter(d => {
        const matchesSearch = d.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             d.client.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const priorityColors = {
        'Critical': 'text-red-500 bg-red-500/10 border-red-500/20',
        'High': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'Low': 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-red-500" />
                        Dispute Management
                    </h1>
                    <p className="text-text-muted text-sm italic">Investigate and resolve conflicts between parties</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Project or Client..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[300px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mr-2">
                    <Filter size={16} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Status Filter</span>
                </div>
                
                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Disputes</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <div className="ml-auto flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] text-text-muted font-bold uppercase">3 Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] text-text-muted font-bold uppercase">12 Pending</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Case Info</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Parties Involved</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Moderation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredDisputes.map((dispute) => (
                            <tr key={dispute.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                            {dispute.project}
                                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                        <span className="text-[10px] font-mono text-text-muted tracking-tighter uppercase mt-1">CASE ID: {dispute.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-text-muted uppercase w-8">CLT:</span>
                                            <span className="text-xs text-white underline underline-offset-4 decoration-white/10">{dispute.client}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-text-muted uppercase w-8">FRE:</span>
                                            <span className="text-xs text-white underline underline-offset-4 decoration-white/10">{dispute.freelancer}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-white">₹{dispute.amount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${priorityColors[dispute.priority]}`}>
                                        {dispute.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                            dispute.status === 'Resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            dispute.status === 'Escalated' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            'bg-primary/10 text-primary border-primary/20'
                                        }`}>
                                            {dispute.status}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-text-muted">
                                            <Clock size={10} /> {dispute.openedDate}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => navigate(`/admin/disputes/${dispute.id}`)}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 transition-all font-bold"
                                    >
                                        <Scale size={14} className="text-primary" /> Resolve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resolution Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3x">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} />
                        Escalation Queue
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                        There are 3 critical disputes that have been escalated by the automated system. These require immediate senior admin oversight and manual investigation of chat logs.
                    </p>
                    <button className="mt-4 text-sm font-bold text-primary hover:underline flex items-center gap-2">
                        View Queue <ChevronRight size={16} />
                    </button>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3x">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} />
                        Recently Resolved
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-text-muted">Full refund to client (CASE-901)</span>
                            <span className="text-white font-medium">₹12,400</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-text-muted">Released to freelancer (CASE-882)</span>
                            <span className="text-white font-medium">₹5,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disputes;
