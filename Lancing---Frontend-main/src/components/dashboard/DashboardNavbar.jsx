import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import { AnimatePresence } from 'framer-motion';

const DashboardNavbar = ({ onMobileMenuToggle }) => {
    const { logout, user } = useAuth();
    const { notifications, unreadCount, loading, markAsRead } = useNotifications();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-[80px] w-full flex items-center justify-between px-6 md:px-10 sticky top-0 bg-[#050505cc] backdrop-blur-md border-b border-white/5 z-30">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="p-2 md:hidden text-text-muted hover:text-white"
                >
                    <Menu size={24} />
                </button>
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for projects, experts..."
                        className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-[300px]"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`relative p-2 transition-all rounded-full border ${isNotificationOpen ? 'bg-primary text-black border-primary' : 'bg-white/5 text-text-muted hover:text-white border-white/5'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-bg-dark">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotificationOpen && (
                            <NotificationDropdown
                                notifications={notifications}
                                loading={loading}
                                onMarkAsRead={markAsRead}
                                onClose={() => setIsNotificationOpen(false)}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold">{user?.name || 'Dashboard'}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1">Free Plan</p>
                    </div>
                    <button
                        onClick={logout}
                        title="Logout"
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-all border border-red-500/20"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;

