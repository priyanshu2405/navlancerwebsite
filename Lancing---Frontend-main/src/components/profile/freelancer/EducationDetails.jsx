import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Plus, X, Trash2, CheckCircle2 } from 'lucide-react';

const EducationDetails = ({ data, updateData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newEdu, setNewEdu] = useState({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        description: ''
    });

    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + 5 - i);

    const handleAdd = () => {
        const updatedEducation = [...(data.educationList || []), { ...newEdu, id: Date.now() }];
        updateData('education', { educationList: updatedEducation });
        setIsAdding(false);
        setNewEdu({
            school: '',
            degree: '',
            fieldOfStudy: '',
            startYear: '',
            endYear: '',
            description: ''
        });
    };

    const removeEducation = (id) => {
        const updated = (data.educationList || []).filter(edu => edu.id !== id);
        updateData('education', { educationList: updated });
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">Education</h2>
                <p className="text-text-muted">Clients like to know what you know - add your education here.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {(data.educationList || []).map((edu) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-start gap-4 group relative"
                        >
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                <GraduationCap size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{edu.school}</h3>
                                {edu.degree && <p className="text-primary font-medium">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</p>}
                                <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {edu.startYear} - {edu.endYear || 'Present'}</span>
                                </div>
                                {edu.description && <p className="mt-4 text-sm text-text-muted leading-relaxed line-clamp-2">{edu.description}</p>}
                            </div>
                            <button
                                onClick={() => removeEducation(edu.id)}
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
                        <span className="font-black uppercase tracking-widest text-xs">Add Education</span>
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-white">Add Education</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 text-text-muted hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">College/University *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Northwestern University"
                                    value={newEdu.school}
                                    onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Degree</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Bachelor's"
                                        value={newEdu.degree}
                                        onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Field of Study</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Computer Science"
                                        value={newEdu.fieldOfStudy}
                                        onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Start Year</label>
                                    <select
                                        value={newEdu.startYear}
                                        onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="" disabled>Year</option>
                                        {years.map(y => <option key={y} value={y} className="bg-bg-dark">{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">End Year (or expected)</label>
                                    <select
                                        value={newEdu.endYear}
                                        onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="" disabled>Year</option>
                                        {years.map(y => <option key={y} value={y} className="bg-bg-dark">{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your studies, awards, etc."
                                    value={newEdu.description}
                                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-primary transition-all resize-none"
                                />
                            </div>
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
                                disabled={!newEdu.school}
                                className="px-10 py-4 bg-primary text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_10px_20px_rgba(204,255,0,0.2)]"
                            >
                                Save Education
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Hint */}
            <div className="flex items-center gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                <p className="text-sm text-text-muted leading-relaxed italic">
                    You don't have a degree. Adding any relevant education helps make your profile more visible.
                </p>
            </div>
        </div>
    );
};

export default EducationDetails;
