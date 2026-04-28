import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useClientProfile } from '../../hooks/useClientProfile';

import StepProgress from '../../components/profile/StepProgress';
import StepNavigation from '../../components/profile/StepNavigation';
import BusinessDetails from '../../components/profile/steps/BusinessDetails';
import HiringIntent from '../../components/profile/steps/HiringIntent';
import BudgetScope from '../../components/profile/steps/BudgetScope';
import ExperienceLevel from '../../components/profile/steps/ExperienceLevel';
import ReviewSubmit from '../../components/profile/steps/ReviewSubmit';

const ClientProfileSetup = () => {
    const { completeProfile } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        business: {
            companyName: '',
            companySize: '',
            industry: ''
        },
        hiring: {
            intent: '',
        },
        budget: {
            monthlyBudget: '',
            projectScale: ''
        },
        experience: {
            level: '',
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

    const { updateProfile } = useClientProfile();

    const handleComplete = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Construct Payload matching API expectations
            const payload = {
                isCompany: true,
                companyName: formData.business.companyName,
                industry: formData.business.industry,
                // Parse employee count from range string (e.g. "1-10" -> 1, "500+" -> 500)
                employeeCount: parseInt(formData.business.companySize) || 1,
                // Combine other details into description as they don't have direct fields in the provided example
                description: `Hiring Intent: ${formData.hiring.intent}. \nProject Scale: ${formData.budget.projectScale}. \nMonthly Budget: ${formData.budget.monthlyBudget}.`,
                // Default empty fields for strictly required structure if any
                website: "",
                address: {
                    street: "",
                    city: "", // Could ask user for this in future
                    state: "",
                    zip: "",
                    country: ""
                },
                socialLinks: {
                    linkedin: ""
                },
                // Send rich data as extra fields if backend supports it
                preferences: {
                    hiringIntent: formData.hiring.intent,
                    budget: formData.budget,
                    preferredExperienceLevel: formData.experience.level
                }
            };

            const result = await updateProfile(payload);

            if (!result.success) {
                throw new Error(result.error);
            }

            completeProfile();
            navigate('/client/dashboard');
        } catch (err) {
            setError(err.message);
            console.error('Setup Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.business.companyName && formData.business.companySize && formData.business.industry;
            case 2:
                return formData.hiring.intent;
            case 3:
                return formData.budget.monthlyBudget && formData.budget.projectScale;
            case 4:
                return formData.experience.level;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <BusinessDetails data={formData.business} updateData={updateFormData} />;
            case 2:
                return <HiringIntent data={formData.hiring} updateData={updateFormData} />;
            case 3:
                return <BudgetScope data={formData.budget} updateData={updateFormData} />;
            case 4:
                return <ExperienceLevel data={formData.experience} updateData={updateFormData} />;
            case 5:
                return <ReviewSubmit allData={formData} />;
            default:
                return null;
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
                    <span className="text-xl font-bold tracking-tight">Navlancer<span className="text-primary">.</span></span>
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-widest hidden md:block">
                    Profile Verification System
                </div>
            </div>

            <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center relative z-10">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-black mb-4 glow-text"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Welcome to Navlancer
                    </motion.h1>
                    <motion.p
                        className="text-text-muted text-lg max-w-lg mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Let's build your professional presence and match you with the world's best talent.
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

                    <div className="min-h-[380px] mt-8">
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

export default ClientProfileSetup;
