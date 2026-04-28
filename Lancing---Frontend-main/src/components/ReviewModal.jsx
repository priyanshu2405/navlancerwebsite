import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Loader2, CheckCircle } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';

const ReviewModal = ({ isOpen, onClose, contractId, toUserId, review, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const { submitReview, editReview } = useReviews();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (review) {
            setRating(review.rating || 0);
            setComment(review.comment || '');
        } else {
            setRating(0);
            setComment('');
        }
    }, [review, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        let result;
        if (review?._id) {
            result = await editReview(review._id, rating, comment);
        } else {
            result = await submitReview(toUserId, contractId, rating, comment);
        }

        if (result.success) {
            setSuccess(true);
            if (onReviewSubmitted) onReviewSubmitted(result.data);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                if (!review) {
                    setRating(0);
                    setComment('');
                }
            }, 2000);
        } else {
            setError(result.error || "Failed to process review");
        }
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(204,255,0,0.1)]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="p-8">
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {review ? 'Review Updated!' : 'Review Submitted!'}
                                    </h3>
                                    <p className="text-text-muted">Thank you for your feedback.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {review ? 'Edit your review' : 'Rate your experience'}
                                        </h3>
                                        <p className="text-text-muted">How was working on this contract?</p>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`${star <= (hoverRating || rating)
                                                        ? 'fill-primary text-primary'
                                                        : 'text-gray-700'
                                                        } transition-colors`}
                                                    strokeWidth={1.5}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Comment Text Area */}
                                    <div>
                                        <label className="block text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                                            Feedback
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your review here..."
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || rating === 0}
                                        className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                {review ? 'Updating...' : 'Submitting...'}
                                            </>
                                        ) : (
                                            review ? 'Update Review' : 'Submit Review'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;

