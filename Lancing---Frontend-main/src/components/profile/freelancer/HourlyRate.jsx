import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, HelpCircle, CheckCircle2 } from 'lucide-react';

const HourlyRate = ({ data, updateData }) => {
    // Simple change handlers without logic
    const handleFieldChange = (field, value) => {
        updateData('billing', {
            ...data,
            [field]: value
        });
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">Set your hourly rate</h2>
                <p className="text-text-muted">Clients will see this rate on your profile and in search results.</p>
            </div>

            <div className="space-y-8 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
                {/* Hourly Rate */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Hourly rate</h3>
                        <p className="text-sm text-text-muted">Total amount the client will see.</p>
                    </div>
                    <div className="relative group min-w-[200px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</div>
                        <input
                            type="text"
                            placeholder="0.00"
                            value={data.hourlyRate || ''}
                            onChange={(e) => handleFieldChange('hourlyRate', e.target.value)}
                            className="w-full p-4 pl-8 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-right outline-none focus:border-primary transition-all pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs">/hr</div>
                    </div>
                </div>

                <div className="h-[1px] bg-white/5"></div>

                {/* Service Fee */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">Service fee</h3>
                            <button className="text-text-muted hover:text-primary transition-colors">
                                <HelpCircle size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-text-muted">Platform service charges.</p>
                    </div>
                    <div className="relative group min-w-[200px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</div>
                        <input
                            type="text"
                            placeholder="0.00"
                            value={data.serviceFee || ''}
                            onChange={(e) => handleFieldChange('serviceFee', e.target.value)}
                            className="w-full p-4 pl-8 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-right outline-none focus:border-primary transition-all pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs">/hr</div>
                    </div>
                </div>

                <div className="h-[1px] bg-white/5"></div>

                {/* Net Amount */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">You'll get</h3>
                        <p className="text-sm text-text-muted">The estimated amount you'll receive.</p>
                    </div>
                    <div className="relative group min-w-[200px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-bold">$</div>
                        <input
                            type="text"
                            placeholder="0.00"
                            value={data.netAmount || ''}
                            onChange={(e) => handleFieldChange('netAmount', e.target.value)}
                            className="w-full p-4 pl-8 bg-primary/5 border border-primary/20 rounded-2xl text-primary font-black text-right outline-none focus:border-primary transition-all pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 font-bold text-xs">/hr</div>
                    </div>
                </div>
            </div>

            {/* Notification/Tip */}
            <div className="flex items-start gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-muted leading-relaxed italic">
                    You can adjust your rate every time you submit a proposal.
                </p>
            </div>
        </div>
    );
};

export default HourlyRate;
