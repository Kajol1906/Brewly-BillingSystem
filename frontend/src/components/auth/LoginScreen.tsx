import { useState } from 'react';
import axios from "axios";
import React from "react";
import { API_BASE } from '../../config/api';

import { motion } from 'motion/react';
import { Coffee, Mail, Lock } from 'lucide-react';

interface LoginScreenProps {
    onLoginSuccess: (token: string) => void;
    onGoToSignup: () => void;
}

export default function LoginScreen({
    onLoginSuccess,
    onGoToSignup,
}: LoginScreenProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_BASE}/api/auth/login`,
                { email, password }
            );

            // 🔐 Role comes ONLY from backend
            onLoginSuccess(response.data.token);

        } catch (error) {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Illustration */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6C63FF] via-[#93E5AB] to-[#FFC8A2] relative overflow-hidden"
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white/10"
                            style={{
                                width: Math.random() * 200 + 50,
                                height: Math.random() * 200 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 100 - 50],
                                x: [0, Math.random() * 100 - 50],
                                scale: [1, Math.random() + 0.5, 1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Centered Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative"
                    >
                        <div className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-hover">
                            <Coffee className="w-32 h-32 text-white" />
                        </div>
                        <motion.div
                            className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 backdrop-blur-lg rounded-2xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 text-white text-center"
                    >
                        Welcome to CaféHub
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-white/80 text-center max-w-md"
                    >
                        Your all-in-one café management solution with AI-powered insights
                    </motion.p>
                </div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card"
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center shadow-soft">
                            <Coffee className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] bg-clip-text text-transparent">
                            CaféHub
                        </span>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="mb-2">Sign in to your account</h2>
                        <p className="text-muted-foreground mb-8">
                            Enter your credentials to continue
                        </p>
                    </motion.div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label>Email</label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="admin@brewly.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label>Password</label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="w-full h-12 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl shadow-soft hover:shadow-hover"
                        >
                            Continue
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Google Sign-In */}
                        <motion.button
                            type="button"
                            onClick={() => { window.location.href = `${API_BASE}/api/auth/google`; }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.65 }}
                            className="w-full h-12 bg-white dark:bg-muted border border-border rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-3 transition-shadow"
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.04 24.04 0 0 0 0 21.56l7.98-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span className="font-medium text-foreground">Sign in with Google</span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center"
                        >
                            <a className="text-sm text-[#6C63FF] hover:underline">
                                Forgot password?
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center"
                        >
                            <button
                                type="button"
                                onClick={onGoToSignup}
                                className="text-sm text-[#6C63FF] hover:underline"
                            >
                                Create new account
                            </button>
                        </motion.div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}



