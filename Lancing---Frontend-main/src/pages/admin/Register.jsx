import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const AdminRegister = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name,
                    email, 
                    password,
                    role: 'admin'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecting to login after successful registration as requested
                navigate('/admin/login');
            } else {
                setError(data.message || 'Registration failed. Please check your details.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Admin registration error:', error);
            setError('System error: Unreachable authentication server.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[150px] -z-10 rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-bg-card border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-primary to-blue-500 opacity-50" />
                    
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                            <Shield size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-center mb-2">Admin Terminal</h2>
                    <p className="text-text-muted text-center mb-10 text-sm font-medium">Register New Authorized Personnel</p>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 mb-8 text-red-500"
                        >
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <p className="text-xs font-bold leading-tight">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Admin Name</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/30 focus:bg-white/[0.07] transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Admin Identifier</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter identifier..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/30 focus:bg-white/[0.07] transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">System Cipher</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter cipher..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary/30 focus:bg-white/[0.07] transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Registering...' : (
                                <>Create Terminal <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-[10px] text-text-muted text-center leading-relaxed">
                            SECURITY WARNING: All access attempts are logged and monitored. Unauthorized attempts will be investigated.
                        </p>
                    </div>
                </div>
                
                <p className="text-center mt-8 text-xs text-text-muted">
                    Technical difficulties? <span className="text-white font-bold cursor-pointer hover:underline">Contact System Admin</span>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
