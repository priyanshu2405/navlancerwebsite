import React from 'react';
import { Briefcase, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HiringIntent = ({ data, updateData }) => {
    const options = [
        {
            id: 'short-term',
            title: 'Short-term Project',
            desc: 'One-time tasks or specific small projects',
            icon: <Zap size={24} />
        },
        {
            id: 'long-term',
            title: 'Long-term Partnership',
            desc: 'Looking for talent to work on ongoing work',
            icon: <Clock size={24} />
        },
        {
            id: 'expert-only',
            title: 'Specialized Expert',
            desc: 'Need high-level expertise for niche tasks',
            icon: <Briefcase size={24} />
        }
    ];

    return (
        <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-1">
                <h2 className="text-3xl font-black mb-2 tracking-tight">What's your hiring intent?</h2>
                <p className="text-text-muted text-lg">Select the path that fits your current project goals.</p>
            </div>

            <div className="space-y-4">
                {options.map((opt) => (
                    <motion.div
                        key={opt.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => updateData('hiring', { ...data, intent: opt.id })}
                        className={`group flex items-center gap-5 p-6 rounded-3xl border-2 cursor-pointer transition-all ${data.intent === opt.id
                            ? 'bg-primary/5 border-primary shadow-[0_10px_30px_rgba(204,255,0,0.1)]'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                            }`}
                    >
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${data.intent === opt.id ? 'bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'bg-white/5 text-primary'}`}>
                            {opt.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-1 transition-colors ${data.intent === opt.id ? 'text-primary' : 'text-white'}`}>{opt.title}</h3>
                            <p className="text-text-muted font-medium">{opt.desc}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${data.intent === opt.id ? 'border-primary bg-primary/20' : 'border-white/10'
                            }`}>
                            <div className={`w-4 h-4 bg-primary rounded-full transition-all duration-500 ${data.intent === opt.id ? 'scale-100 opacity-100 shadow-[0_0_10px_rgba(204,255,0,0.8)]' : 'scale-0 opacity-0'}`}></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HiringIntent;
