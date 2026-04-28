import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 px-[5%] bg-bg-dark relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-[2.5rem] md:text-[3rem] font-bold mb-4">Clients only pay after hiring</h2>
                <p className="text-text-muted text-lg max-w-2xl mx-auto">
                    Choose the plan that suits your needs. No hidden fees, cancel anytime.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
                {/* Basic Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col hover:bg-white/[0.05] transition-all duration-300"
                >
                    <div className="mb-6">
                        <h3 className="text-[1.75rem] font-bold mb-2">Basic</h3>
                        <p className="text-text-muted text-sm">For starting out</p>
                    </div>

                    <div className="mb-8">
                        <span className="text-[2rem] font-bold">5%</span>
                        <span className="text-text-muted text-lg ml-2">Service fee after hiring</span>
                    </div>

                    <div className="mb-8 flex-grow">
                        <p className="font-medium mb-4 text-white">Basic plan includes:</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Check className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">AI-powered features matching features</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">Collaboration and project tracking tools</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">Pay as work is completed</span>
                            </li>
                        </ul>
                    </div>

                    <button onClick={() => navigate('/signup')} className="w-full py-4 rounded-full border border-primary text-primary font-bold text-base transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:border-primary">
                        Get started for free
                    </button>
                </motion.div>

                {/* Business Plus Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col relative hover:bg-white/[0.05] transition-all duration-300"
                >
                    <div className="absolute top-4 right-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[1.75rem] font-bold mb-2">Business Plus</h3>
                        <p className="text-text-muted text-sm">For growing teams</p>
                    </div>

                    <div className="mb-8">
                        <span className="text-[2rem] font-bold">10%</span>
                        <span className="text-text-muted text-lg ml-2">Service fee after hiring</span>
                    </div>

                    <div className="mb-8 flex-grow">
                        <p className="font-medium mb-4 text-white">Everything in Basic, plus:</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">Instant access to pre-vetted top 1% of talent</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">Dedicated Recruiter support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">Advanced team controls & permissions</span>
                            </li>
                        </ul>
                    </div>

                    <button onClick={() => navigate('/signup')} className="w-full py-4 rounded-full border border-primary text-primary font-bold text-base transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:border-primary">
                        Get started for free
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;
