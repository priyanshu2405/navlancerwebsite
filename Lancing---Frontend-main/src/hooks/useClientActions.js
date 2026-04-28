import { useState, useCallback } from 'react';
import API_BASE_URL from '../config/api';

export function useClientActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToFavorites = useCallback(async (freelancerId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/favorite/${freelancerId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to add to favorites');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const removeFromFavorites = useCallback(async (freelancerId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/favorite/remove/${freelancerId}`, {
                method: 'POST', // or DELETE depending on API, assuming POST per user list
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to remove from favorites');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const blockFreelancer = useCallback(async (freelancerId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/block/${freelancerId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to block freelancer');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const unblockFreelancer = useCallback(async (freelancerId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/unblock/${freelancerId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to unblock freelancer');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const getClientPreferences = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/preferences`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch preferences');
            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        addToFavorites,
        removeFromFavorites,
        blockFreelancer,
        unblockFreelancer,
        getClientPreferences,
        loading,
        error
    };
}
