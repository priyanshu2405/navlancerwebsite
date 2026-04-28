import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, MessageSquare, Briefcase } from 'lucide-react';

const HireExpertModal = ({ isOpen, onClose, expert }) => {
    if (!expert) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#050505cc] backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                    {expert.userId?.avatar ? (
                                        <img src={expert.userId.avatar} alt={expert.userId.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-2xl font-bold text-primary">{expert.userId?.name?.charAt(0) || 'E'}</div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Hire {expert.userId?.name}</h2>
                                    <p className="text-primary text-sm font-bold uppercase tracking-wider">{expert.title}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="text-text-muted" size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 pt-4 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Hourly Rate</p>
                                    <p className="text-xl font-black text-white">₹{expert.hourlyRate || 0}</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Response Time</p>
                                    <p className="text-xl font-black text-white">~2 Hours</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-text-muted">
                                    <Calendar size={18} className="text-primary" />
                                    <span className="text-sm font-medium">Available for new projects immediately</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-muted">
                                    <Briefcase size={18} className="text-primary" />
                                    <span className="text-sm font-medium">15+ Projects completed successfully</span>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button className="w-full py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                                    Send Hiring Offer
                                </button>
                                <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare size={18} />
                                    Chat with Expert
                                </button>
                            </div>
                        </div>

                        {/* Footer decorative */}
                        <div className="h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HireExpertModal;
