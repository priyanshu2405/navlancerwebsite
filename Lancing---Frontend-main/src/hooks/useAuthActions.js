import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useAuthActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const uploadAvatar = useCallback(async (file) => {
        setLoading(true);
        setError(null);

        // Simulating frontend processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Generating a fake URL for demo purposes
            const fakeUrl = URL.createObjectURL(file);
            return { success: true, data: { avatarUrl: fakeUrl } };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const changeEmail = useCallback(async (newEmail) => {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Simulate success
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Simulate success
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        uploadAvatar,
        changeEmail,
        changePassword,
        loading,
        error
    };
}
