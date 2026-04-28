import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config/api';

/**
 * Custom hook for fetching and managing available jobs for freelancers
 * Supports filtering by category, tags, and search queries
 */
export function useFreelancerJobs(filters = {}) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            let url = `${API_BASE_URL}/jobs`;

            // Add search and pagination filters
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.search) params.append('search', filters.search);
            if (filters.remote !== undefined) params.append('remote', filters.remote);
            if (filters.minBudget) params.append('minBudget', filters.minBudget);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const queryString = params.toString();
            // If the user is specifically searching or using advanced filters, use the /search endpoint
            // otherwise /api/jobs supports pagination directly
            const isSearch = filters.category || filters.tag || filters.search || filters.remote !== undefined || filters.minBudget;

            if (isSearch) {
                url = `${API_BASE_URL}/jobs/search?${queryString}`;
            } else if (queryString) {
                url = `${API_BASE_URL}/jobs?${queryString}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const data = await response.json();

            // Handle both array and object (paginated) responses
            const rawJobs = Array.isArray(data) ? data : (data.jobs || data.recentJobs || data.recent || data.data || []);

            setJobs(rawJobs.filter(j => {
                const status = j.status?.toLowerCase();
                return status !== 'deleted' && status !== 'inactive' && !j.isDeleted;
            }));

            // Updated pagination state if returned
            if (!Array.isArray(data)) {
                setPagination({
                    page: data.page || filters.page || 1,
                    limit: data.limit || filters.limit || 10,
                    total: data.total || data.totalJobs || rawJobs.length,
                    pages: data.pages || data.totalPages || 1
                });
            }

        } catch (err) {
            setError(err.message);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [filters.category, filters.tag, filters.search, filters.remote, filters.minBudget, filters.page, filters.limit]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return { jobs, pagination, loading, error, refetch: fetchJobs };
}

/**
 * Custom hook for fetching single job details
 */
export function useJobDetails(jobId) {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }

                const data = await response.json();
                setJob(data);
            } catch (err) {
                setError(err.message);
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    /**
     * Report a job
     */
    const reportJob = async (jobId, reason) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to report job');
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return { job, loading, error, reportJob };
}
