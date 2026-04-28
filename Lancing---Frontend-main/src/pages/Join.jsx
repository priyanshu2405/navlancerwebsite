import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Monitor, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Join = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();
    const { setRole } = useAuth();

    const handleCreateAccount = () => {
        if (selectedRole) {
            setRole(selectedRole);
            navigate('/register', { state: { role: selectedRole } });
        }
    };

    return (
        <div className="min-h-screen pt-[120px] pb-8 px-8 flex items-center justify-center">
            <motion.div
                className="w-full max-w-[800px] flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-[2.5rem] mb-12 text-center font-bold">
                    Join as a client or freelancer
                </h2>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full mb-12">
                    {/* Client Card */}
                    <div
                        onClick={() => setSelectedRole('client')}
                        className={`rounded-[20px] p-8 cursor-pointer transition-all duration-300 relative flex flex-col ${selectedRole === 'client' ? 'bg-primary/10 border-2 border-primary' : 'bg-white/[0.03] border border-white/10 hover:bg-white/5'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <Briefcase size={32} className={selectedRole === 'client' ? 'text-primary' : 'text-white'} />
                            <div className={`w-6 h-6 rounded-full transition-all duration-200 ${selectedRole === 'client' ? 'border-[6px] border-primary' : 'border-2 border-white/30'}`} />
                        </div>
                        <h3 className="text-[1.5rem] mb-2 font-semibold">I'm a client, hiring for a project</h3>
                    </div>

                    {/* Freelancer Card */}
                    <div
                        onClick={() => setSelectedRole('freelancer')}
                        className={`rounded-[20px] p-8 cursor-pointer transition-all duration-300 relative flex flex-col ${selectedRole === 'freelancer' ? 'bg-primary/10 border-2 border-primary' : 'bg-white/[0.03] border border-white/10 hover:bg-white/5'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <Monitor size={32} className={selectedRole === 'freelancer' ? 'text-primary' : 'text-white'} />
                            <div className={`w-6 h-6 rounded-full transition-all duration-200 ${selectedRole === 'freelancer' ? 'border-[6px] border-primary' : 'border-2 border-white/30'}`} />
                        </div>
                        <h3 className="text-[1.5rem] mb-2 font-semibold">I'm a freelancer, looking for work</h3>
                    </div>
                </div>

                <button
                    onClick={handleCreateAccount}
                    disabled={!selectedRole}
                    className={`px-12 py-4 text-[1.1rem] bg-primary text-black font-semibold rounded-full flex items-center gap-2 transition-all ${selectedRole ? 'opacity-100 hover:shadow-[0_4px_15px_rgba(204,255,0,0.5)] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                    {selectedRole === 'client' ? 'Join as a Client' : selectedRole === 'freelancer' ? 'Apply as a Freelancer' : 'Create Account'}
                </button>

                <p className="mt-8 text-center text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Join;
