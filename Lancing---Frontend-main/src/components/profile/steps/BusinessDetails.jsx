import React from 'react';
import { Building2, Users, Factory } from 'lucide-react';

const BusinessDetails = ({ data, updateData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData('business', { ...data, [name]: value });
    };

    return (
        <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-1">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Tell us about your business</h2>
                <p className="text-text-muted text-lg">Help us customize your experience and match you with the right talent.</p>
            </div>

            <div className="space-y-6">
                <div className="group">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ml-1 text-text-muted group-focus-within:text-primary transition-colors">
                        <Building2 size={14} /> Company Name
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        value={data.companyName || ''}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corporation"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/10 text-lg font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ml-1 text-text-muted group-focus-within:text-primary transition-colors">
                            <Users size={14} /> Company Size
                        </label>
                        <div className="relative">
                            <select
                                name="companySize"
                                value={data.companySize || ''}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none text-lg font-medium cursor-pointer"
                            >
                                <option value="" className="bg-bg-dark">Select size</option>
                                <option value="1-10" className="bg-bg-dark">1-10 employees</option>
                                <option value="11-50" className="bg-bg-dark">11-50 employees</option>
                                <option value="51-200" className="bg-bg-dark">51-200 employees</option>
                                <option value="201-500" className="bg-bg-dark">201-500 employees</option>
                                <option value="500+" className="bg-bg-dark">500+ employees</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ml-1 text-text-muted group-focus-within:text-primary transition-colors">
                            <Factory size={14} /> Industry
                        </label>
                        <input
                            type="text"
                            name="industry"
                            value={data.industry || ''}
                            onChange={handleChange}
                            placeholder="e.g. Technology"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/10 text-lg font-medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
