import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

export function useReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const getAuthToken = () => token || localStorage.getItem('token');

    const fetchUserReviews = useCallback(async (userId) => {
        if (!userId) return;

        setLoading(true);
        setError(null);
        try {
            const id = typeof userId === 'object' ? userId._id : userId;
            const response = await fetch(`${API_BASE_URL}/reviews/user/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch reviews');
            }

            const data = await response.json();
            setReviews(data);
            return { success: true, data };
        } catch (err) {
            console.error("Fetch reviews error:", err);
            setError(err.message);
            setReviews([]);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const submitReview = useCallback(async (toUserId, contractId, rating, comment) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ toUserId, contractId, rating, comment })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit review');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const editReview = useCallback(async (reviewId, rating, comment) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, comment })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to edit review');
            }

            const data = await response.json();
            setReviews(prev => prev.map(r => r._id === reviewId ? data : r));
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteReview = useCallback(async (reviewId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete review');
            }

            setReviews(prev => prev.filter(r => r._id !== reviewId));
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const replyToReview = useCallback(async (reviewId, reply) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reply })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to reply to review');
            }

            const data = await response.json();
            setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, reply: data.reply || reply } : r));
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const reportReview = useCallback(async (reviewId, reason) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to report review');
            }

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        reviews,
        loading,
        error,
        fetchUserReviews,
        submitReview,
        editReview,
        deleteReview,
        replyToReview,
        reportReview
    };
}

