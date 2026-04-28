import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Bot, Code, User, Edit2, Trash2, Reply, Flag, Send, X, MessageSquare } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';
import { formatDistanceToNow } from 'date-fns';

const Reviews = ({ userId }) => {
    const { reviews, loading, fetchUserReviews, deleteReview, replyToReview, reportReview } = useReviews();
    const { user: currentUser } = useAuth();

    const [editingReview, setEditingReview] = useState(null);
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [reportingId, setReportingId] = useState(null);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        if (userId) {
            fetchUserReviews(userId);
        }
    }, [userId, fetchUserReviews]);

    const handleReplySubmit = async (reviewId) => {
        if (!replyContent.trim()) return;
        const result = await replyToReview(reviewId, replyContent);
        if (result.success) {
            setReplyingToId(null);
            setReplyContent('');
        }
    };

    const handleReportSubmit = async (reviewId) => {
        if (!reportReason.trim()) return;
        const result = await reportReview(reviewId, reportReason);
        if (result.success) {
            setReportingId(null);
            setReportReason('');
            alert('Review reported successfully.');
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            await deleteReview(reviewId);
        }
    };

    // Fallback static reviews for landing page or when no userId is provided
    const staticReviews = [
        {
            _id: 'static-1',
            comment: "Rick is a fantastic AI/ML engineer with specialization in LLMs, delivering end-to-end solutions. We had a few concepts when we started the work; ultimately, he delivered a working solution.",
            rating: 5,
            fromUser: { name: "Richard C." },
            createdAt: "2024-03-28T10:00:00Z",
            contractId: { jobId: { title: "AI SERVICES" } }
        },
        {
            _id: 'static-2',
            comment: "Exceptional UI/UX design. The team really understood our vision and translated it into a beautiful, functional product.",
            rating: 5,
            fromUser: { name: "Sarah J." },
            createdAt: "2024-04-05T14:30:00Z",
            contractId: { jobId: { title: "DESIGN" } }
        },
        {
            _id: 'static-3',
            comment: "Reliable and fast delivery. The backend integration was seamless and handled our scale perfectly.",
            rating: 5,
            fromUser: { name: "Michael T." },
            createdAt: "2024-04-12T09:15:00Z",
            contractId: { jobId: { title: "BACKEND" } }
        }
    ];

    const displayReviews = userId ? reviews : staticReviews;

    if (userId && !loading && displayReviews.length === 0) {
        return (
            <section className="py-12 px-[5%] bg-bg-dark text-white">
                <h2 className="text-2xl font-bold mb-8">Reviews</h2>
                <div className="p-8 bg-white/5 rounded-2xl border border-white/10 text-center text-text-muted">
                    <p>No reviews yet.</p>
                </div>
            </section>
        );
    }

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={`${i < count ? 'fill-primary text-primary' : 'text-gray-600'}`} />
        ));
    };

    return (
        <section className="py-24 px-[5%] bg-bg-dark text-white overflow-hidden">
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold mb-16 relative inline-block">
                {userId ? 'Client Reviews' : 'Real results from clients'}
            </h2>

            {loading ? (
                <div className="flex gap-6 overflow-x-auto pb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="min-w-[350px] h-[350px] bg-white/5 rounded-[20px] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-[5%] px-[5%]">
                    {displayReviews.map((review, index) => {
                        const isAuthor = currentUser?._id === review.fromUser?._id;
                        const isTarget = currentUser?._id === review.toUserId;

                        return (
                            <motion.div
                                key={review._id || index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="min-w-[350px] md:min-w-[450px] bg-[#1a1a1a] rounded-[24px] p-8 flex flex-col justify-between snap-center border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-xl"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <Code size={18} className="text-primary" />
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                                                {review.contractId?.jobId?.title || "PROJECT REVIEW"}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {isAuthor && (
                                                <>
                                                    <button onClick={() => setEditingReview(review)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(review._id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-full transition-colors text-text-muted hover:text-red-400">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                            {isTarget && !review.reply && (
                                                <button onClick={() => setReplyingToId(review._id)} className="p-2 bg-white/5 hover:bg-primary/10 rounded-full transition-colors text-text-muted hover:text-primary">
                                                    <Reply size={14} />
                                                </button>
                                            )}
                                            {!isAuthor && (
                                                <button onClick={() => setReportingId(review._id)} className="p-2 bg-white/5 hover:bg-yellow-500/10 rounded-full transition-colors text-text-muted hover:text-yellow-400">
                                                    <Flag size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-[1.05rem] leading-relaxed mb-6 font-medium text-gray-200">
                                        "{review.comment}"
                                    </p>

                                    <div className="flex gap-1 mb-8">
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* Display Reply */}
                                    {review.reply && (
                                        <div className="mt-4 p-4 bg-white/5 rounded-2xl border-l-2 border-primary/50 mb-6">
                                            <div className="flex items-center gap-2 mb-2 text-primary">
                                                <MessageSquare size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Reply from {review.toUser?.name || 'Freelancer'}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 italic">"{review.reply}"</p>
                                        </div>
                                    )}

                                    {/* Inline Reply Form */}
                                    <AnimatePresence>
                                        {replyingToId === review._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="mt-4 mb-6"
                                            >
                                                <div className="relative">
                                                    <textarea
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder="Write a reply..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-12 text-sm text-white focus:border-primary/50 outline-none resize-none h-20"
                                                    />
                                                    <button
                                                        onClick={() => handleReplySubmit(review._id)}
                                                        className="absolute bottom-3 right-3 p-2 bg-primary text-black rounded-lg hover:bg-white transition-colors"
                                                    >
                                                        <Send size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => setReplyingToId(null)} className="text-[10px] text-text-muted hover:text-white mt-1 uppercase font-bold tracking-widest flex items-center gap-1">
                                                    <X size={10} /> Cancel
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Inline Report Form */}
                                    <AnimatePresence>
                                        {reportingId === review._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="mt-4 mb-6 p-4 bg-red-400/5 border border-red-500/20 rounded-2xl"
                                            >
                                                <p className="text-[10px] text-red-400 font-bold uppercase mb-2">Report Review</p>
                                                <input
                                                    type="text"
                                                    value={reportReason}
                                                    onChange={(e) => setReportReason(e.target.value)}
                                                    placeholder="Reason (e.g. Offensive, Fake, Spam)"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white mb-2 outline-none focus:border-red-500/50"
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleReportSubmit(review._id)} className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase">Submit Report</button>
                                                    <button onClick={() => setReportingId(null)} className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg uppercase">Cancel</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                    <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                                        <User className="text-white/20" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">
                                            {review.fromUser?.name || 'Anonymous Client'}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-medium">
                                            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal */}
            <ReviewModal
                isOpen={!!editingReview}
                onClose={() => setEditingReview(null)}
                review={editingReview}
                onReviewSubmitted={() => {
                    setEditingReview(null);
                    fetchUserReviews(userId);
                }}
            />

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default Reviews;

