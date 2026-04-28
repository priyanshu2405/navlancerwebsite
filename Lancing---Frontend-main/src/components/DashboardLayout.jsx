import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import DashboardNavbar from './dashboard/DashboardNavbar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-bg-dark text-text-main overflow-hidden">
            {/* Sidebar - Desktop stays, Mobile is overlay */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed left-0 top-0 bottom-0 z-[60] md:hidden"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardNavbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 blur-[120px] -z-10 rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
