import React from 'react';
import { DollarSign, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const BudgetScope = ({ data, updateData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData('budget', { ...data, [name]: value });
    };

    const budgets = [
        { label: '< $500', value: 'small' },
        { label: '$500 - $2k', value: 'medium' },
        { label: '$2k - $10k', value: 'large' },
        { label: '$10k+', value: 'enterprise' }
    ];

    return (
        <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-1">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Budget & Scope</h2>
                <p className="text-text-muted text-lg">Help us understand the scale of work you're planning.</p>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4 ml-1 text-text-muted">
                        <DollarSign size={14} /> Estimated Monthly Budget
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {budgets.map((b) => (
                            <motion.div
                                key={b.value}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateData('budget', { ...data, monthlyBudget: b.value })}
                                className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all font-bold ${data.monthlyBudget === b.value
                                    ? 'bg-primary text-black border-primary shadow-[0_10px_20px_rgba(204,255,0,0.3)]'
                                    : 'bg-white/[0.02] border-white/5 text-text-muted hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {b.label}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="group">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4 ml-1 text-text-muted group-focus-within:text-primary transition-colors">
                        <Layers size={14} /> Typical Project Scale
                    </label>
                    <div className="relative">
                        <select
                            name="projectScale"
                            value={data.projectScale || ''}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none text-lg font-medium cursor-pointer"
                        >
                            <option value="" className="bg-bg-dark">Select scope</option>
                            <option value="individual" className="bg-bg-dark">Individual tasks / Small fixes</option>
                            <option value="medium" className="bg-bg-dark">Medium features / Full components</option>
                            <option value="complex" className="bg-bg-dark">Complex systems / End-to-end products</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetScope;
