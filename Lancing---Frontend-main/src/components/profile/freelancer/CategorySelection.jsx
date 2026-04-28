import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const CategorySelection = ({ data, updateData }) => {
    const categories = [
        { id: 'web', name: 'Web, Mobile & Software Dev', specialties: ['Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Apps', 'DevOps'] },
        { id: 'design', name: 'Design & Creative', specialties: ['Graphic Design', 'UI/UX Design', 'Motion Graphics', 'Illustration', 'Logo Design'] },
        { id: 'engineering', name: 'Engineering & Architecture', specialties: ['Building & Landscape Architecture', 'Chemical Engineering', 'Civil & Structural Engineering', 'Contract Manufacturing', 'Electrical & Electronic Engineering', 'Interior & Trade Show Design', 'Energy & Mechanical Engineering', 'Physical Sciences', '3D Modeling & CAD'] },
        { id: 'admin', name: 'Admin Support', specialties: ['Data Entry & Transcription Services', 'Virtual Assistance', 'Project Management', 'Market Research & Product Reviews'] },
        { id: 'writing', name: 'Writing', specialties: ['Copywriting', 'Technical Writing', 'Content Writing', 'Editing', 'Creative Writing'] },
        { id: 'marketing', name: 'Sales & Marketing', specialties: ['Social Media Marketing', 'SEO', 'SEM', 'Lead Generation', 'Email Marketing'] },
        { id: 'it', name: 'IT & Networking', specialties: ['Cloud Computing', 'Network Security', 'Database Administration', 'System Administration'] }
    ];

    const currentCategory = categories.find(c => c.id === data.category);

    const toggleSpecialty = (specialty) => {
        const currentSpecialties = data.specialties || [];
        if (currentSpecialties.includes(specialty)) {
            updateData('category', {
                ...data,
                specialties: currentSpecialties.filter(s => s !== specialty)
            });
        } else if (currentSpecialties.length < 3) {
            updateData('category', {
                ...data,
                specialties: [...currentSpecialties, specialty]
            });
        }
    };

    return (
        <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black mb-4 glow-text text-white leading-tight">
                    Great, so what kind of work are you here to do?
                </h2>
                <p className="text-text-muted text-lg">
                    Don't worry, you can change these choices later on.
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
                {/* Categories List */}
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 mb-6">Select 1 category</p>
                    <div className="flex flex-col">
                        {categories.map((cat) => {
                            const isSelected = data.category === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => updateData('category', { ...data, category: cat.id, specialties: [] })}
                                    className={`w-full text-left px-5 py-4 rounded-xl transition-all font-bold group flex items-center justify-between ${isSelected
                                            ? 'bg-primary/10 text-primary border-r-4 border-primary'
                                            : 'text-text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Specialties Grid */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-4 md:p-8 min-h-[450px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {currentCategory ? (
                            <motion.div
                                key={currentCategory.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-8 px-2">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                        Now, select 1 to 3 specialties
                                    </p>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${(data.specialties || []).length > 0 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-muted'
                                        }`}>
                                        {(data.specialties || []).length} / 3 selected
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                    {currentCategory.specialties.map((spec) => {
                                        const isSelected = (data.specialties || []).includes(spec);
                                        return (
                                            <button
                                                key={spec}
                                                onClick={() => toggleSpecialty(spec)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isSelected
                                                        ? 'bg-primary/10 border-primary/40 text-white'
                                                        : 'bg-white/[0.03] border-white/5 text-text-muted hover:border-white/20 hover:bg-white/[0.06]'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center shrink-0 ${isSelected
                                                        ? 'bg-primary border-none text-black'
                                                        : 'border-2 border-white/10 group-hover:border-white/30'
                                                    }`}>
                                                    {isSelected && <Check size={14} strokeWidth={4} />}
                                                </div>
                                                <span className={`font-semibold text-sm transition-colors ${isSelected ? 'text-white' : 'group-hover:text-white/80'}`}>
                                                    {spec}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <motion.div
                                    className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mb-6 text-white/20"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-primary/40 animate-spin"></div>
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2 italic">Waiting for Category</h3>
                                <p className="text-sm text-text-muted max-w-[240px]">
                                    Please select a work category from the left to reveal its specific sub-skills and specialties.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CategorySelection;
