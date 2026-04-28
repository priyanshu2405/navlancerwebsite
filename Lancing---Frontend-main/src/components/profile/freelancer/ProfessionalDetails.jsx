import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Sparkles, X, Plus } from 'lucide-react';

const ProfessionalDetails = ({ data, updateData }) => {
    const [skillInput, setSkillInput] = useState('');

    // Suggested skills based on category (simplified)
    const suggestedSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'UI Design', 'Copywriting', 'SEO', 'Data Analysis'];

    const handleTitleChange = (e) => {
        updateData('profession', { ...data, title: e.target.value });
    };

    const handleBioChange = (e) => {
        updateData('profession', { ...data, bio: e.target.value });
    };

    const addSkill = (skill) => {
        const currentSkills = data.skills || [];
        if (skill && !currentSkills.includes(skill)) {
            updateData('profession', { ...data, skills: [...currentSkills, skill] });
        }
        setSkillInput('');
    };

    const removeSkill = (skillToRemove) => {
        updateData('profession', {
            ...data,
            skills: (data.skills || []).filter(s => s !== skillToRemove)
        });
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">Almost there! Tell us what you do best.</h2>
                <p className="text-text-muted">Describe your expertise and set your professional title.</p>
            </div>

            <div className="space-y-8">
                {/* Professional Title */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                        <Briefcase size={16} className="text-primary" /> Professional Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Full Stack Web Developer / Brand Designer"
                        value={data.title || ''}
                        onChange={handleTitleChange}
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.25rem] text-white font-bold outline-none focus:border-primary focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                    />
                </div>

                {/* Bio / Description */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                        <FileText size={16} className="text-primary" /> Professional Bio
                    </label>
                    <textarea
                        rows={5}
                        placeholder="Describe your top skills, experience, and what you can bring to potential clients..."
                        value={data.bio || ''}
                        onChange={handleBioChange}
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.25rem] text-white font-medium outline-none focus:border-primary focus:bg-white/[0.08] transition-all placeholder:text-white/20 resize-none leading-relaxed"
                    />
                </div>

                {/* Skills Section - Redesigned to match Upwork reference */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-black mb-3 text-white">Nearly there! What work are you here to do?</h2>
                        <p className="text-sm text-text-muted leading-relaxed max-w-lg">
                            Your skills show clients what you can offer, and help us choose which jobs to recommend to you. Add or remove the ones we've suggested, or start typing to pick more. It's up to you.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="w-full min-h-[64px] p-2 bg-white/5 border border-white/10 rounded-[1.25rem] focus-within:border-primary focus-within:bg-white/[0.08] transition-all flex flex-wrap gap-2 items-center">
                            {data.skills?.map((skill) => (
                                <motion.span
                                    key={skill}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2 pl-4 pr-3 py-1.5 bg-black text-white rounded-full text-sm font-bold border border-white/10"
                                >
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-primary transition-colors hover:bg-white/10 rounded-full p-0.5">
                                        <X size={14} strokeWidth={2.5} />
                                    </button>
                                </motion.span>
                            ))}
                            <input
                                type="text"
                                placeholder={data.skills?.length > 0 ? "" : "Enter skills here"}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill(skillInput)}
                                className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-white font-bold p-2 placeholder:text-white/20"
                            />
                        </div>
                        <div className="mt-1 ml-1 text-[10px] text-text-muted font-bold">Max 15 skills</div>
                    </div>

                    {/* Suggested Skills */}
                    <div>
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.15em] mb-4 ml-1">Suggested skills</p>
                        <div className="flex flex-wrap gap-3">
                            {suggestedSkills.filter(s => !data.skills?.includes(s)).map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => addSkill(skill)}
                                    className="flex items-center gap-2 pl-4 pr-5 py-2.5 bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-full text-sm font-bold transition-all"
                                >
                                    <Plus size={16} strokeWidth={2.5} className="text-white/40" /> {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDetails;
