import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

/**
 * Custom hook for managing a freelancer's saved jobs
 */
export function useSavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    /**
     * Fetch all saved jobs for the logged-in freelancer
     */
    const fetchSavedJobs = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/saved-jobs`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch saved jobs');
            }

            const data = await response.json();
            // Backend returns { savedJobs: [...] }
            setSavedJobs(data.savedJobs || []);
            return { success: true, data: data.savedJobs };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Save (bookmark) a job
     */
    const saveJob = useCallback(async (jobId) => {
        if (!token) return { success: false, error: 'Authentication required' };
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/saved-jobs/${jobId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to save job');
            }

            const data = await response.json();
            // Refresh the list after saving
            fetchSavedJobs();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token, fetchSavedJobs]);

    /**
     * Remove a saved job
     */
    const removeSavedJob = useCallback(async (jobId) => {
        if (!token) return { success: false, error: 'Authentication required' };
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/freelancers/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to remove saved job');
            }

            const data = await response.json();
            // Update local state by filtering out the removed job
            setSavedJobs(prev => prev.filter(job => (job._id || job.id) !== jobId));
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Initial fetch if token is available
    useEffect(() => {
        if (token) {
            fetchSavedJobs();
        }
    }, [token, fetchSavedJobs]);

    return {
        savedJobs,
        loading,
        error,
        saveJob,
        removeSavedJob,
        refetch: fetchSavedJobs
    };
}
