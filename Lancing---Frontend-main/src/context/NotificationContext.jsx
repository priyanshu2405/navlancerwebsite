import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config/api';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthToken = () => localStorage.getItem('token');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data.notifications || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread count');
            }

            const data = await response.json();
            setUnreadCount(data.count || data.unreadCount || 0);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId) => {
        setError(null);
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state proactively
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setError(null);
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark all as read');
            }

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    const clearNotifications = useCallback(async () => {
        setError(null);
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear notifications');
            }

            setNotifications([]);
            setUnreadCount(0);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Initial fetch and polling for unread count & notifications
    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            fetchUnreadCount();
            fetchNotifications();

            // Poll every 30 seconds for both count and actual list
            const interval = setInterval(() => {
                fetchUnreadCount();
                fetchNotifications();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [fetchUnreadCount, fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            error,
            addNotification: (n) => setNotifications(prev => [n, ...prev]), // Local add if needed
            markAsRead,
            markAllAsRead,
            clearNotifications,
            refresh: () => {
                fetchNotifications();
                fetchUnreadCount();
            }
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
