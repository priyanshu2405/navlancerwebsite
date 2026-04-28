import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';


const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-between pt-[120px] px-[5%] overflow-hidden bg-[radial-gradient(circle_at_15%_50%,rgba(204,255,0,0.08)_0%,transparent_40%),radial-gradient(circle_at_85%_30%,rgba(40,40,255,0.05)_0%,transparent_40%)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)] pointer-events-none z-0"></div>

            <motion.div
                className="flex-1 max-w-[600px] z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h1
                    className="text-[4.5rem] leading-[1.1] font-bold mb-14 tracking-[-1.5px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Where Skills Meet <br />
                    <span className="text-primary block">Real Opportunities</span>
                </motion.h1>

                <p className="text-[1.1rem] text-text-muted mb-10 leading-relaxed max-w-[480px]">
                    Navlancer by Navsant Group is a modern freelancing platform where
                    skilled professionals and growing businesses collaborate,
                    innovate, and succeed together.
                </p>

                <div className="flex gap-6 items-center">
                    <button className="px-10 py-4 font-semibold text-[1.1rem] bg-primary text-black rounded-full hover:bg-opacity-90 transition-all">Join Now</button>
                    <button className="flex items-center gap-2 px-8 py-4 border border-border text-text-main rounded-full bg-transparent text-base transition-all duration-200 hover:border-text-main hover:bg-white/5">
                        <PlusCircle size={20} />
                        Add a company
                    </button>
                </div>
            </motion.div>

            <motion.div
                className="flex-1 relative h-[600px] w-full max-w-[600px] lg:max-w-none mask-gradient-vertical overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

                {/* Grid Container - Rotated for 3D effect */}
                <div className="absolute inset-0 flex justify-center gap-6 transform -skew-y-6 scale-110 origin-center z-10 opacity-80 lg:opacity-100">

                    {/* Column 1 - Scroll Up */}
                    <div className="flex flex-col gap-6 animate-marquee-up">
                        {[...talents, ...talents].map((talent, i) => (
                            <TalentCard key={`col1-${i}`} talent={talent} />
                        ))}
                    </div>

                    {/* Column 2 - Scroll Down (Slightly offset) */}
                    <div className="flex flex-col gap-6 animate-marquee-down pt-20">
                        {[...talents.reverse(), ...talents].map((talent, i) => (
                            <TalentCard key={`col2-${i}`} talent={talent} />
                        ))}
                    </div>

                    {/* Column 3 - Scroll Up */}
                    <div className="flex flex-col gap-6 animate-marquee-up pt-10">
                        {[...talents, ...talents].map((talent, i) => (
                            <TalentCard key={`col3-${i}`} talent={talent} />
                        ))}
                    </div>

                </div>

                {/* Gradient Overlays for smooth fade out */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-bg-dark to-transparent z-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg-dark to-transparent z-20 pointer-events-none"></div>

            </motion.div>
        </section>
    );
};

// Mock Data for Talent Grid
const talents = [
    { name: "Alex R.", role: "UI/UX Designer", rate: "$45/hr", skills: ["Figma", "React"] },
    { name: "Sarah M.", role: "Full Stack Dev", rate: "$60/hr", skills: ["Node.js", "Python"] },
    { name: "David K.", role: "Copywriter", rate: "$35/hr", skills: ["SEO", "Content"] },
    { name: "Emily J.", role: "Mobile Dev", rate: "$55/hr", skills: ["Flutter", "Swift"] },
    { name: "Michael C.", role: "DevOps", rate: "$70/hr", skills: ["AWS", "Docker"] },
];

const TalentCard = ({ talent }) => (
    <div className="w-64 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10"></div>
            <div>
                <h4 className="font-semibold text-white leading-tight">{talent.name}</h4>
                <p className="text-xs text-text-muted">{talent.role}</p>
            </div>
            <div className="ml-auto text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                {talent.rate}
            </div>
        </div>
        <div className="flex flex-wrap gap-2">
            {talent.skills.map(skill => (
                <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/5">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

export default Hero;
