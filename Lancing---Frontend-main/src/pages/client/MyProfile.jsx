import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Shield,
    Heart,
    Ban,
    Trash2,
    Loader2,
    Check,
    AlertCircle,
    Building2,
    Users,
    Globe,
    FileText,
    Camera,
    Mail,
    Lock,
    X
} from 'lucide-react';
import { useClientProfile } from '../../hooks/useClientProfile';
import { useClientActions } from '../../hooks/useClientActions';
import { useAuthActions } from '../../hooks/useAuthActions';
import { useAuth } from '../../context/AuthContext';

const MyProfile = () => {
    const { user, login } = useAuth();
    const fileInputRef = useRef(null);
    const { getClientProfile, updateProfile, loading: profileLoading } = useClientProfile();
    const { getClientPreferences, unblockFreelancer, removeFromFavorites, loading: actionsLoading } = useClientActions();
    const { uploadAvatar, changeEmail, changePassword, loading: authActionsLoading } = useAuthActions();

    const [activeTab, setActiveTab] = useState('profile');
    const [preferences, setPreferences] = useState({ blockedFreelancers: [], favoriteFreelancers: [] });
    const [processingId, setProcessingId] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // 'idle', 'saving', 'success', 'error'

    // Modal States
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [modalData, setModalData] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    const [modalStatus, setModalStatus] = useState({ type: '', message: '' });

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        employeeCount: '',
        website: '',
        description: ''
    });

    const fetchData = async () => {
        const [profileRes, prefRes] = await Promise.all([
            getClientProfile(),
            getClientPreferences()
        ]);

        if (profileRes.success && profileRes.data) {
            const p = profileRes.data;
            setFormData({
                companyName: p.companyName || '',
                industry: p.industry || '',
                employeeCount: p.employeeCount || '',
                website: p.website || '',
                description: p.description || ''
            });
        }

        if (prefRes.success) {
            setPreferences(prefRes.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        const result = await updateProfile({
            ...formData,
            employeeCount: Number(formData.employeeCount)
        });

        if (result.success) {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaveStatus('saving');
        const result = await uploadAvatar(file);

        if (result.success) {
            // Update local user context to show new avatar
            const updatedUser = { ...user, avatar: result.data.avatarUrl };
            login(updatedUser, localStorage.getItem('token'));
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            alert(result.error || 'Failed to upload avatar');
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setModalStatus({ type: 'loading', message: 'Updating email...' });
        const result = await changeEmail(modalData.email);
        if (result.success) {
            setModalStatus({ type: 'success', message: 'Email updated! Please log in again if required.' });
            setTimeout(() => setShowEmailModal(false), 2000);
        } else {
            setModalStatus({ type: 'error', message: result.error });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (modalData.newPassword !== modalData.confirmPassword) {
            setModalStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }
        setModalStatus({ type: 'loading', message: 'Updating password...' });
        const result = await changePassword(modalData.currentPassword, modalData.newPassword);
        if (result.success) {
            setModalStatus({ type: 'success', message: 'Password updated successfully!' });
            setTimeout(() => setShowPasswordModal(false), 2000);
        } else {
            setModalStatus({ type: 'error', message: result.error });
        }
    };

    const handleAction = async (action, id) => {
        if (!window.confirm('Are you sure you want to perform this action?')) return;
        setProcessingId(id);

        let result;
        if (action === 'unblock') {
            result = await unblockFreelancer(id);
            if (result.success) {
                setPreferences(prev => ({
                    ...prev,
                    blockedFreelancers: prev.blockedFreelancers.filter(f => f._id !== id)
                }));
            }
        } else if (action === 'removeFavorite') {
            result = await removeFromFavorites(id);
            if (result.success) {
                setPreferences(prev => ({
                    ...prev,
                    favoriteFreelancers: prev.favoriteFreelancers.filter(f => f._id !== id)
                }));
            }
        }

        setProcessingId(null);
    };

    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: <User size={18} /> },
        { id: 'account', label: 'Account Settings', icon: <Shield size={18} /> },
        { id: 'lists', label: 'Lists & Favorites', icon: <Heart size={18} /> },
    ];

    return (
        <div className="max-w-5xl mx-auto py-4 space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={32} className="text-text-muted opacity-50" />
                            )}
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-black rounded-lg shadow-lg hover:scale-110 transition-transform active:scale-95"
                        >
                            <Camera size={12} strokeWidth={3} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{user?.name || 'Client Name'}</h1>
                        <p className="text-text-muted font-bold uppercase tracking-widest text-[9px] mt-0.5">
                            Verified Client &bull; {formData.companyName || 'No Company Linked'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.id
                            ? 'bg-primary text-black shadow-lg shadow-primary/20'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {React.cloneElement(tab.icon, { size: 14 })}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.form
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleSaveProfile}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Building2 size={14} /> Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-primary/30 transition-all font-medium"
                                            placeholder="e.g. Acme Industries"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Globe size={14} /> Industry
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-primary/30 transition-all font-medium"
                                            placeholder="e.g. Technology"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Users size={14} /> Team Size
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.employeeCount}
                                            onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-primary/30 transition-all font-medium"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Globe size={14} /> Website
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-primary/30 transition-all font-medium"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FileText size={12} /> About the Company
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/30 transition-all resize-none font-medium"
                                        placeholder="Describe your goals and the type of talent you hire..."
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        {saveStatus === 'success' && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-widest">
                                                <Check size={14} /> Success
                                            </span>
                                        )}
                                        {saveStatus === 'error' && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-widest">
                                                <AlertCircle size={14} /> Error
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saveStatus === 'saving'}
                                        className="px-8 py-3 bg-primary text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={14} /> : 'Update Profile'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {activeTab === 'lists' && (
                            <motion.div
                                key="lists"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Favorites Section */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                                            <Heart className="text-primary" size={16} fill="currentColor" />
                                            Your Shortlist
                                        </h3>
                                        <span className="text-[9px] bg-white/10 border border-white/10 px-3 py-1 rounded-full text-text-muted font-black uppercase tracking-widest">
                                            {preferences.favoriteFreelancers.length} Experts
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {preferences.favoriteFreelancers.length > 0 ? (
                                            preferences.favoriteFreelancers.map(expert => (
                                                <div key={expert._id} className="group p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-all flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden border border-white/10">
                                                            {expert.avatar ? <img src={expert.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 opacity-20" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors">{expert.name}</h4>
                                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{expert.category || 'Expert'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAction('removeFavorite', expert._id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-6 text-center border border-dashed border-white/10 rounded-xl">
                                                <p className="text-text-muted font-bold text-xs">No experts shortlisted</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Blocked Section */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                        <Ban className="text-red-400" size={16} />
                                        Blocked Experts
                                        <span className="text-[9px] bg-white/10 border border-white/10 px-3 py-1 rounded-full text-text-muted font-black uppercase tracking-widest">
                                            {preferences.blockedFreelancers.length} Restricted
                                        </span>
                                    </h3>
                                    <div className="space-y-2">
                                        {preferences.blockedFreelancers.length > 0 ? (
                                            preferences.blockedFreelancers.map(expert => (
                                                <div key={expert._id} className="p-3 bg-red-500/[0.02] border border-red-500/10 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center grayscale">
                                                            <User size={16} className="text-text-muted" />
                                                        </div>
                                                        <h4 className="font-bold text-[13px] text-text-muted line-through">{expert.name}</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAction('unblock', expert._id)}
                                                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                                    >
                                                        Unrestrict
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center border border-dashed border-white/10 rounded-xl">
                                                <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest">No restricted users</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'account' && (
                            <motion.div
                                key="account"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="font-bold text-sm text-white mb-0.5">Email Address</h4>
                                            <p className="text-xs text-text-muted">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setModalData({ ...modalData, email: user?.email });
                                                setModalStatus({ type: '', message: '' });
                                                setShowEmailModal(true);
                                            }}
                                            className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                                        >
                                            Change
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="font-bold text-sm text-white mb-0.5">Password</h4>
                                            <p className="text-xs text-text-muted">Last changed recently</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setModalData({ ...modalData, currentPassword: '', newPassword: '', confirmPassword: '' });
                                                setModalStatus({ type: '', message: '' });
                                                setShowPasswordModal(true);
                                            }}
                                            className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div className="p-4 border border-red-500/10 rounded-2xl space-y-2">
                                        <h4 className="font-bold text-xs text-red-500 flex items-center gap-2">
                                            <AlertCircle size={14} /> Danger Zone
                                        </h4>
                                        <p className="text-[11px] text-text-muted leading-tight">Permanently delete your account. This action is irreversible.</p>
                                        <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Info/Status */}
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Profile Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-muted uppercase">Verification</span>
                                <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-black rounded border border-green-500/20 uppercase">Verified</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-muted uppercase">Plan Type</span>
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded border border-primary/20 uppercase">Enterprise</span>
                            </div>
                            <div className="pt-3 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-black text-white uppercase mb-1.5">
                                    <span>Completeness</span>
                                    <span>85%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary border border-primary/20 rounded-2xl p-5 text-black">
                        <h3 className="font-bold text-base mb-1">Need Help?</h3>
                        <p className="text-[11px] font-medium opacity-80 mb-3 leading-snug">Our account managers are available 24/7 to assist with your hiring.</p>
                        <button className="w-full py-2.5 bg-black text-white rounded-lg font-black uppercase tracking-widest text-[9px] hover:scale-[1.02] transition-transform">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Change Modal */}
            <AnimatePresence>
                {showEmailModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-bg-dark border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 relative"
                        >
                            <button onClick={() => setShowEmailModal(false)} className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-black text-white mb-2">Change Email</h3>
                            <p className="text-text-muted text-sm mb-6">Update your account's primary email address.</p>

                            <form onSubmit={handleEmailUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">New Email Address</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="email"
                                            required
                                            value={modalData.email}
                                            onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary/30 transition-all"
                                            placeholder="newemail@example.com"
                                        />
                                    </div>
                                </div>

                                {modalStatus.message && (
                                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${modalStatus.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {modalStatus.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : (modalStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />)}
                                        {modalStatus.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={modalStatus.type === 'loading'}
                                    className="w-full py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg transition-all disabled:opacity-50 mt-4"
                                >
                                    {modalStatus.type === 'loading' ? 'Updating...' : 'Save Email Address'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-bg-dark border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 relative"
                        >
                            <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-black text-white mb-2">Update Password</h3>
                            <p className="text-text-muted text-sm mb-6">Create a strong new password for your account.</p>

                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Current Password</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="password"
                                                required
                                                value={modalData.currentPassword}
                                                onChange={(e) => setModalData({ ...modalData, currentPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">New Password</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="password"
                                                required
                                                value={modalData.newPassword}
                                                onChange={(e) => setModalData({ ...modalData, newPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="password"
                                                required
                                                value={modalData.confirmPassword}
                                                onChange={(e) => setModalData({ ...modalData, confirmPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {modalStatus.message && (
                                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${modalStatus.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {modalStatus.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : (modalStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />)}
                                        {modalStatus.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={modalStatus.type === 'loading'}
                                    className="w-full py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg transition-all disabled:opacity-50 mt-4"
                                >
                                    {modalStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyProfile;
