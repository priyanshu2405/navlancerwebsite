import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

export function useClientProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);

    /**
     * Get Current Client Profile (Protected)
     */
    const getClientProfile = useCallback(async () => {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/client/profile`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Get Client Trust Score (Public)
     */
    const getClientTrustScore = useCallback(async (userId) => {
        setLoading(true);
        try {
            // No auth required for public trust score
            const response = await fetch(`${API_BASE_URL}/client/trust/${userId}`);

            if (!response.ok) throw new Error('Failed to fetch trust score');

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get Client Rating (Public)
     */
    const getClientRating = useCallback(async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/client/rating/${userId}`);

            if (!response.ok) throw new Error('Failed to fetch client rating');

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update Client Profile (Protected)
     */
    const updateProfile = useCallback(async (profileData) => {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/client/profile`, {
                method: 'POST', // or PATCH/PUT depending on your API
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        getClientProfile,
        getClientTrustScore,
        getClientRating,
        updateProfile,
        profile,
        loading,
        error
    };
}
