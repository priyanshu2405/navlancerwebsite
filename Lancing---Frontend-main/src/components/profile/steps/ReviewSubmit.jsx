import React from 'react';
import { Building2, Target, Wallet, GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewSubmit = ({ allData }) => {
    const sections = [
        {
            title: 'Business Details',
            icon: <Building2 size={20} />,
            items: [
                { label: 'Name', value: allData.business.companyName },
                { label: 'Size', value: allData.business.companySize },
                { label: 'Industry', value: allData.business.industry },
            ]
        },
        {
            title: 'Hiring Strategy',
            icon: <Target size={20} />,
            items: [
                { label: 'Intent', value: allData.hiring.intent?.replace('-', ' ') },
            ]
        },
        {
            title: 'Budget & Scale',
            icon: <Wallet size={20} />,
            items: [
                { label: 'Range', value: allData.budget.monthlyBudget },
                { label: 'Scope', value: allData.budget.projectScale },
            ]
        },
        {
            title: 'Experience',
            icon: <GraduationCap size={20} />,
            items: [
                { label: 'Level', value: allData.experience.level },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 border-2 border-primary/20 shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                >
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-4xl font-black mb-3 tracking-tight">Ready to launch?</h2>
                <p className="text-text-muted text-lg max-w-md mx-auto">Verify your details below before we connect you with expert talent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] mb-5">
                            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-black transition-colors">
                                {section.icon}
                            </div>
                            {section.title}
                        </div>
                        <div className="space-y-4">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted font-medium">{item.label}</span>
                                    <span className="font-bold capitalize text-white">{item.value || 'Not specified'}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <ShieldCheck size={20} className="text-primary" />
                <p className="text-xs font-bold text-primary/80 uppercase tracking-widest text-center">
                    Compliant & Verified Profile Protocol
                </p>
            </motion.div>
        </div>
    );
};

export default ReviewSubmit;
