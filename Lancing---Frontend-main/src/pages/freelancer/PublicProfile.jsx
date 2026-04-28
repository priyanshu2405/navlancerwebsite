import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User,
    Briefcase,
    MapPin,
    Star,
    Clock,
    Globe,
    MessageSquare,
    Share2,
    Loader2,
    GraduationCap,
    CheckCircle2,
    Award,
    DollarSign,
    ArrowLeft
} from 'lucide-react';
import { useFreelancerProfile } from '../../hooks/useFreelancerProfile';
import { useClientProfile } from '../../hooks/useClientProfile';
import Reviews from '../../components/Reviews';
import { useAuth } from '../../context/AuthContext';
import { useClientActions } from '../../hooks/useClientActions';
import { Heart, Ban } from 'lucide-react';
import { MEDIA_BASE_URL } from '../../config/api';
import InviteToJobModal from '../../components/dashboard/InviteToJobModal';

const ClientActions = ({ userId }) => {
    const { addToFavorites, removeFromFavorites, blockFreelancer, loading } = useClientActions();
    const [isFavorite, setIsFavorite] = useState(false); // TODO: Initialize from profile data if available

    const toggleFavorite = async () => {
        if (isFavorite) {
            await removeFromFavorites(userId);
            setIsFavorite(false);
        } else {
            await addToFavorites(userId);
            setIsFavorite(true);
        }
    };

    const handleBlock = async () => {
        if (window.confirm('Are you sure you want to block this freelancer?')) {
            await blockFreelancer(userId);
            alert('Freelancer blocked');
            // Navigate away or refresh
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`p-4 border rounded-xl transition-all ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
                onClick={handleBlock}
                disabled={loading}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors text-text-muted"
                title="Block Freelancer"
            >
                <Ban size={20} />
            </button>
        </div>
    );
};

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { fetchProfile, getClientTrustScore, getClientRating } = useFreelancerProfile(); // Re-using this hook for profile fetch, but adding client specific calls
    const { getClientTrustScore: fetchTrust, getClientRating: fetchRating } = useClientProfile(); // Using the new hook for stats
    const [profile, setProfile] = useState(null);
    const [clientStats, setClientStats] = useState({ trustScore: null, rating: null });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('portfolio');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            const result = await fetchProfile(id);
            if (result.success) {
                setProfile(result.data);

                // If the profile user is a client (or we want to show client stats for them)
                // The API list said GET /api/client/trust/:userId. 
                // We should check if the loaded profile is a client. 
                // However, the PublicProfile component seems designed for Freelancers ("useFreelancerProfile").
                // If this page is used for Clients too, we should fetch client stats.
                // Assuming we might need to show this for anyone or if we know they are a client.
                // For now, let's attempt to fetch it if they are a client role.
                if (result.data.userId?.role === 'client') {
                    const [trustRes, ratingRes] = await Promise.all([
                        fetchTrust(id),
                        fetchRating(id)
                    ]);
                    setClientStats({
                        trustScore: trustRes.data?.trustScore,
                        rating: ratingRes.data?.rating
                    });
                }
            }
            setLoading(false);
        };

        if (id) {
            loadProfile();
        }
    }, [id, fetchProfile, fetchTrust, fetchRating]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-muted">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <User size={64} className="text-text-muted mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                <p className="text-text-muted mb-6">The freelancer profile you are looking for does not exist or is unavailable.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { userId: userInfo, title, bio, skills, hourlyRate, experienceLevel, availabilityStatus, experiences, educationList: education, portfolio } = profile;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Back Button (Mobile/Tablet) */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-white transition-colors md:hidden"
            >
                <ArrowLeft size={20} /> Back
            </button>

            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10">
                <div className="bg-gradient-to-r from-primary/10 to-transparent h-48"></div>
                <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-8 -mt-16">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-bg-dark bg-white/10 flex items-center justify-center overflow-hidden">
                            {userInfo?.avatar ? (
                                <img src={userInfo.avatar} alt={userInfo.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-text-muted" />
                            )}
                        </div>
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-bg-dark ${availabilityStatus === 'available' ? 'bg-green-500' :
                            availabilityStatus === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <h1 className="text-3xl md:text-5xl font-black text-white">{userInfo?.name || 'Freelancer'}</h1>
                            {profile.isVerified && (
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                    <CheckCircle2 size={14} /> Verified
                                </span>
                            )}

                            {/* Client Stats Display */}
                            {userInfo?.role === 'client' && clientStats.trustScore && (
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                    Trust Score: {clientStats.trustScore}
                                </span>
                            )}
                        </div>
                        <p className="text-xl text-primary font-bold mb-4">{title || 'Freelancer'}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted font-medium">
                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.location || 'Remote'}</span>
                            <span className="flex items-center gap-1.5"><Globe size={16} /> {profile.language || 'English'}</span>
                            <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} local time</span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {currentUser?.role === 'client' ? (
                            <>
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                                >
                                    <MessageSquare size={18} strokeWidth={3} /> Hire / Message
                                </button>
                                <ClientActions userId={id} />
                            </>
                        ) : currentUser?._id === userInfo?._id ? (
                            <button
                                onClick={() => navigate('/freelancer/profile')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                Edit Profile
                            </button>
                        ) : null}
                        <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
                        <div>
                            <p className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">Hourly Rate</p>
                            <p className="text-3xl font-black text-white">₹{hourlyRate || 0}<span className="text-sm font-medium text-text-muted">/hr</span></p>
                        </div>
                        <div className="h-px bg-white/10"></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-lg font-bold text-white capitalize">{experienceLevel || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">Rating</p>
                                <p className="text-lg font-bold text-white flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    {profile.averageRating || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Award size={20} className="text-primary" /> Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills?.map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-black border border-white/10 rounded-xl text-sm font-bold text-white">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <GraduationCap size={20} className="text-primary" /> Education
                        </h3>
                        {education && education.length > 0 ? (
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-white/10 last:border-0 pb-6 last:pb-0">
                                        <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary"></div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-primary font-medium">{edu.degree}</p>
                                        <p className="text-xs text-text-muted mt-1">{edu.startYear} - {edu.endYear}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-muted text-sm">No education listed.</p>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10">
                        <h3 className="text-2xl font-black text-white mb-6">About</h3>
                        <p className="text-text-muted leading-relaxed whitespace-pre-wrap text-lg">
                            {bio || 'No bio available.'}
                        </p>
                    </section>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'portfolio' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
                                }`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab('experience')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'experience' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
                                }`}
                        >
                            Experience
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
                                }`}
                        >
                            Reviews (0)
                        </button>
                    </div>

                    {/* Content Based on Tab */}
                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'portfolio' && (
                                <motion.div
                                    key="portfolio"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {portfolio && portfolio.length > 0 ? (
                                        portfolio.map((item, i) => (
                                            <div key={i} className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden aspect-[4/3] cursor-pointer hover:border-primary/50 transition-all">
                                                <img
                                                    src={item.fileUrl?.startsWith('http') ? item.fileUrl : `${MEDIA_BASE_URL}${item.fileUrl}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                                    <p className="text-primary text-xs font-bold uppercase tracking-wider mt-1">View Project</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
                                            <p className="text-text-muted">No portfolio items to display.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'experience' && (
                                <motion.div
                                    key="experience"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {experiences && experiences.length > 0 ? (
                                        experiences.map((exp, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                                    <Briefcase size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                                                    <p className="text-lg text-primary font-medium">{exp.company}</p>
                                                    <p className="text-sm text-text-muted mt-1 mb-4">
                                                        {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`} &bull; {exp.location}
                                                    </p>
                                                    <p className="text-text-muted/80 leading-relaxed">
                                                        {exp.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
                                            <p className="text-text-muted">No work experience listed.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Reviews userId={id} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Invitation Modal */}
            <InviteToJobModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                freelancerId={id}
                freelancerName={userInfo?.name}
            />
        </div>
    );
};

export default PublicProfile;
