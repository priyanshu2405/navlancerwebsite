import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, 
    Link, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Wallet, 
    TrendingUp, 
    RefreshCcw, 
    Percent, 
    Search, 
    Filter,
    ChevronRight,
    Download,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    FileText,
    ShieldCheck
} from 'lucide-react';

const Financials = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = ['Overview', 'Payments', 'Escrow', 'Withdrawals', 'Refunds', 'Commission'];

    // Mock Stats
    const stats = [
        { label: 'Total Revenue', value: '₹45,20,500', icon: TrendingUp, color: 'text-green-500', trend: '+12.5%' },
        { label: 'In Escrow', value: '₹12,80,000', icon: ShieldCheck, color: 'text-blue-500', trend: '85 active contracts' },
        { label: 'Platform Commission', value: '₹4,52,050', icon: Percent, color: 'text-primary', trend: '10% avg rate' },
        { label: 'Pending Payouts', value: '₹2,15,400', icon: Wallet, color: 'text-orange-500', trend: '14 requests' }
    ];

    // Mock Transactions
    const [transactions, setTransactions] = useState([
        { id: 'TXN-9901', type: 'Payment', user: 'Acme Corp', amount: 5000, status: 'Completed', date: '2026-03-18', method: 'Stripe' },
        { id: 'TXN-9902', type: 'Withdrawal', user: 'John Doe', amount: 3200, status: 'Pending', date: '2026-03-18', method: 'Bank Transfer' },
        { id: 'TXN-9903', type: 'Refund', user: 'Jane Smith', amount: 1500, status: 'Processing', date: '2026-03-17', method: 'Wallet' },
        { id: 'TXN-9904', type: 'Payment', user: 'Globex Inc', amount: 12000, status: 'Completed', date: '2026-03-16', method: 'Razorpay' },
        { id: 'TXN-9905', type: 'Escrow Release', user: 'Dev Guru', amount: 8000, status: 'Completed', date: '2026-03-16', method: 'Internal' },
    ]);

    const filteredTxns = transactions.filter(t => {
        const matchesSearch = t.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'Overview' || activeTab === 'Payments' && t.type === 'Payment' || 
                          activeTab === 'Withdrawals' && t.type === 'Withdrawal' || 
                          activeTab === 'Refunds' && t.type === 'Refund' ||
                          activeTab === 'Escrow' && t.type === 'Escrow Release';
        return matchesSearch && (activeTab === 'Overview' || matchesTab);
    });

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <DollarSign className="text-primary" />
                        Financial Management
                    </h1>
                    <p className="text-text-muted text-sm italic">Monitor transactions, escrow, and platform earnings</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white hover:bg-white/10 transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-[250px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3">
                            <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-lg bg-white/[0.03] ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {activeTab === 'Commission' ? (
                    <div className="p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Percent className="text-primary" size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Platform Commission Analytics</h2>
                        <p className="text-text-muted max-w-md mx-auto">View detailed breakdown of earnings from all project categories and individual project commissions here.</p>
                        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-all">
                            Generate Commission Report
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">User</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Method</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTxns.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase">{txn.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {txn.type === 'Payment' || txn.type === 'Escrow Release' ? (
                                                    <ArrowUpRight size={14} className="text-green-500" />
                                                ) : (
                                                    <ArrowDownLeft size={14} className="text-red-500" />
                                                )}
                                                <span className="text-xs text-white font-medium">{txn.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                                    <User size={12} className="text-text-muted" />
                                                </div>
                                                <span className="text-xs text-white underline underline-offset-4 decoration-white/10 cursor-pointer hover:decoration-primary transition-all">{txn.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${txn.type === 'Withdrawal' || txn.type === 'Refund' ? 'text-white' : 'text-primary'}`}>
                                                {txn.type === 'Withdrawal' || txn.type === 'Refund' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                txn.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                txn.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                'bg-white/5 text-text-muted border-white/10'
                                            }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-text-muted flex items-center gap-1">
                                            <Clock size={12} /> {txn.date}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-bold text-text-muted uppercase bg-white/5 px-2 py-1 rounded border border-white/5">
                                                {txn.method}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Quick Actions Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-zinc-900 border border-white/10 p-6 rounded-3xl hover:border-primary/50 transition-all cursor-pointer">
                    <h3 className="text-white font-bold mb-2 flex items-center justify-between">
                        Process Payouts
                        <ChevronRight className="text-text-muted group-hover:text-primary transition-all" size={20} />
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">System has 14 pending requests waiting for your manual approval before bank transfer.</p>
                </div>
                <div className="group bg-zinc-900 border border-white/10 p-6 rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer">
                    <h3 className="text-white font-bold mb-2 flex items-center justify-between">
                        Escrow Reconcile
                        <ChevronRight className="text-text-muted group-hover:text-blue-500 transition-all" size={20} />
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">Ensure all escrow balances match active project contracts and platform liabilities.</p>
                </div>
                <div className="group bg-zinc-900 border border-white/10 p-6 rounded-3xl hover:border-red-500/50 transition-all cursor-pointer">
                    <h3 className="text-white font-bold mb-2 flex items-center justify-between">
                        Refund Requests
                        <ChevronRight className="text-text-muted group-hover:text-red-500 transition-all" size={20} />
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">3 payment disputes have requested full refunds. Requires high-priority investigation.</p>
                </div>
            </div>
        </div>
    );
};

export default Financials;
