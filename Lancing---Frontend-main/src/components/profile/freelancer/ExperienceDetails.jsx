import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Plus, X, Trash2, CheckCircle2 } from 'lucide-react';

const ExperienceDetails = ({ data, updateData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newExp, setNewExp] = useState({
        title: '',
        company: '',
        location: '',
        country: '',
        isCurrent: false,
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: ''
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    const handleAdd = () => {
        const updatedExperiences = [...(data.experiences || []), { ...newExp, id: Date.now() }];
        updateData('experience', { experiences: updatedExperiences });
        setIsAdding(false);
        setNewExp({
            title: '',
            company: '',
            location: '',
            country: '',
            isCurrent: false,
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            description: ''
        });
    };

    const removeExperience = (id) => {
        const updated = (data.experiences || []).filter(exp => exp.id !== id);
        updateData('experience', { experiences: updated });
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">Work Experience</h2>
                <p className="text-text-muted">Freelancers who add their experience are more likely to win projects.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {(data.experiences || []).map((exp) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-start gap-4 group relative"
                        >
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                <Briefcase size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {exp.location}, {exp.country}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}</span>
                                </div>
                                {exp.description && <p className="mt-4 text-sm text-text-muted leading-relaxed line-clamp-2">{exp.description}</p>}
                            </div>
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-xs">Add Experience</span>
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-white">Add Work Experience</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 text-text-muted hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Software Engineer"
                                    value={newExp.title}
                                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Company *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Microsoft"
                                    value={newExp.company}
                                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Location</label>
                                <input
                                    type="text"
                                    placeholder="Ex: London"
                                    value={newExp.location}
                                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Country</label>
                                <input
                                    type="text"
                                    placeholder="Ex: United Kingdom"
                                    value={newExp.country}
                                    onChange={(e) => setNewExp({ ...newExp, country: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <input
                                type="checkbox"
                                id="isCurrent"
                                checked={newExp.isCurrent}
                                onChange={(e) => setNewExp({ ...newExp, isCurrent: e.target.checked })}
                                className="w-5 h-5 rounded-lg border-white/10 bg-white/5 checked:bg-primary accent-primary"
                            />
                            <label htmlFor="isCurrent" className="text-sm font-bold text-white cursor-pointer">I am currently working in this role</label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Start Date *</label>
                                <div className="flex gap-2">
                                    <select
                                        value={newExp.startMonth}
                                        onChange={(e) => setNewExp({ ...newExp, startMonth: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="" disabled>Month</option>
                                        {months.map(m => <option key={m} value={m} className="bg-bg-dark">{m}</option>)}
                                    </select>
                                    <select
                                        value={newExp.startYear}
                                        onChange={(e) => setNewExp({ ...newExp, startYear: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="" disabled>Year</option>
                                        {years.map(y => <option key={y} value={y} className="bg-bg-dark">{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            {!newExp.isCurrent && (
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">End Date *</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={newExp.endMonth}
                                            onChange={(e) => setNewExp({ ...newExp, endMonth: e.target.value })}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                        >
                                            <option value="" disabled>Month</option>
                                            {months.map(m => <option key={m} value={m} className="bg-bg-dark">{m}</option>)}
                                        </select>
                                        <select
                                            value={newExp.endYear}
                                            onChange={(e) => setNewExp({ ...newExp, endYear: e.target.value })}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                        >
                                            <option value="" disabled>Year</option>
                                            {years.map(y => <option key={y} value={y} className="bg-bg-dark">{y}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe your responsibilities and achievements..."
                                value={newExp.description}
                                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-8 py-4 text-sm font-black uppercase tracking-widest text-text-muted hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!newExp.title || !newExp.company || !newExp.startMonth || !newExp.startYear}
                                className="px-10 py-4 bg-primary text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_10px_20px_rgba(204,255,0,0.2)]"
                            >
                                Save Experience
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Hint */}
            <div className="flex items-center gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                <p className="text-sm text-text-muted leading-relaxed italic">
                    You can add multiple roles to show your career progression and diverse skill set.
                </p>
            </div>
        </div>
    );
};

export default ExperienceDetails;
