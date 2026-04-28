import React, { useState } from 'react';
import { motion } from 'framer-motion';


const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('hiring'); // 'hiring' or 'finding'

    const hiringSteps = [
        {
            id: 1,
            title: "Posting jobs is always free",
            description: "Generate a job post with AI or create your own and filter talent matches.",
            image: "/how-1.png",
            buttonText: "Create a job",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        },
        {
            id: 2,
            title: "Get proposals and hire",
            description: "Review proposals, chat with candidates, and select the best fit for your needs.",
            image: "/how-2.png",
            buttonText: "Explore experts",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        },
        {
            id: 3,
            title: "Pay when work is done",
            description: "Payment is released only when you approve the work and are 100% satisfied.",
            image: "/how-3.png",
            buttonText: "View Price",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        }
    ];

    const findingSteps = [
        {
            id: 4,
            title: "Find clients and remote jobs",
            description: "Create your profile to highlight your skills and get matched with clients.",
            image: "/find-1.png",
            buttonText: "create a profile",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        },

        {
            id: 5,
            title: "Submit proposals for work",
            description: "Negotiates rates for the project you want or reply to invites from clients",
            image: "/find-2.png",
            buttonText: "Search jobs",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        },
        {
            id: 6,
            title: "Get paid as you deliver work",
            description: "Land a contract and get paid as you deliver work.",
            image: "/find-3.png",
            buttonText: "Estimate earnings",
            buttonClass: "bg-[#108A00] text-white hover:bg-[#14a800]",
        }
    ];

    const currentSteps = activeTab === 'hiring' ? hiringSteps : findingSteps;

    return (
        <section className="py-20 px-[5%] bg-bg-dark">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 flex-wrap gap-4">
                <h2 className="text-[2.5rem] font-bold m-0">How it works</h2>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1.5 relative w-full md:w-auto justify-center gap-1 backdrop-blur-sm">
                    <button
                        className={`border-none px-8 py-3 rounded-full font-medium text-[1rem] cursor-pointer transition-all duration-300 ${activeTab === 'hiring' ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.4)]' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setActiveTab('hiring')}
                    >
                        For hiring
                    </button>
                    <button
                        className={`border-none px-8 py-3 rounded-full font-medium text-[1rem] cursor-pointer transition-all duration-300 ${activeTab === 'finding' ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.4)]' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setActiveTab('finding')}
                    >
                        For finding work
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                {currentSteps.map((step) => (
                    <motion.div
                        key={step.id}
                        className="flex flex-col group"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                    >
                        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-6 relative">
                            <img src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            {/* Special overlay for the first card of 'hiring' tab as per original design */}
                            {activeTab === 'hiring' && step.id === 1 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black">
                                    <h3 className="text-[2rem] font-bold mb-1 tracking-[-1px]">Navlancer</h3>
                                    <span className="text-[1rem] font-medium">Get started</span>
                                </div>
                            )}
                        </div>

                        <div className="px-2">
                            <h3 className="text-[1.5rem] font-semibold mb-2 text-text-main">{step.title}</h3>

                            <motion.div
                                className="overflow-hidden"
                                variants={{
                                    rest: { height: 0, opacity: 0, marginTop: 0 },
                                    hover: { height: "auto", opacity: 1, marginTop: "1rem" }
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <p className="text-[1rem] text-text-muted leading-[1.5] mb-6">{step.description}</p>
                                <button className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 text-[0.95rem] border-none outline-none w-fit block mx-auto ${step.buttonClass}`}>
                                    {step.buttonText}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
