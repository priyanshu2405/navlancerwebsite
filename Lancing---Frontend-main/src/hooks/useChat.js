import { useState, useCallback, useEffect } from 'react';
import API_BASE_URL from '../config/api';

/**
 * Custom hook for chat functionality
 * @param {string} contractId - The ID of the contract for the chat
 * @returns {object} { messages, loading, sending, error, sendMessage, refresh }
 */
export const useChat = (contractId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch chat history for the contract
     */
    const fetchMessages = useCallback(async () => {
        if (!contractId) return;

        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/messages/${contractId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Treat "no conversation yet" as an empty message list instead of an error
            if (response.status === 404) {
                setMessages([]);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch messages');
            }

            const data = await response.json();
            // Backend might return { messages: [] } or just []
            const fetchedMessages = Array.isArray(data) ? data : (data.messages || []);
            setMessages(fetchedMessages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [contractId]);

    /**
     * Send a new message
     * @param {string} messageText - The content of the message
     */
    const sendMessage = useCallback(async (messageText) => {
        if (!contractId || !messageText.trim()) return;

        setSending(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractId,
                    message: messageText
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to send message');
            }

            const newMessage = await response.json();
            setError(null); // Clear any previous errors on success

            // Append new message to local state
            setMessages(prev => [...prev, newMessage]);

            return { success: true, data: newMessage };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setSending(false);
        }
    }, [contractId]);

    // Initial fetch and 5-second polling
    useEffect(() => {
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    return {
        messages,
        loading,
        sending,
        error,
        sendMessage,
        refresh: fetchMessages
    };
};
