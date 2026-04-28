import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Plus, X, Globe, CheckCircle2 } from 'lucide-react';

const LanguageDetails = ({ data, updateData }) => {
    // Proficiency levels
    const proficiencies = [
        'Basic',
        'Conversational',
        'Fluent',
        'Native or Bilingual'
    ];

    const commonLanguages = [
        'English', 'Hindi', 'Spanish', 'French', 'German',
        'Chinese', 'Japanese', 'Russian', 'Arabic', 'Portuguese'
    ];

    // Initialize with English if empty
    useEffect(() => {
        if (!data.languages || data.languages.length === 0) {
            updateData('language', {
                languages: [{ id: 'default-en', name: 'English', proficiency: 'Fluent', isDefault: true }]
            });
        }
    }, []);

    const handleAddLanguage = () => {
        const newLang = {
            id: Date.now(),
            name: '',
            proficiency: 'Basic',
            isDefault: false
        };
        updateData('language', {
            languages: [...(data.languages || []), newLang]
        });
    };

    const updateLanguage = (id, field, value) => {
        const updated = (data.languages || []).map(lang =>
            lang.id === id ? { ...lang, [field]: value } : lang
        );
        updateData('language', { languages: updated });
    };

    const removeLanguage = (id) => {
        const updated = (data.languages || []).filter(lang => lang.id !== id);
        updateData('language', { languages: updated });
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">Languages</h2>
                <p className="text-text-muted">Clients are often interested to know what languages you speak. English is a must.</p>
            </div>

            <div className="space-y-6">
                <div className="grid gap-4">
                    {(data.languages || []).map((lang, index) => (
                        <motion.div
                            key={lang.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row gap-4 items-center"
                        >
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Language</label>
                                {lang.isDefault ? (
                                    <div className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white/50 font-bold flex items-center gap-3">
                                        <Globe size={18} />
                                        {lang.name} <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/40 tracking-normal">REQUIRED</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            value={lang.name}
                                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                        >
                                            <option value="" disabled>Select language</option>
                                            {commonLanguages.filter(l => l !== 'English').map(l => (
                                                <option key={l} value={l} className="bg-bg-dark">{l}</option>
                                            ))}
                                            <option value="Other" className="bg-bg-dark text-primary">Other Language...</option>
                                        </select>
                                        {lang.name === 'Other' && (
                                            <input
                                                type="text"
                                                placeholder="Type language name..."
                                                onChange={(e) => updateLanguage(lang.id, 'customName', e.target.value)}
                                                className="mt-2 w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Proficiency</label>
                                <select
                                    value={lang.proficiency}
                                    onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                >
                                    {proficiencies.map(p => (
                                        <option key={p} value={p} className="bg-bg-dark">{p}</option>
                                    ))}
                                </select>
                            </div>

                            {!lang.isDefault && (
                                <button
                                    onClick={() => removeLanguage(lang.id)}
                                    className="mt-6 md:mt-6 p-4 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={handleAddLanguage}
                    className="flex items-center gap-2 px-6 py-4 bg-primary/5 border border-primary/20 text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/10 transition-all group"
                >
                    <Plus size={16} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                    Add a language
                </button>
            </div>

            {/* Hint Box */}
            <div className="flex items-center gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                <p className="text-sm text-text-muted leading-relaxed italic">
                    Upwork is global, so clients are often interested to know what languages you speak.
                </p>
            </div>
        </div>
    );
};

export default LanguageDetails;
