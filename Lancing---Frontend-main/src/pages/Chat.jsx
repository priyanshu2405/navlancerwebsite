import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Loader2, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';
import { useContract } from '../hooks/useContract';

/**
 * ChatPage Component
 * Displays chat history and allows sending new messages
 */
const Chat = () => {
    const { contractId } = useParams();
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch contract so we can derive the correct recipient name from real data
    const { contract } = useContract(contractId);
    const { messages, loading, sending, error, sendMessage } = useChat(contractId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Derive recipient name from contract — always show the OTHER person's name
    const getRecipientName = () => {
        if (contract) {
            const isClient = role === 'client' || role === 'Client';
            return isClient
                ? (contract.freelancerId?.name || 'Freelancer')
                : (contract.clientId?.name || 'Client');
        }
        // Fallback while contract is loading
        return location.state?.recipientName || 'Loading...';
    };

    const recipientName = getRecipientName();


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const currentMessage = newMessage;
        setNewMessage(''); // Clear input optimistically

        const result = await sendMessage(currentMessage);
        if (!result.success) {
            alert('Failed to send message: ' + result.error);
            setNewMessage(currentMessage); // Restore input on failure
        }
    };

    return (
        /* 
         * DashboardLayout's <main> has p-4 md:p-8 lg:p-10 padding.
         * We use -m-* to cancel it and make chat fill edge-to-edge.
         * The h-[calc] accounts for the 80px DashboardNavbar.
         */
        <div className="flex flex-col -m-4 md:-m-8 lg:-m-10" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="flex flex-col flex-1 overflow-hidden p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/contract/${contractId}`)}
                            className="text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-colors text-text-muted hover:text-white"
                        >
                            VIEW CONTRACT
                        </button>
                        <h1 className="text-xl font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest text-primary">
                            Contract #{contractId.slice(-6).toUpperCase()}
                        </h1>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                    {/* Recipient Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <User size={20} className="text-black" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{recipientName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-text-muted font-medium">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading && messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                                <p className="text-text-muted">Loading messages...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
                                {error}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-text-muted py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                No messages yet. Start the conversation!
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const myId = user?._id || user?.id;
                                const senderId = msg.senderId?._id || msg.senderId || msg.sender;
                                const isMe = (msg.senderType && user?.role)
                                    ? msg.senderType === user.role
                                    : senderId === myId;
                                return (
                                    <div
                                        key={msg._id || idx}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${isMe
                                            ? 'bg-primary text-black rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none border border-white/5 shadow-lg'
                                            }`}>
                                            {!isMe && (
                                                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-tighter">
                                                    {recipientName}
                                                </p>
                                            )}
                                            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed font-medium">
                                                {msg.message}
                                            </p>
                                            <p className={`text-[10px] mt-2 block text-right font-bold ${isMe ? 'opacity-60' : 'opacity-40'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all font-medium text-lg"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-primary text-black px-8 rounded-2xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-black uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                            >
                                {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
