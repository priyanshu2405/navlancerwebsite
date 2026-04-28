import React from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Code, Globe, Database, Video, PenTool, Cpu, LineChart } from 'lucide-react';
import PageHero from '../components/PageHero';
import JobsGrid from '../components/JobsGrid';

const FloatingJobCard = ({ top, left, right, bottom, icon, title, sub, delay }) => (
    <motion.div
        className="absolute bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-lg hover:border-primary/50 transition-colors cursor-pointer"
        style={{ top, left, right, bottom }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
    >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
        </div>
        <div>
            <p className="text-xs font-semibold text-white whitespace-nowrap">{title}</p>
            <p className="text-[10px] text-text-muted">{sub}</p>
        </div>
    </motion.div>
);

const FindJobsPage = () => {
    return (
        <div className="min-h-screen bg-bg-dark text-text-main font-sans selection:bg-primary selection:text-black">

            <main className="w-full pt-[80px]">

                <PageHero
                    title="Find Your Next"
                    highlight="Dream Job"
                    description="Explore thousands of high-quality job postings from top companies. From design to development, we have it all."
                    searchPlaceholder="Search by job title, skill, or keyword..."
                    illustration={
                        <div className="relative w-full h-[400px] flex items-center justify-center">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>

                            {/* Rotating Rings */}
                            <motion.div
                                className="absolute w-[350px] h-[350px] border border-primary/10 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute w-[250px] h-[250px] border border-primary/20 rounded-full border-dashed"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Center Radar */}
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                                    <Search className="text-primary w-8 h-8" />
                                </div>
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/50"
                                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>

                            {/* Floating Job Cards */}
                            <FloatingJobCard
                                top="15%" left="10%"
                                icon={<Briefcase size={16} />}
                                title="Product Designer"
                                sub="Remote • $120k"
                                delay={0}
                            />
                            <FloatingJobCard
                                bottom="20%" right="5%"
                                icon={<Code size={16} />}
                                title="React Developer"
                                sub="Contract • $80/hr"
                                delay={1.5}
                            />
                            <FloatingJobCard
                                top="30%" right="0%"
                                icon={<Globe size={16} />}
                                title="Marketing Lead"
                                sub="New York • Full-time"
                                delay={3}
                            />
                            <FloatingJobCard
                                bottom="10%" left="15%"
                                icon={<Database size={16} />}
                                title="Backend Eng."
                                sub="London • $140k"
                                delay={4.5}
                            />
                            {/* New Cards */}
                            <FloatingJobCard
                                top="8%" right="25%"
                                icon={<Video size={16} />}
                                title="Video Editor"
                                sub="Remote • $60/hr"
                                delay={1.0}
                            />
                            <FloatingJobCard
                                bottom="35%" left="5%"
                                icon={<PenTool size={16} />}
                                title="Logo Designer"
                                sub="Project • $500"
                                delay={2.5}
                            />
                            <FloatingJobCard
                                top="45%" right="10%"
                                icon={<Cpu size={16} />}
                                title="AI Engineer"
                                sub="SF • $180k"
                                delay={3.5}
                            />
                            <FloatingJobCard
                                bottom="5%" right="30%"
                                icon={<LineChart size={16} />}
                                title="SEO Specialist"
                                sub="Part-time • $45/hr"
                                delay={5.0}
                            />
                        </div>
                    }
                />

                <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20 space-y-12">

                    {/* Jobs Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-foreground">
                                Latest Opportunities
                            </h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Browse All
                                </button>
                            </div>
                        </div>
                        <JobsGrid />
                    </section>

                </div>
            </main>
        </div>
    );
};

export default FindJobsPage;
