import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, MapPin, Briefcase, Star, CheckCircle, Heart } from 'lucide-react';

import { useSavedJobs } from '../../hooks/useSavedJobs';

const FreelancerJobCard = ({ job, onApply, onViewDetails, hasApplied }) => {
    const { savedJobs, saveJob, removeSavedJob } = useSavedJobs();
    
    const jobId = job._id || job.id;
    const isSaved = savedJobs.some(sj => (sj._id || sj.id) === jobId);

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleSaveToggle = (e) => {
        e.stopPropagation(); // Prevents triggering card click if any
        if (isSaved) {
            removeSavedJob(jobId);
        } else {
            saveJob(jobId);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white/5 border rounded-2xl p-6 hover:border-primary/30 transition-all group relative ${hasApplied ? 'border-primary/20' : 'border-white/10'
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                            {job.category || 'General'}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${job.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>
                            {job.status || 'Open'}
                        </span>
                        {hasApplied && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 border border-primary/20">
                                <CheckCircle size={10} /> Applied
                            </span>
                        )}
                        {job.isUrgent && (
                            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded">
                                Urgent
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                    </h3>
                </div>

                <button
                    onClick={handleSaveToggle}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <Heart
                        size={20}
                        className={`${isSaved ? 'fill-red-500 text-red-500' : 'text-text-muted'} transition-colors`}
                    />
                </button>
            </div>

            {/* Description */}
            <p className="text-text-muted text-sm mb-4 line-clamp-2">
                {job.description || 'No description provided'}
            </p>

            {/* Skills/Tags */}
            {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 4).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs text-text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                    {job.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs text-primary">
                            +{job.tags.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Budget and Deadline */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50 text-white">Budget</p>
                        <p className="text-sm font-semibold text-white">₹{job.budget?.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50 text-white">Deadline</p>
                        <p className="text-sm font-semibold text-white">
                            {formatDate(job.expiryDate || job.deadline)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                            {job.clientId?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-white">
                                {job.clientId?.name || 'Client'}
                            </p>
                            {job.clientId?.isVerified && (
                                <CheckCircle size={14} className="text-primary" />
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-text-muted">
                                {job.clientId?.rating?.toFixed(1) || '0.0'} ({job.clientId?.reviewCount || 0})
                            </span>
                        </div>
                    </div>
                </div>

                {job.location && (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={12} />
                        <span>{job.location}</span>
                    </div>
                )}
            </div>

            {/* Proposals Count */}
            <div className="flex items-center gap-2 mb-4">
                <Briefcase size={14} className="text-primary/50" />
                <span className="text-xs text-text-muted">
                    Proposals: <span className="text-white font-medium">{job.proposalsCount || 0}</span>
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => !hasApplied && onApply(job)}
                    disabled={job.status !== 'open' || hasApplied}
                    className={`flex-1 px-4 py-2.5 font-bold rounded-xl transition-all disabled:cursor-not-allowed ${hasApplied
                        ? 'bg-white/10 text-text-muted border border-white/5 opacity-80'
                        : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                        }`}
                >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                </button>
                <button
                    onClick={() => onViewDetails(job)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                    Details
                </button>
            </div>
        </motion.div>
    );
};

export default FreelancerJobCard;
