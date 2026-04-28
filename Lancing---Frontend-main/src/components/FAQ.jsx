import React from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
    return (
        <section className="py-24 px-[5%] bg-bg-dark text-white relative">
            <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                {/* Left Column - Heading */}
                <div>
                    <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight sticky top-24">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* Right Column - Content */}
                <div className="flex flex-col gap-6">
                    {/* Q1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 hover:bg-white/[0.05] transition-colors duration-300"
                    >
                        <h3 className="text-[1.5rem] font-bold mb-4 text-primary">What is Navlancer?</h3>
                        <p className="text-text-muted text-[1rem] leading-relaxed mb-4">
                            Navlancer is a global work marketplace that connects businesses, agencies, and freelancers. It's free for anyone to sign up and get started.
                        </p>
                        <p className="text-text-muted text-[1rem] leading-relaxed">
                            Businesses and teams use Navlancer to flex their capacity, accelerate key projects, and access specialized expertise in AI, Machine Learning, Design, Marketing, Software Development, and more.
                        </p>
                    </motion.div>

                    {/* Q2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 hover:bg-white/[0.05] transition-colors duration-300"
                    >
                        <h3 className="text-[1.5rem] font-bold mb-4 text-primary">How does Navlancer work?</h3>
                        <p className="text-text-muted text-[1rem] leading-relaxed mb-4">
                            Clients browse for freelancers, post projects, review proposals, and conduct interviews on the platform. Freelancers browse projects, submit proposals, or can be invited directly by clients.
                        </p>
                        <p className="text-text-muted text-[1rem] leading-relaxed">
                            Freelancers and clients can collaborate on Navlancer's trusted platform, which offers features like messaging, file sharing, time tracking, and secure payments.
                        </p>
                    </motion.div>

                    {/* Q3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 hover:bg-white/[0.05] transition-colors duration-300"
                    >
                        <h3 className="text-[1.5rem] font-bold mb-4 text-primary">Who is Navlancer for?</h3>
                        <p className="text-text-muted text-[1rem] leading-relaxed mb-4">
                            Navlancer is best used by companies of all sizes that need flexible, reliable freelance talent. While solopreneurs can use Navlancer for one-off projects, the platform really shines when businesses use it to build teams, scale quickly, or bring in specialized skills without the cost of full-time hiring.
                        </p>
                        <p className="text-text-muted text-[1rem] leading-relaxed">
                            Freelancers use Navlancer to connect with businesses of all sizes around the world, find steady work, and grow their careers. It's also a great place for beginners to start freelancing.
                        </p>
                    </motion.div>

                    {/* Q4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 hover:bg-white/[0.05] transition-colors duration-300"
                    >
                        <h3 className="text-[1.5rem] font-bold mb-4 text-primary">How much does Navlancer cost?</h3>
                        <p className="text-text-muted text-[1rem] leading-relaxed mb-6">
                            It's free to sign up, post jobs, and create a profile on Navlancer, while fees vary depending on the membership plan.
                        </p>

                        <div className="mb-6">
                            <h4 className="text-[1.1rem] font-semibold mb-2 text-white">Client plans:</h4>
                            <div className="mb-4">
                                <p className="font-medium text-white mb-1">Basic</p>
                                <ul className="list-disc pl-5 text-text-muted space-y-1">
                                    <li>No contract initiation fee.</li>
                                    <li>A 5% marketplace fee applies to all payments.*</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Business Plus</p>
                                <ul className="list-disc pl-5 text-text-muted space-y-1">
                                    <li>Access to top 1% talent and premium support.</li>
                                    <li>A 10% fee applies to all payments.*</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[1.1rem] font-semibold mb-2 text-white">Freelancer plan:</h4>
                            <ul className="list-disc pl-5 text-text-muted space-y-1">
                                <li>A service fee deducted from earnings on each contract.</li>
                                <li>Freelancers use 'Connects' to submit job proposals.</li>
                                <li>Secure withdrawal methods with flat fees per transaction.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
