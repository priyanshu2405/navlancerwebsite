import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

/**
 * Custom hook for managing freelancer profile, portfolio, and settings
 */
export function useFreelancerProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    /**
     * Fetch freelancer profile
     */
    const fetchProfile = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        const url = userId
            ? `${API_BASE_URL}/freelancers/${userId}`
            : `${API_BASE_URL}/freelancers/me`; 

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Create or Update profile
     */
    const updateProfile = useCallback(async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Update Experience Level
     */
    const updateExperienceLevel = useCallback(async (level) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/experience-level`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ experienceLevel: level })
            });

            if (!response.ok) {
                throw new Error('Failed to update experience level');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Update Availability Status
     */
    const updateAvailability = useCallback(async (status) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/availability-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ availabilityStatus: status })
            });

            if (!response.ok) {
                throw new Error('Failed to update availability');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Add Portfolio Item
     */
    const addPortfolioItem = useCallback(async (formData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/portfolio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add portfolio item');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Delete Portfolio Item
     */
    const deletePortfolioItem = useCallback(async (portfolioId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/portfolio/${portfolioId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete portfolio item');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Reorder Portfolio Items
     */
    const reorderPortfolio = useCallback(async (order) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/portfolio/reorder`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to reorder portfolio');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        fetchProfile,
        updateProfile,
        updateExperienceLevel,
        updateAvailability,
        addPortfolioItem,
        deletePortfolioItem,
        reorderPortfolio,
        loading,
        error
    };
}
