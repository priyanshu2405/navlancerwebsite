import { useState, useCallback, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useNotifications } from '../context/NotificationContext';

/**
 * Custom hook for managing proposals (submit, edit, withdraw, fetch)
 */
export function useProposals() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refresh: refreshNotifications } = useNotifications();

    /**
     * Submit a new proposal to a job
     */
    const submitProposal = useCallback(async (proposalData) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proposalData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit proposal');
            }

            const data = await response.json();
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Edit an existing proposal
     */
    const editProposal = useCallback(async (proposalId, updates) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to edit proposal');
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

    /**
     * Withdraw a proposal
     */
    const withdrawProposal = useCallback(async (proposalId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/withdraw`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to withdraw proposal');
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

    /**
     * Add attachment to proposal
     */
    const addAttachment = useCallback(async (proposalId, file) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add attachment');
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

    /**
     * Fetch all proposals for a specific job (Client side)
     */
    const getJobProposals = useCallback(async (jobId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals/job/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch proposals');
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

    /**
     * Hire a freelancer (Client side)
     */
    const hireFreelancer = useCallback(async (proposalId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals/hire/${proposalId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to hire freelancer');
            }

            const data = await response.json();
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reject a proposal (Client side)
     */
    const rejectProposal = useCallback(async (proposalId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/proposals/reject/${proposalId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to reject proposal');
            }

            const data = await response.json();
            refreshNotifications();
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        submitProposal,
        editProposal,
        withdrawProposal,
        addAttachment,
        getJobProposals,
        hireFreelancer,
        rejectProposal,
        loading,
        error
    };
}

/**
 * Custom hook for fetching freelancer's own proposals
 */
export function useMyProposals() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProposals = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            // 1. Fetch all proposals
            const response = await fetch(`${API_BASE_URL}/proposals/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch proposals');
            }

            const data = await response.json();
            const proposalsData = Array.isArray(data) ? data : [];

            // 2. DISCOVERY STEP: If any are accepted but missing contractId, try to find them
            let finalProposals = proposalsData;
            const needsDiscovery = proposalsData.some(p => p.status === 'accepted' && !p.contractId && !p.contract);

            // Aggressive discovery for accepted proposals
            const acceptedProposals = proposalsData.filter(p => p.status === 'accepted');
            if (acceptedProposals.length > 0) {
                console.log('📋 [useMyProposals] Aggressive discovery for accepted proposals:', acceptedProposals.map(p => p._id));
                try {
                    const authToken = token || localStorage.getItem('token');
                    const patterns = [
                        '/messages/conversations',
                        '/contracts/active',
                        '/contracts/freelancer',
                        '/contracts/my',
                        '/freelancer/contracts'
                    ];

                    let discoveredContracts = [];
                    for (const path of patterns) {
                        try {
                            const res = await fetch(`${API_BASE_URL}${path}`, {
                                headers: { 'Authorization': `Bearer ${authToken}` }
                            });
                            if (res.ok) {
                                const cData = await res.json();
                                const found = Array.isArray(cData) ? cData : (cData.contracts || cData.conversations || cData.data || []);
                                if (Array.isArray(found) && found.length > 0) {
                                    console.log(`📋 [useMyProposals] Discovery found ${found.length} items from ${path}`);
                                    discoveredContracts = [...discoveredContracts, ...found];
                                }
                            }
                        } catch (e) { /* ignore */ }
                    }

                    // 2. Map discovered data
                    finalProposals = proposalsData.map(p => {
                        if (p.status === 'accepted') {
                            const matching = discoveredContracts.find(c => {
                                const pid = c.proposalId || c.proposal || (typeof c.proposal === 'object' ? c.proposal?._id : null);
                                const jid = c.jobId?._id || c.jobId || c.job?._id || c.job;
                                const propJid = p.jobId?._id || p.jobId;

                                return (pid === p._id) ||
                                    (jid && propJid && jid === propJid) ||
                                    (c.contractId && c.contractId === p.contractId);
                            });

                            if (matching) {
                                const cid = matching.contractId || matching._id || matching.id;
                                console.log(`📋 [useMyProposals] MATCH FOUND for ${p._id} -> ${cid}`);
                                return { ...p, contractId: cid, contract: matching };
                            }
                        }
                        return p;
                    });

                    // 3. Fallback: Job Details & Deep Search
                    for (let i = 0; i < finalProposals.length; i++) {
                        const p = finalProposals[i];
                        if (p.status === 'accepted' && (!p.contractId || p.contractId === p._id)) {
                            const jid = p.jobId?._id || p.jobId;
                            if (!jid) continue;
                            try {
                                const jRes = await fetch(`${API_BASE_URL}/jobs/${jid}`, {
                                    headers: { 'Authorization': `Bearer ${authToken}` }
                                });
                                if (jRes.ok) {
                                    const jData = await jRes.json();
                                    // Try all possible paths in job data
                                    const cid = jData.contractId ||
                                        jData.contract?._id ||
                                        jData.contract ||
                                        jData.activeContract?._id ||
                                        jData.activeContract;

                                    if (cid && typeof cid === 'string' && cid !== p._id) {
                                        console.log(`📋 [useMyProposals] Found CID ${cid} in job details for ${p._id}`);
                                        finalProposals[i] = { ...p, contractId: cid };
                                    }
                                }
                            } catch (e) { /* ignore */ }
                        }
                    }
                } catch (discoveryErr) {
                    console.error('📋 [useMyProposals] Discovery logic error:', discoveryErr);
                }
            }


            // 3. FRONTEND FALLBACK: attach contractId from localStorage mapping (legacy)
            const raw = localStorage.getItem('proposalContractMap');
            const map = raw ? JSON.parse(raw) : {};
            finalProposals = finalProposals.map(p => {
                // If we still don't have a contractId, check mapping OR check if proposal has it deep
                let cid = p.contractId || (typeof p.contract === 'string' ? p.contract : p.contract?._id);

                if (!cid && map[p._id]) {
                    cid = map[p._id];
                }

                if (cid) {
                    return { ...p, contractId: cid };
                }
                return p;
            });

            setProposals(finalProposals);
        } catch (err) {
            setError(err.message);
            setProposals([]);
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    return { proposals, loading, error, refetch: fetchProposals };
}
