import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, Search, Briefcase } from 'lucide-react';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import FreelancerJobCard from '../../components/dashboard/FreelancerJobCard';

const SavedJobs = () => {
    const navigate = useNavigate();
    const { savedJobs, loading, error, refetch } = useSavedJobs();

    const handleViewDetails = (job) => {
        navigate(`/freelancer/jobs/${job._id || job.id}`);
    };

    const handleApply = (job) => {
        // Since we are reusing the card, we might need to handle apply here too
        // or just let it redirect to details for application
        navigate(`/freelancer/jobs/${job._id || job.id}`);
    };

    return (
        <div className="w-full space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Saved Jobs</h1>
                <p className="text-text-muted text-lg font-medium">
                    Manage the opportunities you've bookmarked for later
                </p>
            </div>

            {/* Content Area */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-primary mb-6" size={56} />
                        <p className="text-text-muted text-sm font-black uppercase tracking-[0.3em]">Loading your picks...</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="mt-8 p-24 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center bg-white/5">
                        <div className="p-6 bg-red-500/20 rounded-full mb-6">
                            <Heart className="text-red-500" size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">No saved jobs yet</h2>
                        <p className="text-text-muted mb-8 max-w-sm leading-relaxed font-medium">
                            Explore available projects and bookmark the ones that catch your eye. Your future career starts here.
                        </p>
                        <button
                            onClick={() => navigate('/freelancer/browse-jobs')}
                            className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Browse Projects
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {savedJobs.map((job) => (
                                <FreelancerJobCard
                                    key={job._id || job.id}
                                    job={job}
                                    onApply={handleApply}
                                    onViewDetails={handleViewDetails}
                                    hasApplied={false} // We can enhance this later to check application status
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
