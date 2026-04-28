import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PieChart,
    Users,
    UserCheck,
    UserRound,
    ShieldCheck,
    Briefcase,
    FileText,
    Wallet,
    Receipt,
    ShieldAlert,
    LifeBuoy,
    Bell,
    Settings,
    ShieldHalf,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuGroups = [
        {
            label: 'Dashboard',
            items: [
                { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/admin/dashboard' },
                { icon: <PieChart className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
            ]
        },
        {
            label: 'Users',
            items: [
                { icon: <UserCheck className="w-5 h-5" />, label: 'Clients', path: '/admin/clients' },
                { icon: <UserRound className="w-5 h-5" />, label: 'Freelancers', path: '/admin/freelancers' },
                { icon: <ShieldCheck className="w-5 h-5" />, label: 'Verification', path: '/admin/verifications' },
            ]
        },
        {
            label: 'Projects',
            items: [
                { icon: <Briefcase className="w-5 h-5" />, label: 'Projects', path: '/admin/jobs' },
                { icon: <FileText className="w-5 h-5" />, label: 'Contracts', path: '/admin/contracts' },
            ]
        },
        {
            label: 'Finance',
            items: [
                { icon: <Wallet className="w-5 h-5" />, label: 'Payment', path: '/admin/financials' },
                { icon: <Receipt className="w-5 h-5" />, label: 'Transactions', path: '/admin/transactions' },
            ]
        },
        {
            label: 'Support',
            items: [
                { icon: <ShieldAlert className="w-5 h-5" />, label: 'Disputes', path: '/admin/disputes' },
                { icon: <LifeBuoy className="w-5 h-5" />, label: 'Support Tickets', path: '/admin/support' },
                { icon: <Bell className="w-5 h-5" />, label: 'Notifications', path: '/admin/notifications', badge: 5 },
            ]
        },
        {
            label: 'System',
            items: [
                { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
                { icon: <ShieldHalf className="w-5 h-5" />, label: 'Roles & Permissions', path: '/admin/roles' },
            ]
        }
    ];

    return (
        <aside
            className={`h-screen sticky top-0 bg-bg-dark border-r border-white/5 transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-6 border-b border-white/5 overflow-hidden whitespace-nowrap">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                    <span className="text-black font-black text-xl">A</span>
                </div>
                {!isCollapsed && (
                    <span className="ml-3 text-xl font-bold tracking-tight text-white">
                        Admin<span className="text-primary">.</span>
                    </span>
                )}
            </div>

            {/* Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {menuGroups.map((group, groupIdx) => (
                    <div key={group.label} className={groupIdx > 0 ? 'mt-6' : ''}>
                        {!isCollapsed && (
                            <h3 className="px-4 text-xs font-bold uppercase tracking-widest text-[#555] mb-2">
                                {group.label}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                                        ${isActive
                                            ? 'bg-primary/5 text-green-400 border border-green-500/20 active-link'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                    `}
                                >
                                    {/* Left Active Indicator */}
                                    <span className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full opacity-0 scale-y-0 transition-all duration-300 group-[.active-link]:opacity-100 group-[.active-link]:scale-y-100" />
                                    
                                    <div className={`flex-shrink-0 transition-colors duration-200 group-hover:text-white group-[.active-link]:text-primary`}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex flex-1 items-center justify-between min-w-0">
                                            <span className="font-medium whitespace-nowrap tracking-tight">{item.label}</span>
                                            {item.badge && (
                                                <span className="px-1.5 py-0.5 bg-primary text-black text-[10px] font-black rounded-md">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                                            {item.label}
                                        </div>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile / Bottom area */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                {!isCollapsed && (
                    <div className="mt-2 bg-primary/5 p-4 rounded-2xl flex items-center gap-3 border border-primary/5 shadow-[0_4px_20px_rgba(204,255,0,0.03)]">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_10px_rgba(204,255,0,0.1)]">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">Administrator</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 truncate">Full Access</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full mt-4 flex items-center justify-center py-2.5 text-gray-500 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-xl"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Collapse View</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;

