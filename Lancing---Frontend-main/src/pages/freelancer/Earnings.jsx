import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    Clock,
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Filter,
    Loader2,
    Briefcase
} from 'lucide-react';
import { useEarnings } from '../../hooks/useEarnings';

const Earnings = () => {
    const { stats, loading } = useEarnings();
    const [dateFilter, setDateFilter] = useState('all');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            completed: 'bg-green-500/10 text-green-500 border-green-500/20',
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            failed: 'bg-red-500/10 text-red-500 border-red-500/20'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending} uppercase tracking-wider`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted">Loading earnings...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Earnings</h1>
                    <p className="text-text-muted text-lg">
                        Track your income, pending payments, and transaction history
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => alert('Withdrawal feature coming soon!')}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
                    >
                        <ArrowUpRight size={20} /> Withdraw Funds
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <TrendingUp size={20} />
                        </div>
                        Total Earnings
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {formatCurrency(stats.totalEarnings)}
                    </div>
                    <div className="text-sm text-text-muted">Lifetime income on Navlancer</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Briefcase size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Briefcase size={20} />
                        </div>
                        Completed Jobs
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {stats.completedContracts || 0}
                    </div>
                    <div className="text-sm text-text-muted">Successfully delivered</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Clock size={20} />
                        </div>
                        Active Contracts
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {stats.activeContracts || 0}
                    </div>
                    <div className="text-sm text-text-muted">Currently in progress</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowUpRight size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <ArrowUpRight size={20} />
                        </div>
                        Proposals Sent
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {stats.totalProposals || 0}
                    </div>
                    <div className="text-sm text-text-muted">Total applications submitted</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                            <Clock size={20} />
                        </div>
                        Pending Clearance
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {formatCurrency(stats.pendingClearance)}
                    </div>
                    <div className="text-sm text-text-muted">Available within 5-7 days</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-text-muted font-bold text-sm uppercase tracking-wider">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Wallet size={20} />
                        </div>
                        Available to Withdraw
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {formatCurrency(stats.available)}
                    </div>
                    <div className="text-sm text-text-muted">Ready to cash out</div>
                </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Transaction History
                    </h2>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                            <Filter size={16} className="text-text-muted" /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                            <Download size={16} className="text-text-muted" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 text-left">
                            <tr>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest">Date</th>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest">Client</th>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest">Description</th>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest">Amount</th>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest">Status</th>
                                <th className="p-6 text-xs font-black text-text-muted uppercase tracking-widest text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.transactions.length > 0 ? (
                                stats.transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-sm font-medium text-white whitespace-nowrap">
                                            {formatDate(tx.date)}
                                        </td>
                                        <td className="p-6 text-sm font-bold text-white">
                                            {tx.client}
                                        </td>
                                        <td className="p-6 text-sm text-text-muted">
                                            {tx.description}
                                        </td>
                                        <td className="p-6 font-bold text-white whitespace-nowrap flex items-center gap-1">
                                            <span className="text-green-500"><ArrowDownLeft size={16} /></span>
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="p-6">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colspan="6" className="p-12 text-center text-text-muted font-medium">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Earnings;
