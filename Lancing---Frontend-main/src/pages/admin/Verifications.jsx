import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    FileText, 
    User, 
    Calendar,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';

const Verifications = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [searchTerm, setSearchTerm] = useState('');

    const [requests, setRequests] = useState([
        { id: '1', name: 'John Doe', role: 'Client', docType: 'Aadhar Card', date: '2024-03-15', status: 'Pending', docUrl: '#' },
        { id: '2', name: 'Monica Geller', role: 'Freelancer', docType: 'PAN Card', date: '2024-03-14', status: 'Pending', docUrl: '#' },
        { id: '3', name: 'Sarah Smith', role: 'Client', docType: 'Passport', date: '2024-03-10', status: 'Verified', docUrl: '#' },
        { id: '4', name: 'Joey Tribbiani', role: 'Freelancer', docType: 'Driving License', date: '2024-03-12', status: 'Rejected', reason: 'Documents are blurred', docUrl: '#' },
        { id: '5', name: 'Alex Riviera', role: 'Freelancer', docType: 'Aadhar Card', date: '2024-03-08', status: 'Verified', docUrl: '#' },
    ]);

    const handleAction = (id, action) => {
        if (action === 'approve') {
            setRequests(requests.map(r => r.id === id ? { ...r, status: 'Verified' } : r));
        } else if (action === 'reject') {
            const reason = window.prompt('Reason for rejection:');
            if (reason) {
                setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected', reason } : r));
            }
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesTab = r.status === activeTab;
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = [
        { name: 'Pending', icon: <Clock size={16} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Verified', icon: <CheckCircle2 size={16} />, color: 'text-primary', bg: 'bg-primary/10' },
        { name: 'Rejected', icon: <XCircle size={16} />, color: 'text-red-500', bg: 'bg-red-500/10' }
    ];

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Identity Verifications</h1>
                <p className="text-text-muted text-sm mt-1">Review KYC documents and verify user authenticity</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tabs.map(tab => (
                    <div key={tab.name} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{tab.name}</span>
                            <div className={`p-2 rounded-xl ${tab.bg} ${tab.color}`}>
                                {tab.icon}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">
                            {requests.filter(r => r.status === tab.name).length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center bg-white/[0.02] border border-white/5 p-1 rounded-xl w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab.name 
                                ? 'bg-white/5 text-white shadow-xl' 
                                : 'text-text-muted hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[300px] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List / Table */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((r) => (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                {r.name}
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                                                    r.role === 'Client' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                }`}>
                                                    {r.role}
                                                </span>
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                                                <span className="flex items-center gap-1.5"><FileText size={14} /> {r.docType}</span>
                                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Submitted on {r.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {r.status === 'Rejected' && r.reason && (
                                        <div className="flex-1 md:mx-8 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-red-500/80">
                                            <span className="font-bold text-red-500 block mb-1">Rejection Reason:</span>
                                            {r.reason}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all">
                                            <Eye size={16} /> View Docs
                                        </button>
                                        
                                        {activeTab === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(r.id, 'approve')}
                                                    className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(r.id, 'reject')}
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        
                                        {activeTab !== 'Pending' && (
                                            <button 
                                                onClick={() => setActiveTab('Pending')}
                                                className="p-2.5 rounded-xl text-text-muted hover:bg-white/5 transition-all"
                                                title="Move to Pending"
                                            >
                                                <ArrowUpRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted opacity-20">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white/50">No verification requests found</h3>
                            <p className="text-text-muted text-sm px-4">There are no {activeTab.toLowerCase()} requests matching your search.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Verifications;
