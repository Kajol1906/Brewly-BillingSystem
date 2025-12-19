import { useState } from 'react';
import axios from "axios";
import React from "react";

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
                "http://localhost:8080/api/auth/login",
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
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
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
