import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Coffee, Mail, Lock, UserPlus, User } from "lucide-react";

interface SignupScreenProps {
    onSignupSuccess: (token: string) => void; // 🔧 CHANGED
}

export default function SignupScreen({ onSignupSuccess }: SignupScreenProps) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e: any) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/signup",
                { name, email, password }
            );

            // 🔧 UPDATED: backend should return token
            onSignupSuccess(response.data.token);

        } catch (err: any) {
            setError(err.response?.data || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL (same as Login) */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6C63FF] via-[#93E5AB] to-[#FFC8A2] relative overflow-hidden"
            >
                {/* Floating circles */}
                <div className="absolute inset-0">
                    {[...Array(18)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white/10"
                            style={{
                                width: Math.random() * 200 + 60,
                                height: Math.random() * 200 + 60,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 80 - 40],
                                x: [0, Math.random() * 80 - 40],
                                scale: [1, Math.random() + 0.5, 1],
                            }}
                            transition={{
                                duration: Math.random() * 12 + 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <motion.div
                        animate={{ y: [0, -18, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-hover"
                    >
                        <Coffee className="w-28 h-28 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 text-center"
                    >
                        Join Brewly
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-white/80 text-center max-w-md"
                    >
                        Create your account to manage café operations seamlessly
                    </motion.p>
                </div>
            </motion.div>

            {/* RIGHT PANEL */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center shadow-soft">
                            <Coffee className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] bg-clip-text text-transparent">
              Brewly
            </span>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="mb-2">Create your account</h2>
                        <p className="text-muted-foreground mb-8">
                            Fill in the details to get started
                        </p>
                    </motion.div>

                    {/* SIGNUP FORM */}
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Name */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label>Name</label>
                            <div className="relative mt-2">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Email */}
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
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
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
                                    required
                                />
                            </div>
                        </motion.div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="w-full h-12 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl shadow-soft hover:shadow-hover flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Create Account
                        </motion.button>

                        {/* Switch to Login */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center"
                        >
                            <button
                                type="button"
                                onClick={onSignupSuccess}
                                className="text-sm text-[#6C63FF] hover:underline"
                            >
                                Already have an account? Login
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
