import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

export function useClientStats() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalHires: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth(); // Use token from context if available, or localStorage fallback

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/client/stats`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch client stats');
            }

            const data = await response.json();
            // Expected response: { stats: { ... } } or just { ... }
            setStats(data.stats || data);
        } catch (err) {
            console.error("Client stats error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
