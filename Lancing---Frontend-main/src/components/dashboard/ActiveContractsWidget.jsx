import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Clock, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { useContract } from '../../hooks/useContract';

const ActiveContractsWidget = ({ userType }) => {
    const navigate = useNavigate();
    const { getAllContracts } = useContract();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchContracts = async () => {
            try {
                const allContracts = await getAllContracts();
                if (mounted) {
                    // Filter for active/paused contracts
                    const active = allContracts.filter(c =>
                        ['active', 'paused', 'disputed'].includes(c.status)
                    );
                    setContracts(active);
                }
            } catch (error) {
                console.error("Failed to fetch contracts for widget:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchContracts();
        return () => { mounted = false; };
    }, [getAllContracts]);

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full min-h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-text-muted">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Loading contracts...</span>
                </div>
            </div>
        );
    }

    if (contracts.length === 0) {
        return null; // Don't show if no active contracts (optional: could show "No active contracts" state)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-primary" size={24} />
                    Active Contracts
                </h2>
                {/* Optional: functionality to view all contracts could go here */}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {contracts.map((contract) => (
                        <motion.div
                            key={contract._id || contract.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => navigate(`/contract/${contract._id || contract.id}`)}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contract.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' :
                                            contract.status === 'disputed' ? 'bg-red-500/10 text-red-500' :
                                                'bg-primary/10 text-primary'
                                        }`}>
                                        {contract.status === 'paused' ? <PauseCircle size={20} /> :
                                            contract.status === 'disputed' ? <AlertCircle size={20} /> :
                                                <PlayCircle size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                            {contract.jobId?.title || contract.title || 'Untitled Contract'}
                                        </h3>
                                        <p className="text-xs text-text-muted flex items-center gap-2">
                                            <span>
                                                {userType === 'client'
                                                    ? `Freelancer: ${contract.freelancerId?.name || 'Unknown'}`
                                                    : `Client: ${contract.clientId?.name || 'Unknown'}`
                                                }
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>Started {new Date(contract.startDate || contract.createdAt).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${contract.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                            contract.status === 'disputed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-green-500/10 text-green-500 border border-green-500/20'
                                        }`}>
                                        {contract.status}
                                    </div>
                                    <ChevronRight size={18} className="text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ActiveContractsWidget;
