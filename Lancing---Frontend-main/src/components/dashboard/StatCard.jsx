import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color, loading }) => {
    return (
        <motion.div
            className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
            whileHover={{ y: -5 }}
        >
            {/* Background Icon */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                {Icon && <Icon size={80} />}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${color || 'text-primary'}`}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-xs font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded-lg">
                        <TrendingUp size={12} />
                        {trend}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-text-muted text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
                {loading ? (
                    <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                ) : (
                    <p className="text-3xl font-black text-white">{value}</p>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
