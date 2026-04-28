import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const StepNavigation = ({ onNext, onBack, onSkip, isFirst, isLast, isValid, isLoading, nextLabel }) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 md:mt-4 pt-8 border-t border-white/5 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {!isFirst && (
                    <motion.button
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        disabled={isLoading}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-text-muted hover:text-white transition-colors font-semibold rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </motion.button>
                )}

                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSkip}
                    disabled={isLoading}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-text-muted/60 hover:text-white transition-colors font-medium rounded-2xl bg-transparent border border-white/5 hover:bg-white/5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Skip this step
                </motion.button>
            </div>

            <motion.button
                whileHover={isValid && !isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
                onClick={onNext}
                disabled={!isValid || isLoading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-4 rounded-2xl font-black tracking-wide transition-all shadow-xl ${isValid && !isLoading
                    ? 'bg-gradient-to-r from-primary to-[#b3e600] text-black shadow-primary/20 hover:shadow-primary/40'
                    : 'bg-white/5 text-white/20 cursor-not-allowed grayscale'
                    }`}
            >
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span className="uppercase text-xs font-black">Processing</span>
                    </div>
                ) : isLast ? (
                    <div className="flex items-center gap-2">
                        <span className="uppercase text-sm font-black">{nextLabel || "Finalize Setup"}</span>
                        <Check size={20} strokeWidth={3} />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="uppercase text-sm font-black">{nextLabel || "Next Step"}</span>
                        <ArrowRight size={20} strokeWidth={3} />
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default StepNavigation;
