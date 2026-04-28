import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import { useNotifications } from '../context/NotificationContext';

export function useContract(contractId) {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { refresh: refreshNotifications } = useNotifications();

    /**
     * Fetch a specific contract by ID
     */
    const fetchContract = useCallback(async () => {
        if (!contractId) return;
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                console.warn("Could not fetch contract details directly.");
                return;
            }

            const data = await response.json();
            const contractData = data.contract || data;
            console.log('Fetched Contract Data (Full):', contractData);
            setContract(contractData);
        } catch (err) {
            console.error(err);
            // Don't set global error if just fetching details fails
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Get all contracts for the authenticated user (client or freelancer)
     */
    const getAllContracts = useCallback(async () => {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        try {
            const endpoints = [
                `${API_BASE_URL}/messages/conversations`,
                `${API_BASE_URL}/contracts/active`,
                `${API_BASE_URL}/contracts/my`,
                `${API_BASE_URL}/freelancer/contracts`,
                `${API_BASE_URL}/contracts`
            ];

            for (const url of endpoints) {
                try {
                    const response = await fetch(url, {
                        headers: { 'Authorization': `Bearer ${authToken}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return Array.isArray(data) ? data : (data.contracts || data.conversations || data.data || []);
                    }
                } catch (e) {
                    // Silent fail to avoid console spam during discovery
                }
            }
            return [];
        } catch (err) {
            console.warn("Failed to fetch all contracts:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [token]);



    /**
     * Request contract cancellation
     * Either client or freelancer can request cancellation
     * @param {string} reason - Reason for cancellation
     */
    const requestCancellation = useCallback(async (reason) => {
        if (!contractId) {
            return { success: false, error: 'Contract ID is required' };
        }
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/cancel-request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to request cancellation');
            }

            const data = await response.json();
            console.log('Cancellation Request Response:', data);

            // Should update local state immediately if data contains the updated contract
            if (data.contract || data._id) {
                setContract(data.contract || data);
            } else {
                // Optimistic update since backend doesn't return the full contract
                setContract(prev => ({
                    ...prev,
                    cancellationRequest: {
                        requestedBy: 'You', // Placeholder, will be corrected on refetch
                        reason: reason,
                        createdAt: new Date().toISOString()
                    }
                }));

                // Fallback to refetch with a delay
                setTimeout(() => fetchContract(), 1000);
            }

            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token, fetchContract]);

    /**
     * Approve mutual cancellation
     * Should be called by the other party (not the one who requested)
     */
    const approveCancellation = useCallback(async () => {
        if (!contractId) {
            return { success: false, error: 'Contract ID is required' };
        }
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/approve-cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to approve cancellation');
            }

            const data = await response.json();
            // Update local state to reflect cancellation
            setContract(prev => prev ? { ...prev, status: 'cancelled_mutual' } : null);
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Pause an active contract
     * Only works if contract status is 'active'
     */
    const pauseContract = useCallback(async () => {
        if (!contractId) {
            return { success: false, error: 'Contract ID is required' };
        }
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/pause`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to pause contract');
            }

            const data = await response.json();
            // Update local state to reflect pause
            setContract(prev => prev ? { ...prev, status: 'paused' } : null);
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Resume a paused contract
     * Only works if contract status is 'paused'
     */
    const resumeContract = useCallback(async () => {
        if (!contractId) {
            return { success: false, error: 'Contract ID is required' };
        }
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to resume contract');
            }

            const data = await response.json();
            // Update local state to reflect resume
            setContract(prev => prev ? { ...prev, status: 'active' } : null);
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Complete a contract
     */
    const completeContract = useCallback(async () => {
        if (!contractId) {
            return { success: false, error: 'Contract ID is required' };
        }
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to complete contract');
            }

            const data = await response.json();
            // Update local state to reflect completion
            setContract(prev => prev ? { ...prev, status: 'completed' } : null);
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Request a deadline extension
     * Only the freelancer should call this
     * @param {string} newDeadline - ISO date string for the new deadline e.g. "2026-03-20"
     * @param {string} reason      - Human-readable reason for the extension
     */
    const requestExtension = useCallback(async (newDeadline, reason) => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/contracts/${contractId}/request-extension`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newDeadline, reason })
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to request extension');
            }

            const data = await response.json();

            // Optimistic update so UI reflects the pending request immediately
            setContract(prev =>
                prev
                    ? {
                        ...prev,
                        extensionRequest: {
                            newDeadline,
                            reason,
                            status: 'pending',
                            createdAt: new Date().toISOString()
                        }
                    }
                    : null
            );

            setTimeout(() => fetchContract(), 1500);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token, fetchContract]);

    /**
     * Approve a pending deadline extension request
     * Only the client should call this
     */
    const approveExtension = useCallback(async () => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/contracts/${contractId}/approve-extension`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to approve extension');
            }

            const data = await response.json();

            // Optimistic: update deadline to the one that was requested
            setContract(prev =>
                prev
                    ? {
                        ...prev,
                        deadline: prev.extensionRequest?.newDeadline || prev.deadline,
                        extensionRequest: null
                    }
                    : null
            );

            setTimeout(() => fetchContract(), 1500);
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token, fetchContract]);

    /**
     * Reject a pending deadline extension request
     * Only the client should call this
     */
    const rejectExtension = useCallback(async () => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/contracts/${contractId}/reject-extension`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to reject extension');
            }

            const data = await response.json();

            // Optimistic: clear the pending request
            setContract(prev =>
                prev ? { ...prev, extensionRequest: null } : null
            );

            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Fetch the activity log for this contract
     * Returns the raw array — the calling component manages its own state
     */
    const getActivityLog = useCallback(async () => {
        if (!contractId) return [];
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/contracts/${contractId}/activity`,
                {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );

            if (!response.ok) {
                console.warn('Could not fetch activity log');
                return [];
            }

            const data = await response.json();
            return Array.isArray(data) ? data : (data.logs || data.activity || []);
        } catch (err) {
            console.error('getActivityLog error:', err);
            return [];
        }
    }, [contractId, token]);

    /**
     * Raise a dispute on the contract
     * @param {string} reason - Reason for the dispute
     */
    const raiseDispute = useCallback(async (reason) => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/raise-dispute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to raise dispute');
            }

            const data = await response.json();
            setContract(prev => prev ? { ...prev, status: 'disputed', dispute: { reason, createdAt: new Date().toISOString() } } : null);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Resolve a pending dispute
     */
    const resolveDispute = useCallback(async () => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/resolve-dispute`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to resolve dispute');
            }

            const data = await response.json();
            setContract(prev => prev ? { ...prev, status: 'active', dispute: null } : null);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Add a milestone to the contract
     * @param {Object} milestoneData - { title, description, dueDate }
     */
    const addMilestone = useCallback(async (milestoneData) => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(milestoneData)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to add milestone');
            }

            const data = await response.json();
            fetchContract(); // Refetch to get updated list
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token, fetchContract]);

    /**
     * Update milestone status
     * @param {string} milestoneId 
     * @param {string} status - pending, active, completed, approved
     */
    const updateMilestone = useCallback(async (milestoneId, status) => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones/${milestoneId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to update milestone');
            }

            const data = await response.json();

            // Optimistic update
            setContract(prev => {
                if (!prev || !prev.milestones) return prev;
                return {
                    ...prev,
                    milestones: prev.milestones.map(m =>
                        m._id === milestoneId ? { ...m, status } : m
                    )
                };
            });

            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    /**
     * Delete a milestone
     * @param {string} milestoneId 
     */
    const deleteMilestone = useCallback(async (milestoneId) => {
        if (!contractId) return { success: false, error: 'Contract ID is required' };
        setLoading(true);
        setError(null);
        const authToken = token || localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones/${milestoneId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to delete milestone');
            }

            const data = await response.json();

            // Optimistic update
            setContract(prev => {
                if (!prev || !prev.milestones) return prev;
                return {
                    ...prev,
                    milestones: prev.milestones.filter(m => m._id !== milestoneId)
                };
            });

            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [contractId, token]);

    useEffect(() => {
        fetchContract();
    }, [fetchContract]);

    return {
        contract,
        loading,
        error,
        // Contract management actions
        requestCancellation,
        approveCancellation,
        pauseContract,
        resumeContract,
        completeContract,
        // Deadline extension actions
        requestExtension,
        approveExtension,
        rejectExtension,
        // Dispute management
        raiseDispute,
        resolveDispute,
        // Milestone management
        addMilestone,
        updateMilestone,
        deleteMilestone,
        // Activity log
        getActivityLog,
        // Utility functions
        getAllContracts,
        refreshContract: fetchContract
    };
}
