import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';


const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.accessToken);

                if (data.user.role === 'client') {
                    navigate('/client/dashboard');
                } else if (data.user.role === 'freelancer') {
                    navigate('/freelancer/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Cannot connect to server.');
        }


        // START DUMMY SIMULATION
        // This simulates a successful login. We assume 'client' for dummy test if not specified.
        // setTimeout(() => {
        //     const dummyUser = {
        //         id: '12345',
        //         name: 'Dummy User',
        //         email: email,
        //         role: 'client' // You can change this to test different dashboards
        //     };
        //     const dummyToken = 'dummy-jwt-token-12345';

        //     login(dummyUser, dummyToken);
        //     navigate('/profile-setup');
        // }, 1000);
        // END DUMMY SIMULATION
    };

    return (
        <div className="min-h-screen pt-[120px] pb-8 px-8 flex items-center justify-center">
            <motion.div
                className="bg-white/[0.03] border border-white/10 p-12 rounded-[20px] w-full max-w-[400px] backdrop-blur-[10px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-[2rem] mb-2 text-center">Welcome Back</h2>
                <p className="text-text-muted text-center mb-8">
                    Login to your account to continue
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-4 px-4 pl-12 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-4 px-4 pl-12 pr-12 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none focus:border-primary transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 mt-4 py-3 bg-primary text-black font-semibold rounded-full hover:shadow-[0_4px_15px_rgba(204,255,0,0.5)] transition-all"
                    >
                        Log In <ArrowRight size={20} />
                    </button>
                </form>

                <p className="mt-8 text-center text-text-muted text-[0.9rem]">
                    Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
