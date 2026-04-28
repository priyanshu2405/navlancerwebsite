import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-[380px] bg-bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 overflow-hidden"
        >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Bell size={18} className="text-primary" />
                    Notifications
                </h3>
                {notifications.length > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {notifications.filter(n => !n.isRead).length} New
                    </span>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-text-muted">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={24} className="text-text-muted" />
                        </div>
                        <p className="text-sm text-text-muted">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-4 transition-colors relative group ${notification.isRead ? 'opacity-60' : 'bg-primary/5'}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-primary shadow-[0_0_8px_rgba(204,255,0,0.6)]'}`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-text-main font-medium leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                                <Clock size={10} />
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => onMarkAsRead(notification._id)}
                                                    className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold uppercase tracking-widest"
                                                >
                                                    <Check size={10} />
                                                    Mark read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {notification.link && (
                                    <a
                                        href={notification.link}
                                        className="absolute inset-0 z-0"
                                        onClick={(e) => {
                                            if (e.target.closest('button')) e.preventDefault();
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-white/5 bg-white/5">
                <button
                    className="w-full text-center text-xs text-text-muted hover:text-primary transition-colors font-medium py-1"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </motion.div>
    );
};

export default NotificationDropdown;
