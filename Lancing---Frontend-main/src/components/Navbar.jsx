import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkClasses = (path) => `
        text-[0.95rem] font-medium relative 
        after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full
        ${isActive(path) ? 'text-text-main after:w-full' : 'text-text-muted after:w-0 hover:text-text-main'}
    `;

    return (
        <motion.nav
            className="fixed top-0 left-0 w-full h-[80px] flex items-center justify-between px-[5%] z-50 bg-[#050505cc] backdrop-blur-[10px] border-b border-white/5 transition-all duration-300"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Link to="/" className="text-[1.5rem] font-bold text-text-main tracking-[-0.5px] flex items-center gap-2 no-underline" >
                <Hexagon color="#ccff00" fill="rgba(204, 255, 0, 0.1)" strokeWidth={2.5} />
                Navlancer<span className="text-primary">.</span>
            </Link>

            <ul className="flex gap-10 list-none">
                <li><Link to="/" className={linkClasses('/')}>Home</Link></li>
                <li><Link to="/jobs" className={linkClasses('/jobs')}>Find Jobs</Link></li>
                <li><Link to="/hire-talent" className={linkClasses('/hire-talent')}>Hire Experts</Link></li>
                <li className="relative group">
                    <a
                        href="#"
                        className="text-[0.95rem] text-text-muted font-medium relative hover:text-text-main after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full"
                    >
                        Why Navlancer
                    </a>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-4 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

                            {/* Header */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2">Why Choose Navlancer?</h3>
                                <p className="text-sm text-gray-500">The smarter way to work and hire</p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Feature 1 */}
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">⚡</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[#0f172a] font-semibold text-sm mb-1">Lightning Fast</h4>
                                        <p className="text-gray-600 text-xs leading-relaxed">Find talent or jobs in minutes, not weeks</p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">🛡️</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[#0f172a] font-semibold text-sm mb-1">100% Secure</h4>
                                        <p className="text-gray-600 text-xs leading-relaxed">Protected payments and verified profiles</p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">🌟</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[#0f172a] font-semibold text-sm mb-1">Top 1% Talent</h4>
                                        <p className="text-gray-600 text-xs leading-relaxed">Vetted professionals across all fields</p>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">💰</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[#0f172a] font-semibold text-sm mb-1">Fair Pricing</h4>
                                        <p className="text-gray-600 text-xs leading-relaxed">No hidden fees, transparent costs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#0f172a] mb-1">50K+</div>
                                    <div className="text-xs text-gray-500">Active Freelancers</div>
                                </div>
                                <div className="text-center border-l border-r border-gray-200">
                                    <div className="text-2xl font-bold text-[#0f172a] mb-1">10K+</div>
                                    <div className="text-xs text-gray-500">Projects Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#0f172a] mb-1">98%</div>
                                    <div className="text-xs text-gray-500">Satisfaction Rate</div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <Link
                                    to="/signup"
                                    className="block w-full text-center bg-primary text-black font-bold py-3 rounded-full hover:bg-primary/90 transition-all hover:shadow-[0_4px_20px_rgba(204,255,0,0.4)] no-underline"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <div className="flex items-center gap-6">
                <Link to="/login" className="text-text-main font-medium text-[0.95rem]">Log In</Link>
                <Link to="/signup" className="px-6 py-[0.7rem] bg-primary text-black font-semibold rounded-full text-[0.95rem] transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(204,255,0,0.5)] no-underline">Sign Up</Link>
            </div>
        </motion.nav>
    );
};

export default Navbar;
