import React, { useEffect, useState, useCallback } from 'react';
import { useContract } from '../../hooks/useContract';
import { useAuth } from '../../context/AuthContext';
import { Activity, User, Clock, Loader2, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * CONTRACT ACTIVITY LOG
 * ---------------------
 * Fetches GET /api/contracts/:id/activity and renders a vertical timeline.
 *
 * For "extension_requested" entries it automatically shows Approve / Reject
 * buttons to the client — so even if the contract object doesn't carry an
 * extensionRequest field, the client can still act.
 *
 * @param {string} contractId   - The _id of the contract document
 * @param {string} [contractStatus] - Current contract status (active / paused / etc.)
 */
const ContractActivityLog = ({ contractId, contractStatus }) => {
    const { getActivityLog, approveExtension, rejectExtension } = useContract(contractId);
    const { role } = useAuth();

    const [logs, setLogs] = useState([]);
    const [logLoading, setLogLoading] = useState(true);
    const [logError, setLogError] = useState(null);
    const [actionIdx, setActionIdx] = useState(null); // which log row is being acted on

    const isClient = role === 'client' || role === 'Client';

    /* ---------- fetch log ---------- */
    const fetchLogs = useCallback(async () => {
        if (!contractId) return;
        setLogLoading(true);
        setLogError(null);
        const data = await getActivityLog();
        setLogs(Array.isArray(data) ? data : []);
        setLogLoading(false);
    }, [contractId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    /* ---------- check for a "pending" extension ----------
     * A pending extension exists when the last extension-related log entry
     * is "extension_requested" (i.e. not yet followed by approved/rejected).
     */
    const hasPendingExtension = (() => {
        const extLogs = logs.filter(l =>
            ['extension_requested', 'extension_approved', 'extension_rejected'].includes(l.action)
        );
        if (!extLogs.length) return false;
        return extLogs[extLogs.length - 1].action === 'extension_requested';
    })();

    /* ---------- action helpers ---------- */
    const handleApprove = async (idx) => {
        if (!window.confirm('Approve this deadline extension?')) return;
        setActionIdx(idx);
        const result = await approveExtension();
        setActionIdx(null);
        if (result.success) {
            alert('Extension approved — deadline updated');
            fetchLogs(); // refresh log after action
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const handleReject = async (idx) => {
        if (!window.confirm('Reject this deadline extension request?')) return;
        setActionIdx(idx);
        const result = await rejectExtension();
        setActionIdx(null);
        if (result.success) {
            alert('Extension rejected');
            fetchLogs();
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    /* ---------- colour / label map ---------- */
    const actionMeta = {
        contract_created: { color: 'bg-blue-500', dot: 'bg-blue-500', label: 'Created' },
        paused: { color: 'bg-yellow-500', dot: 'bg-yellow-500', label: 'Paused' },
        resumed: { color: 'bg-green-500', dot: 'bg-green-500', label: 'Resumed' },
        completed: { color: 'bg-emerald-500', dot: 'bg-emerald-500', label: 'Completed' },
        cancelled: { color: 'bg-red-500', dot: 'bg-red-500', label: 'Cancelled' },
        cancellation_requested: { color: 'bg-orange-500', dot: 'bg-orange-500', label: 'Cancel Req.' },
        extension_requested: { color: 'bg-purple-500', dot: 'bg-purple-400', label: 'Ext. Req.' },
        extension_approved: { color: 'bg-teal-500', dot: 'bg-teal-500', label: 'Ext. Approved' },
        extension_rejected: { color: 'bg-rose-500', dot: 'bg-rose-500', label: 'Ext. Rejected' },
    };

    const getMeta = (action) =>
        actionMeta[action] || { color: 'bg-white/30', dot: 'bg-white/40', label: action };

    const formatDate = (iso) => {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return iso; }
    };

    /* ---------- loading ---------- */
    if (logLoading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Activity Log
                </h3>
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={28} />
                </div>
            </div>
        );
    }

    /* ---------- error ---------- */
    if (logError) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-2 text-red-400">
                <AlertCircle size={18} />
                <p className="text-sm">{logError}</p>
            </div>
        );
    }

    /* ---------- main render ---------- */
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Activity Log
                    <span className="ml-1 text-sm font-normal text-text-muted">
                        ({logs.length} {logs.length === 1 ? 'event' : 'events'})
                    </span>
                </h3>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                    <RefreshCw size={12} />
                    Refresh
                </button>
            </div>

            {/* Pending Extension Alert — shown to client only */}
            {isClient && hasPendingExtension && (contractStatus === 'active' || contractStatus === 'paused') && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 bg-purple-500/15 border border-purple-500/30 rounded-xl p-4"
                >
                    <p className="text-sm font-semibold text-purple-300 mb-1">
                        ⏰ Freelancer has requested a deadline extension
                    </p>
                    <p className="text-xs text-text-muted mb-3">
                        See the "Ext. Req." entry below for details. Please approve or reject:
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleApprove('banner')}
                            disabled={actionIdx !== null}
                            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            {actionIdx === 'banner'
                                ? <Loader2 className="animate-spin" size={14} />
                                : <Check size={14} />}
                            Approve Extension
                        </button>
                        <button
                            onClick={() => handleReject('banner')}
                            disabled={actionIdx !== null}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            {actionIdx === 'banner'
                                ? <Loader2 className="animate-spin" size={14} />
                                : <X size={14} />}
                            Reject
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Timeline */}
            {logs.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                    <Clock size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No activity recorded yet.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* vertical rail */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

                    <ul className="space-y-5">
                        {logs.map((log, idx) => {
                            const { color, dot, label } = getMeta(log.action);

                            // Whether this specific entry is the pending extension
                            const isPendingExt =
                                log.action === 'extension_requested' && hasPendingExtension;

                            return (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="flex gap-4 pl-2"
                                >
                                    {/* coloured dot */}
                                    <div className={`relative z-10 flex-shrink-0 w-5 h-5 mt-0.5 rounded-full ${dot} ring-2 ring-[#0d0d0d]`} />

                                    {/* card */}
                                    <div className={`flex-1 border rounded-xl p-4 transition-colors ${isPendingExt
                                        ? 'bg-purple-500/10 border-purple-500/30'
                                        : 'bg-white/5 border-white/10 hover:bg-white/8'
                                        }`}>
                                        {/* badge + performer */}
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>
                                                {label}
                                            </span>
                                            {log.performedBy && (
                                                <span className="flex items-center gap-1 text-xs text-text-muted">
                                                    <User size={11} />
                                                    {log.performedBy.name || log.performedBy._id || 'Unknown'}
                                                    {log.performedBy.role && (
                                                        <span className="capitalize ml-1 opacity-60">
                                                            ({log.performedBy.role})
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {isPendingExt && (
                                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                                                    Pending
                                                </span>
                                            )}
                                        </div>

                                        {/* message */}
                                        {log.message && (
                                            <p className="text-sm text-white mt-1">{log.message}</p>
                                        )}

                                        {/* extra data (newDeadline, reason) */}
                                        {log.data?.newDeadline && (
                                            <p className="text-xs text-text-muted mt-1">
                                                New deadline:{' '}
                                                <span className="text-white font-medium">
                                                    {new Date(log.data.newDeadline).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                            </p>
                                        )}
                                        {log.data?.reason && (
                                            <p className="text-xs text-text-muted mt-0.5">
                                                Reason: <span className="text-white/80">{log.data.reason}</span>
                                            </p>
                                        )}

                                        {/* timestamp */}
                                        <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                                            <Clock size={10} />
                                            {formatDate(log.createdAt)}
                                        </p>

                                        {/* Inline Approve / Reject for client on pending entry */}
                                        {isClient && isPendingExt &&
                                            (contractStatus === 'active' || contractStatus === 'paused') && (
                                                <div className="flex gap-3 mt-3 pt-3 border-t border-purple-500/20">
                                                    <button
                                                        onClick={() => handleApprove(idx)}
                                                        disabled={actionIdx !== null}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {actionIdx === idx
                                                            ? <Loader2 className="animate-spin" size={14} />
                                                            : <Check size={14} />}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(idx)}
                                                        disabled={actionIdx !== null}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {actionIdx === idx
                                                            ? <Loader2 className="animate-spin" size={14} />
                                                            : <X size={14} />}
                                                        Reject
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ContractActivityLog;
