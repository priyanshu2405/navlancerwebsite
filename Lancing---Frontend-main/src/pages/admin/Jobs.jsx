import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Briefcase,
    ExternalLink,
    Archive,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Calendar,
    User,
    Tag,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Trash2,
    AlertCircle
} from 'lucide-react';

const Jobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [activeMenu, setActiveMenu] = useState(null);

    // Mock Data based on useJobs structure but expanded for Admin view with requested statuses
    const [jobs, setJobs] = useState([
        { 
            id: 'JH-9021', 
            title: 'Senior React Developer', 
            client: 'Acme Corp', 
            category: 'Development', 
            budget: 5000, 
            proposals: 12, 
            postedDate: '2026-03-10', 
            status: 'Open' 
        },
        { 
            id: 'JH-8832', 
            title: 'UX/UI Designer for Fintech', 
            client: 'Globex Inc', 
            category: 'Design', 
            budget: 3200, 
            proposals: 5, 
            postedDate: '2026-03-12', 
            status: 'In Progress' 
        },
        { 
            id: 'JH-7721', 
            title: 'E-commerce Mobile App', 
            client: 'QuickSell', 
            category: 'Development', 
            budget: 12000, 
            proposals: 45, 
            postedDate: '2026-03-11', 
            status: 'Disputed' 
        },
        { 
            id: 'JH-6612', 
            title: 'Video Editor (reels/shorts)', 
            client: 'Umbrella Corp', 
            category: 'Video', 
            budget: 1500, 
            proposals: 18, 
            postedDate: '2026-03-15', 
            status: 'Completed' 
        },
        { 
            id: 'JH-5501', 
            title: 'Draft Website Content', 
            client: 'WordSmiths', 
            category: 'Writing', 
            budget: 500, 
            proposals: 0, 
            postedDate: '2026-03-16', 
            status: 'Draft' 
        },
        { 
            id: 'JH-4490', 
            title: 'Cancelled Logo Design', 
            client: 'Unknown', 
            category: 'Design', 
            budget: 200, 
            proposals: 2, 
            postedDate: '2026-03-09', 
            status: 'Cancelled' 
        },
    ]);

    const handleAction = (id, action) => {
        if (action === 'delete') {
            if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                setJobs(jobs.filter(j => j.id !== id));
            }
        } else if (action === 'approve') {
            setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Open' } : j));
            alert('Project approved and listed.');
        } else if (action === 'reject') {
            setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Cancelled' } : j));
            alert('Project rejected.');
        }
    };

    const filteredJobs = jobs.filter(j => {
        const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             j.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             j.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || j.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || j.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const statusColors = {
        'Draft': 'bg-white/5 text-text-muted border-white/10',
        'Open': 'bg-green-500/10 text-green-500 border-green-500/20',
        'In Progress': 'bg-primary/10 text-primary border-primary/20',
        'Completed': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
        'Disputed': 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    };

    const categories = ['Development', 'Design', 'Video', 'Writing', 'Marketing'];

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Briefcase className="text-primary" />
                        Project Management
                    </h1>
                    <p className="text-text-muted text-sm italic">Oversee, moderate and manage all platform listings</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by title, client or ID..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[300px] transition-all"
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
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Moderation Filters</span>
                </div>
                
                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    {Object.keys(statusColors).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <select 
                    className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/30 cursor-pointer"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                
                <button 
                    onClick={() => { setSearchTerm(''); setFilterStatus('All'); setFilterCategory('All'); }}
                    className="text-xs font-bold text-primary hover:underline ml-auto"
                >
                    Reset Dashboard
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Project Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Client</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Budget</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredJobs.map((job, index) => (
                                    <motion.tr 
                                        key={job.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span 
                                                    onClick={() => navigate(`/admin/projects/${job.id}`)}
                                                    className="text-sm font-bold text-white group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                                                >
                                                    {job.title}
                                                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                                <span className="text-[10px] font-mono text-text-muted tracking-tighter uppercase mt-1">ID: {job.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User size={12} className="text-primary" />
                                                </div>
                                                <span className="text-xs text-white font-medium">{job.client}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-text-muted">
                                                <Tag size={10} />
                                                {job.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-white">₹{job.budget.toLocaleString()}</span>
                                            <div className="text-[10px] text-text-muted mt-0.5">{job.proposals} Proposals</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColors[job.status]}`}>
                                                    {job.status}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                                                    <Clock size={10} />
                                                    {job.postedDate}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {job.status === 'Draft' ? (
                                                    <button 
                                                        onClick={() => handleAction(job.id, 'approve')}
                                                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                ) : null}
                                                <button 
                                                    onClick={() => navigate(`/admin/projects/${job.id}`)}
                                                    className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                                                        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${activeMenu === job.id ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    <AnimatePresence>
                                                        {activeMenu === job.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className={`absolute right-0 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-30 py-2 text-left ${
                                                                        index >= filteredJobs.length - 2 && filteredJobs.length > 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                                                                    }`}
                                                                >
                                                                    <button 
                                                                        onClick={() => navigate(`/admin/projects/${job.id}`)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                                                                    >
                                                                        <Eye size={16} /> View Details
                                                                    </button>
                                                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                                        <FileText size={16} /> Edit Listing
                                                                    </button>
                                                                    {job.status === 'Disputed' && (
                                                                        <button 
                                                                            onClick={() => navigate(`/admin/disputes/${job.id}`)}
                                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
                                                                        >
                                                                            <AlertCircle size={16} /> Resolve Dispute
                                                                        </button>
                                                                    )}
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    <button 
                                                                        onClick={() => { handleAction(job.id, 'reject'); setActiveMenu(null); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
                                                                    >
                                                                        <XCircle size={16} /> Force Reject
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => { handleAction(job.id, 'delete'); setActiveMenu(null); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} /> Delete Project
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
            </div>
            
            {/* Quick Stats Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Marketplace Value</p>
                    <p className="text-2xl font-black text-white">₹14,50,000</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Active Projects</p>
                    <p className="text-2xl font-black text-white">{jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Resolved Issues</p>
                    <p className="text-2xl font-black text-white">128</p>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
