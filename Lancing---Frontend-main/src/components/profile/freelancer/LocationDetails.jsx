import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, Calendar, Globe, CheckCircle2, Upload } from 'lucide-react';

const LocationDetails = ({ data, updateData }) => {
    const [preview, setPreview] = useState(data.profilePhoto || null);

    const handleFieldChange = (field, value) => {
        updateData('location', {
            ...data,
            [field]: value
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                handleFieldChange('profilePhoto', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-black mb-2 glow-text">A few last details...</h2>
                <p className="text-text-muted max-w-xl mx-auto text-sm">
                    A professional photo helps you build trust. To keep things safe and simple, they'll pay you through us - which is why we need your personal information.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Photo Upload Side */}
                <div className="lg:col-span-4 flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center transition-all group-hover:border-primary/50">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={48} className="text-white/20" />
                            )}
                        </div>
                        <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg">
                            <Upload size={18} strokeWidth={3} />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    <button
                        onClick={() => document.querySelector('input[type="file"]').click()}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                    >
                        Upload photo
                    </button>
                    <p className="text-[10px] text-text-muted text-center leading-relaxed">
                        PNG or JPG. At least 250px x 250px.
                    </p>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-8 space-y-6">
                    {/* DOB & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Date of Birth *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    value={data.dob || ''}
                                    onChange={(e) => handleFieldChange('dob', e.target.value)}
                                    className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Country *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"><Globe size={18} /></span>
                                <select
                                    value={data.country || 'India'}
                                    onChange={(e) => handleFieldChange('country', e.target.value)}
                                    className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="India" className="bg-bg-dark">India</option>
                                    <option value="USA" className="bg-bg-dark">United States</option>
                                    <option value="UK" className="bg-bg-dark">United Kingdom</option>
                                    <option value="Canada" className="bg-bg-dark">Canada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Street Address *</label>
                            <input
                                type="text"
                                placeholder="Enter street address"
                                value={data.address || ''}
                                onChange={(e) => handleFieldChange('address', e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Apt/Suite</label>
                            <input
                                type="text"
                                placeholder="Optional"
                                value={data.apt || ''}
                                onChange={(e) => handleFieldChange('apt', e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">City *</label>
                            <input
                                type="text"
                                placeholder="Enter city"
                                value={data.city || ''}
                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">State/Province</label>
                            <input
                                type="text"
                                placeholder="Enter state"
                                value={data.state || ''}
                                onChange={(e) => handleFieldChange('state', e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">ZIP/Postal *</label>
                            <input
                                type="text"
                                placeholder="Enter ZIP"
                                value={data.zip || ''}
                                onChange={(e) => handleFieldChange('zip', e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Phone *</label>
                        <div className="flex gap-4">
                            <div className="w-24 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2">
                                <span className="text-lg">🇮🇳</span>
                                <span className="text-white font-bold">+91</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                value={data.phone || ''}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-primary transition-all placeholder:text-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Tip */}
            <div className="flex items-start gap-4 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-white font-bold">Safe & Secure</h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                        Your information is used only for identity verification and payments. We never share your private address or phone number with clients.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationDetails;
