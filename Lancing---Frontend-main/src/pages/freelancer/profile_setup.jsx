import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import StepProgress from '../../components/profile/StepProgress';
import StepNavigation from '../../components/profile/StepNavigation';
import TellAboutSelf from '../../components/profile/freelancer/TellAboutSelf';
import CategorySelection from '../../components/profile/freelancer/CategorySelection';
import ProfessionalDetails from '../../components/profile/freelancer/ProfessionalDetails';
import ExperienceDetails from '../../components/profile/freelancer/ExperienceDetails';
import EducationDetails from '../../components/profile/freelancer/EducationDetails';
import LanguageDetails from '../../components/profile/freelancer/LanguageDetails';
import HourlyRate from '../../components/profile/freelancer/HourlyRate';
import LocationDetails from '../../components/profile/freelancer/LocationDetails';
import ReviewSubmit from '../../components/profile/freelancer/ReviewSubmit';

const FreelancerProfileSetup = () => {
    const { completeProfile } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const totalSteps = 9;

    const [formData, setFormData] = useState({
        intro: {
            method: '',
            linkedinUrl: '',
            resumeName: ''
        },
        category: {
            category: '',
            specialties: []
        },
        profession: {
            title: '',
            bio: '',
            skills: []
        },
        experience: {
            experiences: []
        },
        education: {
            educationList: []
        },
        language: {
            languages: []
        },
        billing: {
            hourlyRate: '',
            serviceFee: '0.00',
            netAmount: '0.00'
        },
        location: {
            profilePhoto: null,
            dob: '',
            country: 'India',
            address: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
        }
    });

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSkip = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            console.log('Finalizing Freelancer Profile...', formData);
            // Simulate a very short delay for visual feedback if needed, or remove entirely
            await new Promise(resolve => setTimeout(resolve, 500));

            completeProfile();
            console.log('Profile marked complete, navigating to dashboard...');
            navigate('/freelancer/dashboard', { replace: true });
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
            console.error('Setup Finalization Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                if (formData.intro.method === 'linkedin') return formData.intro.linkedinUrl.length > 10;
                if (formData.intro.method === 'resume') return true; // Could add file validation later
                return formData.intro.method === 'manual';
            case 2:
                return formData.category.category && formData.category.specialties.length > 0;
            case 3:
                return formData.profession.title && formData.profession.bio && formData.profession.skills.length >= 3;
            case 4:
                return true; // Experience can be empty (optional)
            case 5:
                return true; // Education can be empty (optional)
            case 6:
                return formData.language.languages?.length > 0;
            case 7:
                return parseFloat(formData.billing.hourlyRate) > 0;
            case 8:
                return formData.location.dob && formData.location.address && formData.location.city && formData.location.phone;
            case 9:
                return true;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <TellAboutSelf data={formData.intro} updateData={updateFormData} />;
            case 2:
                return <CategorySelection data={formData.category} updateData={updateFormData} />;
            case 3:
                return <ProfessionalDetails data={formData.profession} updateData={updateFormData} />;
            case 4:
                return <ExperienceDetails data={formData.experience} updateData={updateFormData} />;
            case 5:
                return <EducationDetails data={formData.education} updateData={updateFormData} />;
            case 6:
                return <LanguageDetails data={formData.language} updateData={updateFormData} />;
            case 7:
                return <HourlyRate data={formData.billing} updateData={updateFormData} />;
            case 8:
                return <LocationDetails data={formData.location} updateData={updateFormData} />;
            case 9:
                return <ReviewSubmit allData={formData} />;
            default:
                return null;
        }
    };

    const getNextLabel = () => {
        switch (currentStep) {
            case 1: return "Next, select category";
            case 2: return "Next, add professional details";
            case 3: return "Next, add experience";
            case 4: return "Next, add education";
            case 5: return "Next, add languages";
            case 6: return "Next, set hourly rate";
            case 7: return "Next, add location & photo";
            case 8: return "Next, review profile";
            case 9: return "Finalize Setup";
            default: return "Next Step";
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-bg-dark relative overflow-hidden flex flex-col">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Mini Header / Logo */}
            <div className="max-w-7xl mx-auto w-full mb-8 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-xl italic">L</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Navlancer<span className="text-primary">.</span></span>
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-widest hidden md:block">
                    Freelancer Verification System
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center relative z-10">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-black mb-4 glow-text text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Freelancer Profile
                    </motion.h1>
                    <motion.p
                        className="text-text-muted text-lg max-w-lg mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Showcase your talent and connect with clients from all over the world.
                    </motion.p>
                </div>

                {/* Main Card */}
                <motion.div
                    className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Inner Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                    <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

                    <div className="min-h-[420px] mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {error && (
                        <motion.div
                            className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="mt-10">
                        <StepNavigation
                            onNext={handleNext}
                            onBack={handleBack}
                            onSkip={handleSkip}
                            isFirst={currentStep === 1}
                            isLast={currentStep === totalSteps}
                            isValid={isStepValid() && !isSubmitting}
                            isLoading={isSubmitting}
                            nextLabel={getNextLabel()}
                        />
                    </div>
                </motion.div>

                {/* Footer Info */}
                <motion.div
                    className="mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-xs text-text-muted/60 font-medium tracking-wide">
                        SECURE ENCRYPTED SETUP &bull; POWERED BY NAVLANCER DATA ENGINE
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default FreelancerProfileSetup;
