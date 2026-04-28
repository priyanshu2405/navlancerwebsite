import React from 'react';
import { LayoutGrid, Briefcase, Users, Star, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', active: false },
        { icon: Briefcase, label: 'Find Work', active: true },
        { icon: Users, label: 'My Jobs', active: false },
        { icon: Star, label: 'Saved', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <aside className="w-64 hidden lg:block bg-card border-r border-border h-screen sticky top-0 p-6 flex-shrink-0">
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-foreground">Navlancer</h2>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${item.active
                                ? 'bg-primary-light text-black font-medium shadow-sm'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-10">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                    Filters
                </h3>
                <div className="space-y-3 px-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" defaultChecked />
                        <span className="text-sm text-foreground">Full Time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" defaultChecked />
                        <span className="text-sm text-foreground">Fixed Price</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
                        <span className="text-sm text-foreground">Hourly</span>
                    </label>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
