import { useState, useCallback } from 'react';
import API_BASE_URL from '../config/api';

/**
 * Custom hook for searching and filtering freelancers
 */
export function useFreelancerSearch() {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Search freelancers with optional filters
     * @param {Object} filters - { skill, minRating, minRate, maxRate, availabilityStatus, experienceLevel, page, limit }
     */
    const searchFreelancers = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            
            // Map filters to query parameters
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/freelancers/search?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to search freelancers');
            }

            const data = await response.json();
            // Backend returns an array directly
            setFreelancers(Array.isArray(data) ? data : []);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        freelancers,
        loading,
        error,
        searchFreelancers
    };
}
