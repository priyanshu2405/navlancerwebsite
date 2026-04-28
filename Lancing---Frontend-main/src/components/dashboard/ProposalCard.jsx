import React from 'react';
import { motion } from 'framer-motion';
import { User, IndianRupee, Calendar, Check, X, FileText, Download } from 'lucide-react';

const ProposalCard = ({ proposal, onHire, onReject, onChat, onViewContract, isProcessing, hideContractActions = false }) => {
    const { _id, freelancerId, price, coverLetter, createdAt, status, attachments } = proposal;
    // Backend returns freelancerId as a populated object: { _id, name, email }
    const freelancerName = (typeof freelancerId === 'object' ? freelancerId?.name : null)
        || proposal.freelancerName
        || 'Freelancer';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white/5 border rounded-2xl p-6 transition-all group relative ${status === 'rejected' ? 'opacity-50 grayscale border-white/5' : 'border-white/10 hover:border-primary/30'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/20">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {freelancerName || 'Freelancer'}
                        </h3>
                        <p className="text-xs text-text-muted">
                            Submitted on {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-primary font-bold text-xl">
                        <IndianRupee size={20} />
                        <span>{price?.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Bidding Price</span>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {coverLetter}
                </p>
            </div>

            {attachments && attachments.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {attachments.map((file, idx) => (
                        <a
                            key={idx}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-text-muted hover:bg-white/10 hover:text-white transition-all"
                        >
                            <FileText size={14} />
                            <span className="truncate max-w-[150px]">{file.fileName}</span>
                            <Download size={14} className="ml-1 opacity-50" />
                        </a>
                    ))}
                </div>
            )}

            {status === 'pending' ? (
                <div className="pt-4 border-t border-white/5 flex gap-4">
                    <button
                        onClick={() => onReject(_id)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        <X size={18} />
                        Reject
                    </button>
                    <button
                        onClick={() => onHire(_id)}
                        disabled={isProcessing}
                        className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50"
                    >
                        <Check size={18} />
                        Hire Now
                    </button>
                </div>
            ) : status === 'accepted' ? (
                hideContractActions ? (
                    <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                        <Check size={16} className="text-green-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-green-400">Hired</span>
                    </div>
                ) : (
                    <div className="pt-4 border-t border-white/5 flex gap-3">
                        <button
                            onClick={() => onChat && onChat(proposal)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10"
                        >
                            <Check size={18} className="text-green-500" />
                            Chat
                        </button>
                        <button
                            onClick={() => onViewContract && onViewContract(proposal)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-500 rounded-xl text-sm font-bold hover:bg-blue-500/20 transition-all border border-blue-500/20"
                        >
                            <FileText size={18} />
                            Contract
                        </button>
                    </div>
                )
            ) : (
                <div className="pt-4 border-t border-white/5 text-center py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold uppercase tracking-widest text-text-muted italic">
                    Rejected
                </div>
            )}
        </motion.div>
    );
};

export default ProposalCard;
