import React from 'react';
import { Star, Award, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const ExperienceLevel = ({ data, updateData }) => {
    const levels = [
        {
            id: 'new',
            title: 'New to Freelancing',
            desc: 'I haven\'t hired freelancers before',
            icon: <Star size={24} />
        },
        {
            id: 'intermediate',
            title: 'Some Experience',
            desc: 'I have hired a few times',
            icon: <Award size={24} />
        },
        {
            id: 'expert',
            title: 'Savy Hirer',
            desc: 'I manage freelance teams regularly',
            icon: <Trophy size={24} />
        }
    ];

    return (
        <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-1">
                <h2 className="text-3xl font-black mb-2 tracking-tight">How familiar are you with hiring?</h2>
                <p className="text-text-muted text-lg">We'll provide tips and resources based on your experience.</p>
            </div>

            <div className="space-y-4">
                {levels.map((lvl) => (
                    <motion.div
                        key={lvl.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => updateData('experience', { ...data, level: lvl.id })}
                        className={`group flex items-center gap-5 p-6 rounded-3xl border-2 cursor-pointer transition-all ${data.level === lvl.id
                            ? 'bg-primary/5 border-primary shadow-[0_10px_30px_rgba(204,255,0,0.1)]'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                            }`}
                    >
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${data.level === lvl.id ? 'bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'bg-white/5 text-primary'}`}>
                            {lvl.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-1 transition-colors ${data.level === lvl.id ? 'text-primary' : 'text-white'}`}>{lvl.title}</h3>
                            <p className="text-text-muted font-medium">{lvl.desc}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${data.level === lvl.id ? 'border-primary bg-primary/20' : 'border-white/10'
                            }`}>
                            <div className={`w-4 h-4 bg-primary rounded-full transition-all duration-500 ${data.level === lvl.id ? 'scale-100 opacity-100 shadow-[0_0_10px_rgba(204,255,0,0.8)]' : 'scale-0 opacity-0'}`}></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceLevel;
