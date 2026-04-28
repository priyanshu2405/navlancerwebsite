import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { isAuthenticated, profileCompleted, role, loading } = useAuth();
    const currentPath = window.location.pathname;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (requiredRole === 'admin') return <Navigate to="/admin/login" replace />;
        return <Navigate to="/login" replace />;
    }

    if (profileCompleted && currentPath === '/profile-setup') {
        console.log("ProtectedRoute: Redirecting from /profile-setup. role=", role);
        if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to={role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'} replace />;
    }

    if (requiredRole && role !== requiredRole) {
        console.log("ProtectedRoute: Role mismatch! Redirecting. role=", role, "requiredRole=", requiredRole);
        // If user has wrong role, redirect to their respective dashboard or home
        if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        // Fallback or explicit check for other roles
        if (role === 'client') return <Navigate to="/client/dashboard" replace />;
        if (role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
        // Safety fallback if undefined
        console.log("ProtectedRoute: Undefined role, redirecting to /login", role);
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
