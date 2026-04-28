import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserSquare2, Building2, LayoutTemplate, CheckCircle2, DollarSign, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, change }) => {
    const isPositive = change >= 0;

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-b from-[#111] to-[#0d0d0d] border border-white/10 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-primary/40 hover:shadow-[0_4px_30px_rgba(204,255,0,0.15)] transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-medium text-text-muted/80">{title}</h3>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/20 transition-all duration-300">
                    <Icon size={18} />
                </div>
            </div>
            
            <div className="mb-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
            </div>
            
            <div className="flex items-center gap-2">
                <div className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                    isPositive 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{isPositive ? '+' : ''}{change}%</span>
                </div>
                <span className="text-xs text-text-muted/60 font-medium">vs last month</span>
            </div>
        </motion.div>
    );
};

const AdminAnalytics = () => {
    const kpiData = [
        { title: 'Total Users', value: '12,450', change: 12.5, icon: Users },
        { title: 'Total Freelancers', value: '3,840', change: 8.2, icon: UserSquare2 },
        { title: 'Total Clients', value: '8,610', change: 15.3, icon: Building2 },
        { title: 'Active Projects', value: '1,245', change: -2.4, icon: LayoutTemplate },
        { title: 'Completed Projects', value: '45,892', change: 24.8, icon: CheckCircle2 },
        { title: 'Total Revenue', value: '₹4.2M', change: 18.1, icon: DollarSign },
        { title: 'Pending Payments', value: '₹145K', change: -5.4, icon: Clock },
        { title: 'Disputes', value: '24', change: -12.5, icon: AlertTriangle },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-text-muted text-sm pb-4 border-b border-white/10">Platform performance overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <KPICard 
                        key={index}
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change}
                        icon={kpi.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminAnalytics;
