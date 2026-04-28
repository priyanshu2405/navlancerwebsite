import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';


// Simple Google Icon Component
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.52 12.29C23.52 11.43 23.47 10.73 23.32 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.95 21.1C22.21 19.01 23.52 15.92 23.52 12.29Z" fill="#4285F4" />
        <path d="M12 24C15.24 24 17.96 22.92 19.95 21.1L16.08 18.1C15 18.82 13.62 19.24 12 19.24C8.87 19.24 6.22 17.13 5.27 14.29L1.29 17.38C3.26 21.3 7.31 24 12 24Z" fill="#34A853" />
        <path d="M5.27 14.29C5.03 13.57 4.9 12.8 4.9 12C4.9 11.2 4.9 10.43 5.27 9.71L1.29 6.62C0.47 8.24 0 10.06 0 12C0 13.94 0.47 15.76 1.29 17.38L5.27 14.29Z" fill="#FBBC05" />
        <path d="M12 4.75C13.77 4.75 15.35 5.36 16.6 6.55L20.02 3.13C17.96 1.21 15.24 0 12 0C7.31 0 3.26 2.7 1.29 6.62L5.27 9.71C6.22 6.87 8.87 4.75 12 4.75Z" fill="#EA4335" />
    </svg>
);

const Register = () => {
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const role = location.state?.role;

    useEffect(() => {
        if (!role) {
            navigate('/signup');
        }
    }, [role, navigate]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: 'India',
        sendEmails: false,
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!role) {
            setError('User role is missing. Please go back and select your role.');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }

        const payload = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            password: formData.password,
            role,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.accessToken);
                navigate('/profile-setup');
            } else {
                setError(data.message || 'Registration failed. Please check your details.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message === 'Failed to fetch'
                ? `Cannot connect to server at ${API_BASE_URL}`
                : `Error: ${error.message}`);
        }
    };

    const isClient = role === 'client';
    const title = isClient ? "Sign up to hire experts" : "Sign up to find work you love";

    return (
        <div className="min-h-screen pt-[120px] pb-8 px-8 flex items-center justify-center">
            <motion.div
                className="bg-white/[0.03] border border-white/10 p-12 rounded-[20px] w-full max-w-[600px] backdrop-blur-[10px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mb-4">
                    <span className="px-4 py-1.5 bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        Joining as {role}
                    </span>
                </div>
                <h2 className="text-[2rem] mb-8 text-center leading-tight">
                    {title}
                </h2>

                {/* Error Message Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center flex items-center justify-center gap-2"
                    >
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-4 mb-8">
                    <button className="flex items-center justify-center gap-3 p-4 rounded-full bg-white text-black border-none font-bold text-base cursor-pointer transition-transform hover:scale-[1.02]">
                        <GoogleIcon /> Continue with Google
                    </button>
                </div>

                <div className="flex items-center gap-4 text-text-muted my-8 text-[0.9rem]">
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                    OR
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full py-4 px-4 pl-12 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password (8 or more characters)"
                            value={formData.password}
                            onChange={handleChange}
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

                    <div>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-4 bg-black/20 border border-white/10 rounded-[10px] text-white outline-none cursor-pointer focus:border-primary transition-colors appearance-none"
                        >
                            <option value="India" className="bg-[#333]">India</option>
                            <option value="USA" className="bg-[#333]">USA</option>
                            <option value="UK" className="bg-[#333]">UK</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4 mt-4 text-[0.9rem] text-text-muted">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="sendEmails"
                                checked={formData.sendEmails}
                                onChange={handleChange}
                                className="mt-[3px] accent-primary"
                            />
                            {isClient
                                ? "Send me emails with tips on how to find talent that fits my needs."
                                : "Send me helpful emails to find rewarding work and job leads."}
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="mt-[3px] accent-primary"
                            />
                            <span>
                                Yes, I understand and agree to the <a href="#" className="text-primary hover:underline">Navlancer Terms of Service</a>, including the <a href="#" className="text-primary hover:underline">User Agreement</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 mt-6 p-4 bg-primary text-black font-semibold rounded-full hover:shadow-[0_4px_15px_rgba(204,255,0,0.5)] transition-all"
                    >
                        Create my account
                    </button>
                </form>

                <p className="mt-8 text-center text-text-muted text-[0.9rem]">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
