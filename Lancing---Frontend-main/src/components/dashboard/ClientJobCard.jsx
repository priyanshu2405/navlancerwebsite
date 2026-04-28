import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, Copy, RefreshCw, Calendar, DollarSign, Briefcase } from 'lucide-react';

const ClientJobCard = ({ job, onAction, forceIsDeleted }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isJobDeleted = forceIsDeleted ||
        job.status?.toLowerCase() === 'deleted' ||
        job.status?.toLowerCase() === 'inactive' ||
        job.isDeleted;

    const actions = [
        { label: 'Edit', icon: <Edit2 size={16} />, onClick: () => onAction('edit', job._id || job.id), color: 'text-blue-400', hideOnDeleted: true },
        { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => onAction('duplicate', job._id || job.id), color: 'text-green-400', hideOnDeleted: true },
        { label: 'Reopen', icon: <RefreshCw size={16} />, onClick: () => onAction('reopen', job._id || job.id), color: 'text-orange-400', hideOnDeleted: false },
        { label: 'Delete', icon: <Trash2 size={16} />, onClick: () => onAction('delete', job._id || job.id), color: 'text-red-400', hideOnDeleted: true },
    ].filter(action => !isJobDeleted || !action.hideOnDeleted);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all group relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                            {job.category || 'General'}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${job.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>
                            {job.status || 'Active'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                    </h3>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <MoreVertical size={20} className="text-text-muted" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-bg-dark border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-1">
                                {actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            action.onClick();
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors ${action.color}`}
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-text-muted">
                    <DollarSign size={16} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50 text-white">Budget</p>
                        <p className="text-sm font-semibold text-white">₹{job.budget?.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                    <Calendar size={16} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50 text-white">Expires</p>
                        <p className="text-sm font-semibold text-white">
                            {job.expiryDate ? new Date(job.expiryDate).toLocaleDateString() : 'No date'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-primary/50" />
                    <span className="text-xs text-text-muted">
                        Applied: <span className="text-white font-medium">{job.applications?.length || 0}</span>
                    </span>
                </div>
                <button
                    onClick={() => navigate(`/client/jobs/${job._id || job.id}/proposals`)}
                    className="text-xs font-bold text-primary hover:underline underline-offset-4"
                >
                    View Details →
                </button>
            </div>
        </motion.div>
    );
};

export default ClientJobCard;
