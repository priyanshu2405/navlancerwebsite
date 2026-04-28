import React from 'react';

const StepProgress = ({ currentStep, totalSteps }) => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Current Progress</span>
                    <span className="text-2xl font-bold text-white tracking-tight">Step {currentStep} <span className="text-white/20 font-light">/ {totalSteps}</span></span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Completion</span>
                    <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
            </div>

            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
            </div>

            <div className="flex justify-between mt-6 gap-2">
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 group"
                    >
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${index + 1 < currentStep
                                ? 'bg-primary/40'
                                : index + 1 === currentStep
                                    ? 'bg-primary shadow-[0_0_10px_rgba(204,255,0,0.3)] scale-y-125'
                                    : 'bg-white/5 group-hover:bg-white/10'
                            }`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepProgress;
