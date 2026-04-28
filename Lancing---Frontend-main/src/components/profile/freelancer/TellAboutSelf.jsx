import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, FileText, UserPlus, ArrowRight, Check } from 'lucide-react';

const TellAboutSelf = ({ data, updateData }) => {
    const options = [
        {
            id: 'linkedin',
            icon: <Linkedin size={24} className="text-[#0077b5]" />,
            title: "Import from LinkedIn",
            description: "Sync your experience and education directly"
        },
        {
            id: 'resume',
            icon: <FileText size={24} className="text-primary" />,
            title: "Upload your resume",
            description: "We'll parse your resume for key information"
        },
        {
            id: 'manual',
            icon: <UserPlus size={24} className="text-white" />,
            title: "Fill out manually",
            description: "Enter your details one by one (take 5-10 min)"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">How would you like to tell us about yourself?</h2>
                <p className="text-text-muted">We need to get a sense of your education, experience, and skills. It's quickest to import your information.</p>
            </div>

            <div className="grid gap-4 max-w-lg mx-auto">
                {options.map((option) => (
                    <div key={option.id} className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => updateData('intro', { method: option.id })}
                            className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all text-left ${data.method === option.id
                                ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(204,255,0,0.1)]'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data.method === option.id ? 'bg-primary/20' : 'bg-white/5'
                                }`}>
                                {option.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-0.5">{option.title}</h3>
                                <p className="text-sm text-text-muted">{option.description}</p>
                            </div>
                            <ArrowRight size={20} className={data.method === option.id ? 'text-primary' : 'text-white/20'} />
                        </motion.button>

                        <AnimatePresence>
                            {data.method === 'linkedin' && option.id === 'linkedin' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden px-2"
                                >
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-3">
                                        <p className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">LinkedIn Profile Link</p>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0077b5]">
                                                <Linkedin size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="https://linkedin.com/in/yourprofile"
                                                value={data.linkedinUrl || ''}
                                                onChange={(e) => updateData('intro', { ...data, linkedinUrl: e.target.value })}
                                                className="w-full pl-12 pr-5 py-4 bg-black/40 border border-white/5 rounded-2xl text-white font-medium outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {data.method === 'resume' && option.id === 'resume' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden px-2"
                                >
                                    <label className="bg-white/5 border border-white/10 p-8 rounded-[2rem] border-dashed flex flex-col items-center justify-center text-center gap-4 hover:bg-white/[0.07] transition-all cursor-pointer group relative">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            {data.resumeName ? <Check size={28} /> : <FileText size={28} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white mb-1">
                                                {data.resumeName ? data.resumeName : "Click to upload or drag and drop"}
                                            </p>
                                            <p className="text-xs text-text-muted uppercase tracking-widest">
                                                {data.resumeName ? "Resume uploaded successfully" : "PDF, DOCX (Max 5MB)"}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    updateData('intro', { ...data, resumeName: e.target.files[0].name });
                                                }
                                            }}
                                        />
                                    </label>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md flex items-start gap-4 backdrop-blur-sm">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="text-primary text-xs font-black uppercase">Pro Tip</span>
                    </div>
                    <p className="text-sm text-text-muted italic leading-relaxed">
                        "Your Navlancer profile is how you stand out from the crowd. Let's make it a good one."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TellAboutSelf;
