import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, CheckCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import { useContract } from '../../hooks/useContract';
import ReviewModal from '../ReviewModal';

const ChatInterface = ({ contractId, recipientName }) => {
    const { user } = useAuth();
    const { messages, loading, sending, error, sendMessage, sendTypingStatus, markAsRead, recipientTyping } = useChat(contractId);
    const { contract, completeContract } = useContract(contractId);

    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);

    const handleCompleteContract = async () => {
        if (window.confirm("Are you sure you want to complete this contract? This action cannot be undone.")) {
            const result = await completeContract();
            if (result.success) {
                setIsReviewModalOpen(true);
            } else {
                alert("Failed to complete contract: " + (result.error || "Unknown error"));
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Clear typing status immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setIsTyping(false);
        sendTypingStatus(false);

        const result = await sendMessage(newMessage);
        if (result.success) {
            setNewMessage('');
        }
    };

    const isMe = (msg) => {
        // If senderType is available, it's the most reliable way to distinguish
        if (msg.senderType && user?.role) {
            return msg.senderType === user.role;
        }
        // Fallback to ID check
        const myId = user?._id || user?.id;
        const senderId = msg.senderId?._id || msg.senderId || msg.sender;
        return senderId === myId;
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] bg-white/5 rounded-3xl border border-white/10">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-text-muted">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{recipientName || 'Chat'}</h3>
                        <div className="flex items-center gap-2">
                            {contract?.status === 'completed' ? (
                                <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle size={12} /> Completed
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs text-text-muted">Active now</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Complete Contract Button (Client Only) */}
                {user?.role === 'client' && contract?.status !== 'completed' && (
                    <button
                        onClick={handleCompleteContract}
                        className="px-4 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors text-sm shadow-[0_0_15px_rgba(204,255,0,0.2)] flex items-center gap-2"
                    >
                        <CheckCircle size={16} />
                        <span className="hidden sm:inline">Complete Contract</span>
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {error && (
                    <div className="text-center p-2 mb-4 bg-red-500/10 text-red-500 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {messages.length === 0 && !loading && (
                    <div className="text-center text-text-muted py-10">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const me = isMe(msg);
                        return (
                            <motion.div
                                key={msg._id || idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${me ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-4 rounded-2xl ${me
                                        ? 'bg-primary text-black rounded-tr-none'
                                        : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                    <div className="flex justify-end items-end gap-1 mt-1">
                                        <span className={`text-[10px] block ${me ? 'text-black/60' : 'text-white/40'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {me && (
                                            <span className="text-[10px] font-bold">
                                                {msg.read ? (
                                                    <span className="text-blue-600">✓✓</span>
                                                ) : (
                                                    <span className="text-black/40">✓</span>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-primary text-black p-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                    >
                        {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </form>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                contractId={contractId}
            />
        </div>
    );
};

export default ChatInterface;
