import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Palette, Megaphone, PenTool, Database, Video, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';

const HireTalent = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);

    const handleAuthAction = () => {
        const isAuthenticated = !!localStorage.getItem('token');
        if (!isAuthenticated) {
            navigate('/signup');
        } else {
            navigate('/post-job');
        }
    };

    const categories = [
        { icon: <Code size={32} />, title: 'Development', desc: 'Software Engineers, Web Developers, Mobile Devs', color: 'from-blue-500 to-cyan-400' },
        { icon: <Palette size={32} />, title: 'Design', desc: 'UI/UX Designers, Graphic Designers, Illustrators', color: 'from-purple-500 to-pink-500' },
        { icon: <Megaphone size={32} />, title: 'Marketing', desc: 'SEO Experts, Social Media Managers, Ad Specialists', color: 'from-orange-500 to-red-500' },
        { icon: <PenTool size={32} />, title: 'Writing', desc: 'Copywriters, Content Writers, Translators', color: 'from-green-500 to-emerald-400' },
        { icon: <Database size={32} />, title: 'Data Science', desc: 'Data Analysts, ML Engineers, AI Specialists', color: 'from-indigo-500 to-violet-500' },
        { icon: <Video size={32} />, title: 'Video & Audio', desc: 'Video Editors, Animators, Audio Engineers', color: 'from-pink-500 to-rose-400' }
    ];

    const features = [
        { icon: <Star className="text-yellow-400" />, title: 'Top Rated Talent', desc: 'Access the top 1% of freelancers vetted for quality.' },
        { icon: <Shield className="text-green-400" />, title: 'Secure Payments', desc: 'Money is released only when you approve the work.' },
        { icon: <Zap className="text-blue-400" />, title: 'Fast Hiring', desc: 'Find the right person for your job in minutes, not days.' }
    ];

    return (
        <div className="min-h-screen bg-bg-dark text-text-main font-sans selection:bg-primary selection:text-black">
            <main className="w-full pt-[80px]">
                <PageHero
                    title="Hire the World's Best"
                    highlight="Freelance Talent"
                    description="Connect with expert freelancers who can transform your ideas into reality. Quality work, secure payments, and zero headers."
                    searchPlaceholder="What expertise are you looking for?"
                    illustration={
                        <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">

                            {/* 1. Deep Space Particles */}
                            <div className="absolute inset-0 overflow-hidden rounded-full opacity-60 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute bg-white/30 rounded-full"
                                        initial={{
                                            x: Math.random() * 400 - 200,
                                            y: Math.random() * 400 - 200,
                                            scale: Math.random() * 0.5 + 0.5,
                                            opacity: Math.random() * 0.5
                                        }}
                                        animate={{
                                            y: [null, Math.random() * -30],
                                            opacity: [null, Math.random()]
                                        }}
                                        transition={{
                                            duration: Math.random() * 5 + 5,
                                            repeat: Infinity,
                                            yoyo: true
                                        }}
                                        style={{
                                            width: Math.random() * 3 + 1,
                                            height: Math.random() * 3 + 1,
                                            left: '50%',
                                            top: '50%'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* 2. Radar Scanner Overlay */}
                            <motion.div
                                className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent z-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{
                                    maskImage: 'conic-gradient(from 0deg, transparent 0deg, black 360deg)',
                                    WebkitMaskImage: 'conic-gradient(from 0deg, transparent 0deg, black 360deg)'
                                }}
                            />

                            {/* 3. Central Neural Hub */}
                            <div className="relative z-20">
                                <motion.div
                                    className="w-24 h-24 rounded-full bg-bg-dark border-2 border-primary/50 flex items-center justify-center shadow-[0_0_60px_rgba(204,255,0,0.3)] z-20 relative"
                                    animate={{
                                        boxShadow: ["0 0 20px rgba(204,255,0,0.2)", "0 0 100px rgba(204,255,0,0.6)", "0 0 20px rgba(204,255,0,0.2)"],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Zap size={40} className="text-primary" fill="currentColor" />
                                </motion.div>
                                {/* Core Ripples */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/30"
                                    animate={{ scale: 3, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/30"
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                            </div>

                            {/* 4. Orbiting Talent Network (Container rotates) */}
                            <motion.div
                                className="absolute w-[360px] h-[360px] rounded-full border border-white/5 z-10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            >
                                {/* Nodes placed at angles */}
                                {[
                                    { icon: <Code size={20} />, label: "Dev" },
                                    { icon: <Palette size={20} />, label: "UI/UX Design" },
                                    { icon: <Megaphone size={20} />, label: "Marketing" },
                                    { icon: <PenTool size={20} />, label: "Content Writing" },
                                    { icon: <Database size={20} />, label: "Data Science" },
                                    { icon: <Video size={20} />, label: "Video Editing" }
                                ].map((item, i) => {
                                    const angle = (i * 60);
                                    return (
                                        <div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 w-0 h-0"
                                            style={{
                                                transform: `rotate(${angle}deg) translate(180px) rotate(-${angle}deg)`
                                            }}
                                        >
                                            {/* Counter-rotate the content so text/icon stays upright while orbiting */}
                                            <motion.div
                                                className="relative -translate-x-1/2 -translate-y-1/2"
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                            >
                                                {/* Connecting Line to Center (Visual only, relative to node position) */}
                                                <motion.div
                                                    className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-primary/50 to-transparent origin-left -z-10"
                                                    style={{
                                                        width: '180px',
                                                        transform: `translate(-180px, -50%) rotate(${angle + 180}deg)` // Point back to center
                                                    }}
                                                />

                                                {/* Premium Glass Badge */}
                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full shadow-xl hover:border-primary/50 transition-colors group cursor-default">
                                                    <div className="text-white group-hover:text-primary transition-colors">{item.icon}</div>
                                                    <span className="text-sm font-medium text-white/90 whitespace-nowrap">{item.label}</span>
                                                </div>

                                                {/* Active Status Dot */}
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </motion.div>

                        </div>
                    }
                />

                <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20 space-y-12">

                    {/* Categories Grid */}
                    <section className="py-12">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-white">Explore by Category</h2>
                                <p className="text-text-muted">Find professionals in every field</p>
                            </div>
                            <a href="#" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
                                View all categories <ArrowRight size={18} />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    onClick={handleAuthAction}
                                    onMouseEnter={() => setActiveCategory(idx)}
                                    onMouseLeave={() => setActiveCategory(null)}
                                    className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all overflow-hidden cursor-pointer"
                                >
                                    <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-all duration-500`} />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                            <div className="text-white group-hover:text-primary transition-colors">{cat.icon}</div>
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-primary transition-colors">{cat.title}</h3>
                                        <p className="text-text-muted group-hover:text-white transition-colors">{cat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="px-[5%] py-24 bg-transparent">
                        <div className="container mx-auto">
                            <div className="max-w-3xl mx-auto text-center mb-16">
                                <h2 className="text-4xl font-bold mb-4 text-white">Why businesses choose <span className="text-primary">Navlancer</span></h2>
                                <p className="text-text-muted text-lg">We provide the tools and talent you need to succeed.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-all hover:-translate-y-1"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                        <p className="text-text-muted leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <button className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold rounded-full border border-white/20 shadow-sm transition-all hover:border-primary">
                                    Learn more about our vetting process
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="px-[5%] py-20 bg-transparent">
                        <div className="bg-[#111] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to hire your next star?</h2>
                                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                                    Join thousands of businesses who use Navlancer to find and hire top freelance talent.
                                </p>
                                <button
                                    onClick={handleAuthAction}
                                    className="bg-primary text-black text-lg font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(204,255,0,0.4)]"
                                >
                                    Post a Job for Free
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HireTalent;
