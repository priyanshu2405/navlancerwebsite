import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ClientProfileSetup from './client/profile_setup';
import FreelancerProfileSetup from './freelancer/profile_setup';

const ProfileSetup = () => {
    const { completeProfile, role } = useAuth();
    const navigate = useNavigate();

    const handleComplete = () => {
        completeProfile();
        if (role === 'client') {
            navigate('/client/dashboard');
        } else {
            navigate('/freelancer/dashboard');
        }
    };

    // Dispatch to role-specific setup if needed
    if (role === 'client') {
        return <ClientProfileSetup />;
    }

    if (role === 'freelancer') {
        return <FreelancerProfileSetup />;
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                className="max-w-md w-full bg-white/[0.03] border border-white/10 p-8 rounded-2xl backdrop-blur-md text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-primary/20 p-4 rounded-full">
                        <CheckCircle className="text-primary" size={48} />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Complete Your Profile</h2>
                <p className="text-text-muted mb-8 text-lg">
                    Just one more step to get started as a <span className="text-primary font-semibold">{role}</span>.
                    Fill in your details to unlock all features.
                </p>

                <button
                    onClick={handleComplete}
                    className="w-full py-4 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all hover:scale-[1.02]"
                >
                    Complete Profile & Continue
                </button>
            </motion.div>
        </div>
    );
};

export default ProfileSetup;
