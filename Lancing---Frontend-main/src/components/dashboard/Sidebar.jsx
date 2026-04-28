import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Wallet,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Heart,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { role } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const clientLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/client/dashboard' },
        { icon: <Search size={20} />, label: 'Hire Experts', path: '/client/browse-experts' },
        { icon: <Briefcase size={20} />, label: 'My Jobs', path: '/client/my-jobs' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
        { icon: <Briefcase size={20} />, label: 'Proposals', path: '/client/proposals' },
        { icon: <Wallet size={20} />, label: 'Payments', path: '/payments' },
        { icon: <User size={20} />, label: 'Profile', path: '/client/profile' },
    ];

    const freelancerLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/freelancer/dashboard' },
        { icon: <Search size={20} />, label: 'Browse Jobs', path: '/freelancer/browse-jobs' },
        { icon: <Briefcase size={20} />, label: 'My Proposals', path: '/freelancer/proposals' },
        { icon: <Heart size={20} />, label: 'Saved Jobs', path: '/freelancer/saved-jobs' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
        { icon: <Wallet size={20} />, label: 'Earnings', path: '/freelancer/earnings' },
        { icon: <Settings size={20} />, label: 'My Profile', path: '/freelancer/profile' },
    ];

    const links = role === 'client' ? clientLinks : freelancerLinks;

    return (
        <aside
            className={`h-screen sticky top-0 bg-bg-card border-r border-white/5 transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-6 border-b border-white/5 overflow-hidden whitespace-nowrap">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xl">L</span>
                </div>
                {!isCollapsed && (
                    <span className="ml-3 text-xl font-bold tracking-tight">Navlancer<span className="text-primary">.</span></span>
                )}
            </div>

            {/* Links */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(204,255,0,0.05)]'
                                : 'text-text-muted hover:bg-white/5 hover:text-text-main'}
                        `}
                    >
                        <div className="flex-shrink-0">{link.icon}</div>
                        {!isCollapsed && (
                            <span className="font-medium whitespace-nowrap">{link.label}</span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-white text-black text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                {link.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Profile / Bottom area */}
            <div className="p-4 border-t border-white/5">
                {!isCollapsed && (
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{role === 'client' ? 'Client Account' : 'Freelancer Account'}</p>
                            <p className="text-xs text-text-muted truncate">Verified</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center py-2 text-text-muted hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft size={20} />
                            <span className="text-sm font-semibold">Collapse</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
