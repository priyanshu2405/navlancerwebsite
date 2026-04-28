import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Users } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
    const { id, title, hourlyRateMin, hourlyRateMax, hiredThisMonth, budget, avatars } = job;
    const navigate = useNavigate();

    const handleCardClick = () => {
        const isAuthenticated = !!localStorage.getItem('token');
        if (!isAuthenticated) {
            navigate('/signup');
        } else {
            navigate(`/jobs/${id}`);
        }
    };

    return (
        <motion.div
            onClick={handleCardClick}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
            className="bg-bg-card border border-border-dark rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:border-primary/50"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-main group-hover:text-primary transition-colors duration-200">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-text-muted text-sm font-medium">
                        <span className="bg-[#333] px-2 py-1 rounded text-text-main text-xs">
                            Hourly
                        </span>
                        <span>
                            ${hourlyRateMin} – ${hourlyRateMax} / hr
                        </span>
                    </div>
                </div>

                {/* Avatars */}
                {avatars && avatars.length > 0 && (
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                        {avatars.slice(0, 3).map((avatar, index) => (
                            <img
                                key={index}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                                src={avatar}
                                alt={`Hiring Manager ${index + 1}`}
                            />
                        ))}
                        {avatars.length > 3 && (
                            <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">
                                +{avatars.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dotted border-border-dark mt-auto">
                <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1.5" title="Hired this month">
                        <Users size={16} />
                        <span>{hiredThisMonth} hired</span>
                    </div>
                    {budget && (
                        <div className="flex items-center gap-1.5" title="Total Budget">
                            <DollarSign size={16} />
                            <span>${budget.toLocaleString()} est.</span>
                        </div>
                    )}
                </div>

                <div className="text-xs text-text-muted">
                    <Clock size={14} className="inline mr-1" />
                    Posted 2h ago
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
