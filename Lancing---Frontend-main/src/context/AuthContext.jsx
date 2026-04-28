import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const [role, setRoleState] = useState(localStorage.getItem('role') || null);
    const [token, setTokenState] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [profileCompleted, setProfileCompleted] = useState(localStorage.getItem('profileCompleted') === 'true');
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setUser(null);
        setRoleState(null);
        setTokenState(null);
        setIsAuthenticated(false);
        setProfileCompleted(false);
        localStorage.clear(); // Clear all to be safe, including token
        window.location.href = '/login';
    }, []);

    const setRole = useCallback((newRole) => {
        setRoleState(newRole);
        localStorage.setItem('role', newRole);
    }, []);

    const login = useCallback((userData, token) => {
        setUser(userData);
        setTokenState(token);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        const isProfileCompleted = !!userData.profileCompleted;
        setProfileCompleted(isProfileCompleted);
        localStorage.setItem('profileCompleted', isProfileCompleted ? 'true' : 'false');

        if (userData.role) {
            setRole(userData.role);
        }
    }, [setRole]);

    const completeProfile = useCallback(() => {
        setProfileCompleted(true);
        localStorage.setItem('profileCompleted', 'true');
    }, []);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            setLoading(false);
            return;
        }

        // DUMMY ADMIN BYPASS: Prevent real backend or mock interceptor from overwriting the dummy admin session
        if (token === 'dummy-admin-token') {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setRoleState(data.user.role);
                setTokenState(token);
                setIsAuthenticated(true);
                setProfileCompleted(!!data.user.profileCompleted);

                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('profileCompleted', data.user.profileCompleted ? 'true' : 'false');
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                token,
                isAuthenticated,
                profileCompleted,
                loading,
                setRole,
                login,
                logout,
                completeProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
