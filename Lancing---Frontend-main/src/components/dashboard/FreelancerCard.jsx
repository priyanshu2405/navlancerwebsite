import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FreelancerCard = ({ freelancer, onHire }) => {
    const navigate = useNavigate();

    if (!freelancer) return null;

    const {
        userId: userInfo,
        title,
        hourlyRate,
        averageRating,
        skills,
        location,
        availabilityStatus,
        experienceLevel
    } = freelancer;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col h-full"
        >
            <div className="relative z-10 space-y-4 flex-1 flex flex-col">
                {/* Header: Photo and Basic Info */}
                <div className="flex items-start gap-3.5">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center">
                            {userInfo?.avatar ? (
                                <img src={userInfo.avatar} alt={userInfo.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-xl font-bold text-primary">{userInfo?.name?.charAt(0) || 'F'}</div>
                            )}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0A] ${availabilityStatus === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-white truncate group-hover:text-primary transition-colors">{userInfo?.name || 'Freelancer'}</h3>
                            <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                        </div>
                        <p className="text-xs text-text-muted truncate font-medium">{title || 'Expert Professional'}</p>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-1.5 py-1 flex-1">
                    {skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-bold text-white/70 border border-white/5 uppercase tracking-wider">
                            {skill}
                        </span>
                    ))}
                    {skills?.length > 3 && (
                        <span className="text-[10px] text-text-muted font-bold ml-1 flex items-center">+{skills.length - 3}</span>
                    )}
                </div>

                {/* Rating & Rate */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-black text-white">{averageRating || '5.0'}</span>
                    </div>
                    <p className="text-sm font-black text-white">₹{hourlyRate || 0}<span className="text-[10px] font-normal text-text-muted">/hr</span></p>
                </div>

                {/* Meta & Action */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={() => navigate(`/profile/${userInfo?._id || freelancer._id}`)}
                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold transition-all text-white uppercase tracking-wider"
                    >
                        Profile
                    </button>
                    <button
                        onClick={onHire}
                        className="flex-1 py-2.5 bg-primary text-black rounded-xl text-[11px] font-black shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                    >
                        Hire
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FreelancerCard;
