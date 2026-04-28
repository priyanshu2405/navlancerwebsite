import { useState, useCallback, useEffect } from 'react';
import API_BASE_URL from '../config/api';

export function useEarnings() {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingClearance: 0,
        available: 0,
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEarnings = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Try to fetch from API
            const response = await fetch(`${API_BASE_URL}/freelancers/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Backend returns { stats: { totalProposals, activeContracts, completedContracts, totalEarnings } }
                // Map it to the shape the Earnings page expects
                const raw = data.stats || data;
                setStats({
                    totalEarnings: raw.totalEarnings || 0,
                    pendingClearance: raw.pendingClearance || 0,
                    available: raw.available || raw.totalEarnings || 0,
                    transactions: Array.isArray(raw.transactions) ? raw.transactions : [],
                    // extra stats exposed by backend
                    totalProposals: raw.totalProposals || 0,
                    activeContracts: raw.activeContracts || 0,
                    completedContracts: raw.completedContracts || 0,
                });
            } else {
                // Determine if we should fallback to mock data (e.g. 404 means endpoint not implemented)
                if (response.status === 404) {
                    console.warn('Earnings API not found, using mock data');
                    // Mock data
                    setStats({
                        totalEarnings: 12500,
                        pendingClearance: 1500,
                        available: 4200,
                        transactions: [
                            { id: 1, date: '2025-01-28', client: 'Tech Solutions Inc', description: 'Web Development Project', amount: 5000, status: 'completed' },
                            { id: 2, date: '2025-01-15', client: 'StartUp Hub', description: 'Logo Design', amount: 1200, status: 'completed' },
                            { id: 3, date: '2025-02-01', client: 'Global Systems', description: 'API Integration (Milestone 1)', amount: 1500, status: 'pending' },
                        ]
                    });
                } else {
                    throw new Error('Failed to fetch stats');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            // Fallback for development if API is completely down/cors issues
            setStats({
                totalEarnings: 0,
                pendingClearance: 0,
                available: 0,
                transactions: []
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    return { stats, loading, error, refetch: fetchEarnings };
}
