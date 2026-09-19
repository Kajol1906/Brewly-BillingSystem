import { useState } from 'react';
import axios from "axios";
import React from "react";
import { API_BASE } from '../../config/api';

import { motion } from 'motion/react';
import { Coffee, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { AuthBackdrop } from './AuthBackdrop';

interface LoginScreenProps {
    onLoginSuccess: (token: string, name?: string) => void;
    onGoToSignup: () => void;
    googleError?: string;
}

export default function LoginScreen({
    onLoginSuccess,
    onGoToSignup,
    googleError = '',
}: LoginScreenProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(googleError);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE}/api/auth/login`,
                { email, password }
            );

            onLoginSuccess(response.data.token, response.data.name);

        } catch (error: any) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                setError(data);
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError('Invalid email or password.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0f0d0a] text-white">
            <AuthBackdrop variant="login" />

            <div className="relative z-10 flex min-h-screen">
                {/* Left Branding Panel */}
                <div className="hidden lg:flex lg:w-[52%] items-center justify-center p-12 xl:p-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="max-w-lg"
                    >
                        {/* Brand Mark */}
                        <motion.div
                            className="mb-10 flex items-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c8956c] to-[#d97b3c] shadow-[0_8px_32px_rgba(200,149,108,0.25)]">
                                <Coffee className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-semibold tracking-tight text-[#e8ddd0]">
                                Brewly
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            className="text-[3.2rem] xl:text-[3.8rem] font-bold leading-[1.08] tracking-tight text-[#e8ddd0] mb-6"
                            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.7 }}
                        >
                            Your café,
                            <br />
                            <span className="bg-gradient-to-r from-[#c8956c] via-[#d97b3c] to-[#c8956c] bg-clip-text text-transparent">
                                perfected.
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-lg text-[#8c7b6b] leading-relaxed mb-10 max-w-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Smart POS, real-time analytics, and AI-powered insights — everything you need to run your café like a pro.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            className="flex flex-wrap gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.6 }}
                        >
                            {['AI Insights', 'Real-time POS', 'Inventory Mgmt', 'Event Booking'].map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    className="flex items-center gap-2 rounded-full border border-[#c8956c]/15 bg-[#c8956c]/5 px-4 py-2"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.08 }}
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-[#c8956c]" />
                                    <span className="text-sm text-[#c8956c]/90">{feature}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Form Panel */}
                <div className="flex w-full lg:w-[48%] items-center justify-center px-5 py-10 sm:px-8">
                    <motion.div
                        initial={{ y: 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        className="w-full max-w-[420px]"
                    >
                        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-9">
                            {/* Mobile brand */}
                            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8956c] to-[#d97b3c] shadow-lg">
                                    <Coffee className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-semibold text-[#e8ddd0]">
                                    Brewly
                                </span>
                            </div>

                            {/* Header */}
                            <motion.div
                                initial={{ y: 16, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="mb-8 text-center lg:text-left"
                            >
                                <h2 className="mb-2 text-xl font-semibold text-[#e8ddd0]">Welcome back</h2>
                                <p className="text-sm text-[#8c7b6b]">
                                    Sign in to your account to continue
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <label className="text-sm font-medium text-[#e8ddd0]/80 mb-2 block">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c7b6b] transition-colors group-focus-within:text-[#c8956c]" />
                                        <input
                                            type="email"
                                            placeholder="admin@brewly.com"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            className="w-full h-12 rounded-xl border border-white/[0.07] bg-white/[0.04] pl-11 pr-4 text-[#e8ddd0] text-sm placeholder:text-[#8c7b6b]/60 transition-all focus:outline-none focus:border-[#c8956c]/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(200,149,108,0.08)]"
                                        />
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.42 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-[#e8ddd0]/80">Password</label>
                                        <a className="text-xs text-[#c8956c]/70 hover:text-[#c8956c] transition-colors cursor-pointer">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c7b6b] transition-colors group-focus-within:text-[#c8956c]" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            className="w-full h-12 rounded-xl border border-white/[0.07] bg-white/[0.04] pl-11 pr-4 text-[#e8ddd0] text-sm placeholder:text-[#8c7b6b]/60 transition-all focus:outline-none focus:border-[#c8956c]/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(200,149,108,0.08)]"
                                        />
                                    </div>
                                </motion.div>

                                {/* Error */}
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-rose-400/90 text-center bg-rose-400/5 rounded-lg py-2.5 px-3 border border-rose-400/10"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.985 }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative w-full h-12 rounded-xl bg-gradient-to-r from-[#c8956c] via-[#b8845e] to-[#d97b3c] text-white font-medium text-sm shadow-[0_8px_32px_rgba(200,149,108,0.2)] overflow-hidden group disabled:opacity-60"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#d97b3c] via-[#c8956c] to-[#d97b3c] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                            </>
                                        )}
                                    </div>
                                </motion.button>

                                {/* Divider */}
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#8c7b6b]/60 select-none">or</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                                </div>

                                {/* Google */}
                                <motion.button
                                    type="button"
                                    onClick={() => { window.location.href = `${API_BASE}/api/auth/google?mode=login`; }}
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.985 }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.55 }}
                                    className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] text-sm text-[#e8ddd0] transition-all hover:bg-white/[0.07] hover:border-white/[0.12]"
                                >
                                    <svg width="18" height="18" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.04 24.04 0 0 0 0 21.56l7.98-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                    </svg>
                                    <span className="font-medium">Continue with Google</span>
                                </motion.button>

                                {/* Sign up link */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.65 }}
                                    className="text-center pt-1"
                                >
                                    <span className="text-sm text-[#8c7b6b]">Don't have an account? </span>
                                    <button
                                        type="button"
                                        onClick={onGoToSignup}
                                        className="text-sm font-medium text-[#c8956c] hover:text-[#d97b3c] transition-colors"
                                    >
                                        Create one
                                    </button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
