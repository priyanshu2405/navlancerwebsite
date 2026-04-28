import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Globe, Clock, DollarSign, Edit2, Save, X, Loader2, Share2, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFreelancerProfile } from '../../hooks/useFreelancerProfile';
import PortfolioManager from '../../components/profile/freelancer/PortfolioManager';
import ProfessionalDetails from '../../components/profile/freelancer/ProfessionalDetails';
import ExperienceDetails from '../../components/profile/freelancer/ExperienceDetails';
import EducationDetails from '../../components/profile/freelancer/EducationDetails';

const MyProfile = () => {
    const { user } = useAuth();
    const { fetchProfile, updateProfile, updateExperienceLevel, updateAvailability } = useFreelancerProfile();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    // Edit state
    const [editSection, setEditSection] = useState(null);

    const fetchMyProfile = async () => {
        setLoading(true);
        const result = await fetchProfile(user?.id);
        if (result.success) {
            setProfileData(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMyProfile();
    }, [user?.id]);

    const handleSave = async (section, data) => {
        // Construct payload based on section
        // Note: The components (ProfessionalDetails, etc.) usually assume a full data object
        // We might need to map their output to the API payload structure

        // For simplicity in this implementation, we'll assume the child components allow us to modify local state
        // and then we save the specific part of profileData to the backend.

        let payload = {};
        if (section === 'profession') {
            payload = {
                title: data.title,
                bio: data.bio,
                skills: data.skills
            };
        } else if (section === 'experience') {
            payload = { experiences: data.experiences };
        } else if (section === 'education') {
            payload = { education: data.education };
        }

        const result = await updateProfile({ ...profileData, ...payload });

        if (result.success) {
            setEditSection(null);
            fetchMyProfile(); // Refresh
        } else {
            alert('Failed to save changes');
        }
    };

    const handleLevelChange = async (level) => {
        const result = await updateExperienceLevel(level);
        if (result.success) {
            setProfileData({ ...profileData, experienceLevel: level });
        }
    };

    const handleAvailabilityChange = async (status) => {
        const result = await updateAvailability(status);
        if (result.success) {
            setProfileData({ ...profileData, availabilityStatus: status });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted">Loading profile...</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="text-center py-20">
                <p className="text-text-muted">Profile not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header / Cover */}
            <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 min-h-[250px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6 bg-gradient-to-t from-bg-dark to-transparent">
                    <div className="w-32 h-32 rounded-full border-4 border-bg-dark bg-primary/20 flex items-center justify-center relative overflow-hidden group">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-primary">{user?.name?.charAt(0)}</span>
                        )}
                        <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Edit2 size={24} />
                        </button>
                    </div>
                    <div className="flex-1 mb-2">
                        <h1 className="text-3xl md:text-4xl font-black text-white">{user?.name}</h1>
                        <p className="text-lg text-primary font-medium">{profileData.title || 'Freelancer'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                            <span className="flex items-center gap-1.5"><Globe size={14} /> {profileData.location || 'Remote'}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date().toLocaleTimeString()} (Local)</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={profileData.availabilityStatus || 'available'}
                            onChange={(e) => handleAvailabilityChange(e.target.value)}
                            className="bg-bg-dark border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                        <button
                            onClick={() => window.open(`/profile/${user?.id}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
                        >
                            <User size={16} /> View Public
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                            <Share2 size={16} /> Share
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    {/* Hourly Rate */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <DollarSign size={20} className="text-primary" /> Hourly Rate
                            </h3>
                            <button className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <p className="text-3xl font-black text-white">₹{profileData.hourlyRate || 0}<span className="text-sm font-medium text-text-muted">/hr</span></p>
                    </div>

                    {/* Stats */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Award size={20} className="text-primary" /> Certifications
                        </h3>
                        <div className="text-sm text-text-muted text-center py-4">No certifications added yet.</div>
                        <button className="w-full py-2 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
                            Add Certification
                        </button>
                    </div>

                    {/* Experience Level */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-primary" /> Experience Level
                        </h3>
                        <div className="flex flex-col gap-2">
                            {['beginner', 'intermediate', 'expert'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleLevelChange(level)}
                                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${profileData.experienceLevel === level
                                        ? 'bg-primary/20 text-primary border border-primary/50'
                                        : 'bg-white/5 border border-transparent hover:bg-white/10 text-text-muted'
                                        }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
                        >
                            Portfolio
                        </button>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Professional Details (Bio, Skills) */}
                            <div className="group relative">
                                {editSection === 'profession' ? (
                                    <div className="bg-bg-dark border border-white/10 rounded-2xl p-6 relative">
                                        <button
                                            onClick={() => setEditSection(null)}
                                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                        <h3 className="text-xl font-bold mb-6">Edit Professional Details</h3>
                                        <ProfessionalDetails
                                            data={profileData}
                                            updateData={(_, newData) => handleSave('profession', newData)}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-xl font-bold text-white">{profileData.title}</h3>
                                            <button
                                                onClick={() => setEditSection('profession')}
                                                className="p-2 bg-white/5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-text-muted leading-relaxed whitespace-pre-wrap mb-8">
                                            {profileData.bio || 'No bio added yet.'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.skills?.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-black rounded-full text-sm font-medium border border-white/10 text-white">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="group relative">
                                {editSection === 'experience' ? (
                                    <div className="bg-bg-dark border border-white/10 rounded-2xl p-6 relative">
                                        <button
                                            onClick={() => setEditSection(null)}
                                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                        <h3 className="text-xl font-bold mb-6">Edit Experience</h3>
                                        {/* Reuse ExperienceDetails but handle state locally first if needed */}
                                        <ExperienceDetails
                                            data={profileData}
                                            updateData={(_, newData) => handleSave('experience', newData)}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Briefcase size={22} className="text-primary" /> Work Experience
                                            </h3>
                                            <button
                                                onClick={() => setEditSection('experience')}
                                                className="p-2 bg-white/5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-8">
                                            {profileData.experiences?.length > 0 ? (
                                                profileData.experiences.map((exp, i) => (
                                                    <div key={i} className="relative pl-6 border-l-2 border-white/10 last:border-0">
                                                        <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-primary"></div>
                                                        <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                                                        <p className="text-primary font-medium">{exp.company}</p>
                                                        <p className="text-sm text-text-muted mt-1">
                                                            {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                                        </p>
                                                        {exp.description && <p className="mt-3 text-sm text-text-muted/80 leading-relaxed">{exp.description}</p>}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-text-muted text-sm italic">No experience added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Education */}
                            <div className="group relative">
                                {editSection === 'education' ? (
                                    <div className="bg-bg-dark border border-white/10 rounded-2xl p-6 relative">
                                        <button
                                            onClick={() => setEditSection(null)}
                                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                        <h3 className="text-xl font-bold mb-6">Edit Education</h3>
                                        <EducationDetails
                                            data={profileData}
                                            updateData={(_, newData) => handleSave('education', newData)}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <GraduationCap size={22} className="text-primary" /> Education
                                            </h3>
                                            <button
                                                onClick={() => setEditSection('education')}
                                                className="p-2 bg-white/5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-8">
                                            {profileData.education?.length > 0 ? (
                                                profileData.education.map((edu, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                            <BookOpen size={20} className="text-text-muted" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white">{edu.institution}</h4>
                                                            <p className="text-white/80 font-medium">{edu.degree}</p>
                                                            <p className="text-sm text-text-muted mt-1">
                                                                {edu.startYear} - {edu.endYear}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-text-muted text-sm italic">No education added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Portfolio Tab */}
                    {activeTab === 'portfolio' && (
                        <PortfolioManager
                            portfolio={profileData.portfolio}
                            onUpdate={fetchMyProfile}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
