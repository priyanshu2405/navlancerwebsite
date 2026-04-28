import React, { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ContractActivityLog from './ContractActivityLog';
import ReviewModal from '../ReviewModal';
import {
    Pause,
    Play,
    XCircle,
    CheckCircle,
    AlertCircle,
    Loader2,
    CalendarClock,
    Check,
    X
} from 'lucide-react';

/**
 * Contract Management Component
 * Displays contract details and provides actions for managing the contract
 * 
 * @param {string} contractId - The _id of the contract document
 */
const ContractManagement = ({ contractId }) => {
    const { role } = useAuth();

    const {
        contract,
        loading,
        error,
        requestCancellation,
        approveCancellation,
        pauseContract,
        resumeContract,
        completeContract,
        requestExtension,
        approveExtension,
        rejectExtension,
        raiseDispute,
        resolveDispute,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        refreshContract
    } = useContract(contractId);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Extension modal state
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [newDeadline, setNewDeadline] = useState('');
    const [extensionReason, setExtensionReason] = useState('');

    // Dispute modal state
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Milestone modal state
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [milestoneForm, setMilestoneForm] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    // Handle request cancellation
    const handleRequestCancellation = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        setActionLoading(true);
        const result = await requestCancellation(cancelReason);
        setActionLoading(false);

        if (result.success) {
            alert('Cancellation request sent successfully');
            setShowCancelModal(false);
            setCancelReason('');
        } else {
            alert(`Failed to request cancellation: ${result.error}`);
        }
    };

    // Handle approve cancellation
    const handleApproveCancellation = async () => {
        if (!window.confirm('Are you sure you want to approve this cancellation request?')) {
            return;
        }

        setActionLoading(true);
        const result = await approveCancellation();
        setActionLoading(false);

        if (result.success) {
            alert('Contract cancelled mutually');
        } else {
            alert(`Failed to approve cancellation: ${result.error}`);
        }
    };

    // Handle pause contract
    const handlePauseContract = async () => {
        if (!window.confirm('Are you sure you want to pause this contract?')) {
            return;
        }

        setActionLoading(true);
        const result = await pauseContract();
        setActionLoading(false);

        if (result.success) {
            alert('Contract paused successfully');
        } else {
            alert(`Failed to pause contract: ${result.error}`);
        }
    };

    // Handle resume contract
    const handleResumeContract = async () => {
        setActionLoading(true);
        const result = await resumeContract();
        setActionLoading(false);

        if (result.success) {
            alert('Contract resumed successfully');
        } else {
            alert(`Failed to resume contract: ${result.error}`);
        }
    };

    // Handle complete contract
    const handleCompleteContract = async () => {
        if (!window.confirm('Are you sure you want to mark this contract as completed?')) {
            return;
        }

        setActionLoading(true);
        const result = await completeContract();
        setActionLoading(false);

        if (result.success) {
            alert('Contract completed successfully');
        } else {
            alert(`Failed to complete contract: ${result.error}`);
        }
    };

    // Handle request extension
    const handleRequestExtension = async () => {
        if (!newDeadline) {
            alert('Please select a new deadline');
            return;
        }
        if (!extensionReason.trim()) {
            alert('Please provide a reason for the extension');
            return;
        }
        setActionLoading(true);
        const result = await requestExtension(newDeadline, extensionReason);
        setActionLoading(false);
        if (result.success) {
            alert('Extension request sent successfully');
            setShowExtensionModal(false);
            setNewDeadline('');
            setExtensionReason('');
        } else {
            alert(`Failed to request extension: ${result.error}`);
        }
    };

    // Handle approve extension
    const handleApproveExtension = async () => {
        if (!window.confirm('Approve this deadline extension?')) return;
        setActionLoading(true);
        const result = await approveExtension();
        setActionLoading(false);
        if (result.success) {
            alert('Extension approved — deadline updated');
        } else {
            alert(`Failed to approve extension: ${result.error}`);
        }
    };

    // Handle raise dispute
    const handleRaiseDispute = async () => {
        if (!disputeReason.trim()) {
            alert('Please provide a reason for the dispute');
            return;
        }
        setActionLoading(true);
        const result = await raiseDispute(disputeReason);
        setActionLoading(false);
        if (result.success) {
            alert('Dispute raised successfully');
            setShowDisputeModal(false);
            setDisputeReason('');
        } else {
            alert(`Failed to raise dispute: ${result.error}`);
        }
    };

    // Handle resolve dispute
    const handleResolveDispute = async () => {
        if (!window.confirm('Are you sure you want to resolve this dispute?')) return;
        setActionLoading(true);
        const result = await resolveDispute();
        setActionLoading(false);
        if (result.success) {
            alert('Dispute resolved — contract is now active again');
        } else {
            alert(`Failed to resolve dispute: ${result.error}`);
        }
    };

    // Handle add milestone
    const handleAddMilestone = async () => {
        if (!milestoneForm.title.trim() || !milestoneForm.dueDate) {
            alert('Title and due date are required');
            return;
        }
        setActionLoading(true);
        const result = await addMilestone(milestoneForm);
        setActionLoading(false);
        if (result.success) {
            alert('Milestone added successfully');
            setShowMilestoneModal(false);
            setMilestoneForm({ title: '', description: '', dueDate: '' });
        } else {
            alert(`Failed to add milestone: ${result.error}`);
        }
    };

    // Handle update milestone status
    const handleUpdateMilestoneStatus = async (milestoneId, status) => {
        setActionLoading(true);
        const result = await updateMilestone(milestoneId, status);
        setActionLoading(false);
        if (!result.success) {
            alert(`Failed to update milestone: ${result.error}`);
        }
    };

    // Handle delete milestone
    const handleDeleteMilestone = async (milestoneId) => {
        if (!window.confirm('Delete this milestone?')) return;
        setActionLoading(true);
        const result = await deleteMilestone(milestoneId);
        setActionLoading(false);
        if (!result.success) {
            alert(`Failed to delete milestone: ${result.error}`);
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'paused':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'cancelled_mutual':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'disputed':
                return 'bg-orange-600/10 text-orange-500 border-orange-600/20';
            default:
                return 'bg-white/10 text-white border-white/20';
        }
    };

    if (loading && !contract) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <p className="text-text-muted">No contract found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Contract Header */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Contract Details</h2>
                        <p className="text-text-muted">Contract ID: {contract._id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold border ${getStatusColor(contract.status)}`}>
                        {contract.status?.toUpperCase()}
                    </span>
                </div>

                {/* Contract Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <p className="text-sm text-text-muted mb-1">Job Title</p>
                        <p className="text-white font-semibold">
                            {contract.jobId?.title || contract.title || contract.jobTitle || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-text-muted mb-1">Budget</p>
                        <p className="text-white font-semibold">
                            {contract.budget ? `₹${contract.budget.toLocaleString()}` :
                                contract.amount ? `₹${contract.amount.toLocaleString()}` :
                                    contract.price ? `₹${contract.price.toLocaleString()}` :
                                        contract.proposalId?.price ? `₹${contract.proposalId.price.toLocaleString()}` :
                                            contract.jobId?.budget ? `₹${contract.jobId.budget.toLocaleString()}` :
                                                'N/A'}
                        </p>
                    </div>
                </div>

                {/* Dispute Notice */}
                {(contract.status === 'disputed' || contract.dispute) && (
                    <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="flex-shrink-0 mt-1 text-orange-500" size={20} />
                            <div className="flex-1">
                                <p className="font-semibold text-orange-500 mb-1">Contract Under Dispute</p>
                                <p className="text-sm text-white">Reason: {contract.dispute?.reason || 'No reason provided'}</p>
                                <p className="text-[10px] text-text-muted mt-2 uppercase font-bold tracking-widest">
                                    Status: Awaiting Resolution
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancellation Request Notice */}
                {(contract.cancellationRequest || contract.cancelReason) && (
                    <div className={`mt-6 border rounded-xl p-4 ${contract.status === 'cancelled_mutual' || contract.status === 'cancelled'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20'
                        }`}>
                        <div className="flex items-start gap-3">
                            <AlertCircle className={`flex-shrink-0 mt-1 ${contract.status === 'cancelled_mutual' || contract.status === 'cancelled'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                                }`} size={20} />
                            <div className="flex-1">
                                <p className={`font-semibold mb-1 ${contract.status === 'cancelled_mutual' || contract.status === 'cancelled'
                                    ? 'text-red-500'
                                    : 'text-yellow-500'
                                    }`}>
                                    {contract.status === 'cancelled_mutual' || contract.status === 'cancelled'
                                        ? 'Cancellation Details'
                                        : 'Cancellation Request Pending'}
                                </p>
                                <p className="text-sm text-text-muted mb-2">
                                    Requested by: {contract.cancellationRequest?.requestedBy ||
                                        (contract.cancelRequestedBy === contract.clientId?._id ? contract.clientId?.name :
                                            contract.cancelRequestedBy === contract.freelancerId?._id ? contract.freelancerId?.name :
                                                'Partner')}
                                </p>
                                <p className="text-sm text-white">
                                    Reason: {contract.cancellationRequest?.reason || contract.cancelReason}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Extension Request Notice */}
                {contract.extensionRequest && contract.extensionRequest.status === 'pending' && (
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <CalendarClock className="flex-shrink-0 mt-1 text-purple-400" size={20} />
                            <div className="flex-1">
                                <p className="font-semibold text-purple-400 mb-1">Deadline Extension Requested</p>
                                <p className="text-sm text-text-muted">
                                    New deadline:{' '}
                                    <span className="text-white font-medium">
                                        {new Date(contract.extensionRequest.newDeadline).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </p>
                                <p className="text-sm text-white mt-1">Reason: {contract.extensionRequest.reason}</p>

                                {/* Client-only actions */}
                                {(role === 'client' || role === 'Client') && (
                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={handleApproveExtension}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {actionLoading
                                                ? <Loader2 className="animate-spin" size={14} />
                                                : <Check size={14} />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={handleRejectExtension}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {actionLoading
                                                ? <Loader2 className="animate-spin" size={14} />
                                                : <X size={14} />}
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contract Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Contract Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Pause/Resume Contract */}
                    {contract.status === 'active' && (
                        <button
                            onClick={handlePauseContract}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500/20 transition-colors font-medium disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Pause size={18} />}
                            Pause Contract
                        </button>
                    )}

                    {contract.status === 'paused' && (
                        <button
                            onClick={handleResumeContract}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500/20 transition-colors font-medium disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                            Resume Contract
                        </button>
                    )}

                    {/* Request Cancellation */}
                    {!(contract.cancellationRequest || contract.cancelReason) && (contract.status === 'active' || contract.status === 'paused') && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors font-medium disabled:opacity-50"
                        >
                            <XCircle size={18} />
                            Request Cancellation
                        </button>
                    )}

                    {/* Approve Cancellation */}
                    {(contract.cancellationRequest || contract.cancelReason) && (contract.status === 'active' || contract.status === 'paused') && (
                        <button
                            onClick={handleApproveCancellation}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-colors font-medium disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                            Approve Cancellation
                        </button>
                    )}

                    {/* Request Extension (freelancer only, no pending request) */}
                    {(role === 'freelancer' || role === 'Freelancer') &&
                        !contract.extensionRequest &&
                        (contract.status === 'active' || contract.status === 'paused') && (
                            <button
                                onClick={() => setShowExtensionModal(true)}
                                disabled={actionLoading}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-colors font-medium disabled:opacity-50"
                            >
                                <CalendarClock size={18} />
                                Request Extension
                            </button>
                        )}

                    {/* Raise Dispute */}
                    {contract.status === 'active' && (
                        <button
                            onClick={() => setShowDisputeModal(true)}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-colors font-medium disabled:opacity-50"
                        >
                            <AlertCircle size={18} />
                            Raise Dispute
                        </button>
                    )}

                    {/* Resolve Dispute */}
                    {contract.status === 'disputed' && (
                        <button
                            onClick={handleResolveDispute}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500/20 transition-colors font-medium disabled:opacity-50 font-bold"
                        >
                            <CheckCircle size={18} />
                            Resolve Dispute
                        </button>
                    )}

                    {/* Complete Contract (Client only, when active) */}
                    {(role === 'client' || role === 'Client') && contract.status === 'active' && (
                        <button
                            onClick={handleCompleteContract}
                            disabled={actionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl hover:bg-teal-500/20 transition-colors font-medium disabled:opacity-50 font-bold"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                            Complete Contract
                        </button>
                    )}

                    {/* Leave Review (Only when completed) */}
                    {contract.status === 'completed' && (
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/20 border border-primary/30 text-primary rounded-xl hover:bg-primary/30 transition-colors font-bold"
                        >
                            <Star size={18} className="fill-current" />
                            Leave Review
                        </button>
                    )}
                </div>
            </div>

            {/* Milestones Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Contract Milestones</h3>
                    {(role === 'freelancer' || role === 'Freelancer') && (
                        <button
                            onClick={() => setShowMilestoneModal(true)}
                            className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest"
                        >
                            Add Milestone
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {(!contract.milestones || contract.milestones.length === 0) ? (
                        <div className="p-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
                            <p className="text-text-muted text-sm">No milestones defined for this contract.</p>
                        </div>
                    ) : (
                        contract.milestones.map((milestone) => (
                            <div key={milestone._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white uppercase tracking-wider">{milestone.title}</h4>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        milestone.status === 'approved' ? 'bg-primary/20 text-primary' :
                                            milestone.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-white/10 text-text-muted'
                                        }`}>
                                        {milestone.status}
                                    </span>
                                </div>
                                <p className="text-sm text-text-muted mb-3">{milestone.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-text-muted font-bold uppercase">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </span>

                                    {(role === 'freelancer' || role === 'Freelancer') && (
                                        <div className="flex gap-2">
                                            {milestone.status === 'active' && (
                                                <button
                                                    onClick={() => handleUpdateMilestoneStatus(milestone._id, 'completed')}
                                                    className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"
                                                    title="Mark Completed"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            {milestone.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateMilestoneStatus(milestone._id, 'active')}
                                                    className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"
                                                    title="Start Working"
                                                >
                                                    <Play size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteMilestone(milestone._id)}
                                                className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                                title="Delete"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cancellation Modal */}
            {/* Activity Log */}
            <ContractActivityLog contractId={contractId} contractStatus={contract?.status} />

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full"
                    >
                        <h3 className="text-xl font-bold mb-4">Request Contract Cancellation</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Reason for Cancellation
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Please provide a reason..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                }}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestCancellation}
                                disabled={actionLoading || !cancelReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {actionLoading && <Loader2 className="animate-spin" size={16} />}
                                Submit Request
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Extension Request Modal */}
            <AnimatePresence>
                {showExtensionModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <CalendarClock size={20} className="text-purple-400" />
                                <h3 className="text-xl font-bold">Request Deadline Extension</h3>
                            </div>

                            {/* New Deadline */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    New Deadline <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newDeadline}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]"
                                />
                            </div>

                            {/* Reason */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium mb-2">
                                    Reason <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={extensionReason}
                                    onChange={(e) => setExtensionReason(e.target.value)}
                                    placeholder="Explain why you need extra time..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-purple-500 resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowExtensionModal(false);
                                        setNewDeadline('');
                                        setExtensionReason('');
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRequestExtension}
                                    disabled={actionLoading || !newDeadline || !extensionReason.trim()}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="animate-spin" size={16} />}
                                    Submit Request
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Dispute Modal */}
            <AnimatePresence>
                {showDisputeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <AlertCircle size={20} className="text-orange-500" />
                                <h3 className="text-xl font-bold">Raise a Contract Dispute</h3>
                            </div>
                            <p className="text-sm text-text-muted mb-4">
                                This will pause the contract and alert our administrators for mediation.
                                Please provide a clear reason for the dispute.
                            </p>
                            <textarea
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                placeholder="Explain the issue (e.g., Client refused to pay, Scope creep)..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-orange-500 resize-none mb-5"
                                rows={4}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDisputeModal(false);
                                        setDisputeReason('');
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRaiseDispute}
                                    disabled={actionLoading || !disputeReason.trim()}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="animate-spin" size={16} />}
                                    Raise Dispute
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Milestone Modal */}
            <AnimatePresence>
                {showMilestoneModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <CheckCircle size={20} className="text-primary" />
                                <h3 className="text-xl font-bold">Add New Milestone</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        value={milestoneForm.title}
                                        onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                        placeholder="e.g. Design Approved"
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Description</label>
                                    <textarea
                                        value={milestoneForm.description}
                                        onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                                        placeholder="Detailed explanation of the milestone"
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Due Date</label>
                                    <input
                                        type="date"
                                        value={milestoneForm.dueDate}
                                        onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowMilestoneModal(false);
                                        setMilestoneForm({ title: '', description: '', dueDate: '' });
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMilestone}
                                    disabled={actionLoading || !milestoneForm.title || !milestoneForm.dueDate}
                                    className="flex-1 px-4 py-2 bg-primary text-black rounded-xl hover:bg-white transition-all font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="animate-spin" size={16} />}
                                    Add Milestone
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                contractId={contractId}
                toUserId={role?.toLowerCase() === 'client' ? contract.freelancerId?._id || contract.freelancerId : contract.clientId?._id || contract.clientId}
                onReviewSubmitted={() => {
                    setShowReviewModal(false);
                    refreshContract();
                }}
            />
        </div>
    );
};

export default ContractManagement;
