import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    DollarSign,
    CreditCard,
    ArrowUpRight,
    Download,
    Filter,
    Loader2,
    Calendar,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const Payments = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalSpent: 0,
        activeEscrow: 0,
        lastMonthSpent: 0
    });

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

    useEffect(() => {
        const fetchPaymentData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Using dashboard data to simulate payment stats if specific endpoint doesn't exist
                    setStats({
                        totalSpent: data.stats?.totalSpent || 0,
                        activeEscrow: data.stats?.activeJobs * 5000 || 0, // Mocking escrow for now
                        lastMonthSpent: (data.stats?.totalSpent || 0) * 0.3
                    });
                    // For now keeping transactions empty or mock
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching payment data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    const StatusBadge = ({ status }) => {
        const styles = {
            paid: 'bg-green-500/10 text-green-400 border-green-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${styles[status] || styles.pending} uppercase tracking-widest`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-4 pb-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Payments</h1>
                    <p className="text-text-muted text-sm font-medium">Manage your billing, invoices and spending history</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all uppercase tracking-wider text-[10px]">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
                >
                    <div className="absolute -right-2 -top-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign size={80} />
                    </div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Total Investment</p>
                    <h3 className="text-2xl font-black text-white">{formatCurrency(stats.totalSpent)}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-green-400">
                        <TrendingUp size={12} className="inline" /> +12%
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
                >
                    <div className="absolute -right-2 -top-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={80} />
                    </div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Active Escrow</p>
                    <h3 className="text-2xl font-black text-white">{formatCurrency(stats.activeEscrow)}</h3>
                    <p className="mt-2 text-[10px] font-bold text-text-muted/60 italic">Secured funds</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
                >
                    <div className="absolute -right-2 -top-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CreditCard size={80} />
                    </div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Monthly Spending</p>
                    <h3 className="text-2xl font-black text-white">{formatCurrency(stats.lastMonthSpent)}</h3>
                    <p className="mt-2 text-[10px] font-bold text-text-muted underline cursor-pointer hover:text-white transition-colors">View details</p>
                </motion.div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="p-5 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Transaction History</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-primary/30 transition-all"
                            />
                        </div>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-text-muted hover:text-white transition-all">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-primary mb-3" size={24} />
                        <p className="text-text-muted font-black uppercase tracking-widest text-[9px]">Syncing...</p>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">Expert</th>
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">Project</th>
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-[13px] font-medium text-white">{formatDate(tx.date)}</td>
                                        <td className="p-4 text-[13px] font-bold text-white">{tx.expert}</td>
                                        <td className="p-4 text-[12px] text-text-muted truncate max-w-[150px]">{tx.description}</td>
                                        <td className="p-4 text-[13px] font-black text-white">{formatCurrency(tx.amount)}</td>
                                        <td className="p-4"><StatusBadge status={tx.status} /></td>
                                        <td className="p-4 text-right">
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                                                <Download size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <Calendar size={32} className="text-text-muted mb-3 opacity-20" />
                        <h3 className="text-base font-bold text-white mb-1">No transactions</h3>
                        <p className="text-text-muted text-[11px] max-w-xs leading-snug">You haven't made any payments yet. Completed transactions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal icon component for simple trending
const TrendingUp = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default Payments;
