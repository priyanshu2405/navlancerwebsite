import { useState, useCallback } from 'react';
import API_BASE_URL from '../config/api';

export function useClientJobs() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Delete a job (soft delete)
     */
    const deleteJob = useCallback(async (jobId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to delete job');
            }
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reopen a job
     */
    const reopenJob = useCallback(async (jobId, expiryDate = null) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const body = expiryDate ? JSON.stringify({ expiryDate }) : JSON.stringify({});
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reopen`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to reopen job');
            }
            const data = await response.json();
            return { success: true, data: data.job || data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Duplicate a job
     */
    const duplicateJob = useCallback(async (jobId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/duplicate`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to duplicate job');
            }
            const data = await response.json();
            return { success: true, data: data.job || data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update a job
     */
    const updateJob = useCallback(async (jobId, updates) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to update job');
            }
            const data = await response.json();
            return { success: true, data: data.job || data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch a single job
     */
    const getJob = useCallback(async (jobId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch job');
            }
            const data = await response.json();
            return { success: true, data: data.job || data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Invite a freelancer to a job
     */
    const inviteFreelancer = useCallback(async (jobId, freelancerId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/invite/${freelancerId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to invite freelancer');
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

    return {
        deleteJob,
        reopenJob,
        duplicateJob,
        inviteFreelancer,
        updateJob,
        getJob,
        loading,
        error
    };
}
