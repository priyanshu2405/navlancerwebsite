import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, User, Target, Sparkles, PencilLine, Globe, Briefcase, GraduationCap, DollarSign, MapPin } from 'lucide-react';

const ReviewSubmit = ({ allData }) => {
    const sections = [
        {
            icon: <User className="text-primary" size={20} />,
            title: "Basic Info & Method",
            content: `Method: ${allData.intro?.method === 'manual' ? 'Manual Entry' : allData.intro?.method || 'Not specified'}`
        },
        {
            icon: <Target className="text-primary" size={20} />,
            title: "Category & Specialties",
            content: `${allData.category?.category || 'None'} • ${allData.category?.specialties?.join(', ') || 'No specialties'}`
        },
        {
            icon: <Sparkles className="text-primary" size={20} />,
            title: "Professional Details",
            content: `${allData.profession?.title || 'No title'} • ${allData.profession?.skills?.length || 0} skills added`
        },
        {
            icon: <Briefcase className="text-primary" size={20} />,
            title: "Work Experience",
            content: `${allData.experience?.experiences?.length || 0} relative work experiences added`
        },
        {
            icon: <GraduationCap className="text-primary" size={20} />,
            title: "Education",
            content: `${allData.education?.educationList?.length || 0} education entries added`
        },
        {
            icon: <Globe className="text-primary" size={20} />,
            title: "Languages",
            content: `${allData.language?.languages?.length || 0} languages setup`
        },
        {
            icon: <DollarSign className="text-primary" size={20} />,
            title: "Hourly Rate",
            content: `$${allData.billing?.hourlyRate || '0.00'}/hr ($${allData.billing?.netAmount || '0.00'} net)`
        },
        {
            icon: <MapPin className="text-primary" size={20} />,
            title: "Location & Contact",
            content: `${allData.location?.city || 'No city'}, ${allData.location?.country || 'No country'} • ${allData.location?.phone || 'No phone'}`
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-3xl font-black mb-2 glow-text">Looks great! Ready to launch?</h2>
                <p className="text-text-muted">Review your information before finalizing your profile.</p>
            </div>

            <div className="grid gap-4">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-start gap-4"
                    >
                        <div className="p-3 bg-white/5 rounded-2xl">
                            {section.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-1">{section.title}</h3>
                            <p className="font-bold text-white leading-relaxed">{section.content}</p>
                        </div>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            <PencilLine size={18} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                <p className="text-sm text-center text-text-muted leading-relaxed">
                    By clicking "Finalize Setup", you agree to the <span className="text-primary font-bold cursor-pointer">Navlancer Professional Standards</span> and confirm that all information provided is accurate.
                </p>
            </div>
        </div>
    );
};

export default ReviewSubmit;
