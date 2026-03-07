import { useState, useMemo } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Coffee, Mail, Lock, UserPlus, Building2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_BASE } from '../../config/api';

const VALID_DOMAINS = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
    'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com', 'mail.com',
    'yandex.com', 'gmx.com', 'fastmail.com', 'tutanota.com',
    'rediffmail.com', 'msn.com', 'me.com', 'mac.com',
];

function isValidEmailDomain(email: string): boolean {
    const match = email.match(/@([a-zA-Z0-9.-]+)$/);
    if (!match) return false;
    const domain = match[1].toLowerCase();
    // Allow valid TLD domains (company domains) or known providers
    if (VALID_DOMAINS.includes(domain)) return true;
    // Allow custom domains with valid TLD (at least x.xx)
    return /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(domain);
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    checks: { label: string; passed: boolean }[];
}

function getPasswordStrength(pw: string): PasswordStrength {
    const checks = [
        { label: 'At least 8 characters', passed: pw.length >= 8 },
        { label: 'Uppercase letter', passed: /[A-Z]/.test(pw) },
        { label: 'Lowercase letter', passed: /[a-z]/.test(pw) },
        { label: 'Number', passed: /[0-9]/.test(pw) },
        { label: 'Special character (!@#$...)', passed: /[^A-Za-z0-9]/.test(pw) },
    ];
    const score = checks.filter(c => c.passed).length;
    const label = score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score <= 3 ? 'Good' : score <= 4 ? 'Strong' : 'Very Strong';
    const color = score <= 1 ? '#ef4444' : score <= 2 ? '#f97316' : score <= 3 ? '#eab308' : score <= 4 ? '#22c55e' : '#6C63FF';
    return { score, label, color, checks };
}


interface SignupScreenProps {
    onSignupSuccess: (token: string) => void;
    onGoToLogin: () => void;
}


export default function SignupScreen({ onSignupSuccess, onGoToLogin }: SignupScreenProps) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailValid = email.length === 0 || (/^[^\s@]+@[^\s@]+$/.test(email) && isValidEmailDomain(email));
    const pwStrength = useMemo(() => getPasswordStrength(password), [password]);
    const canSubmit = name.trim().length > 0 && email.length > 0 && emailValid && pwStrength.score >= 3;

    const handleSignup = async (e: any) => {
        e.preventDefault();
        setError("");

        if (!emailValid) {
            setError("Please enter a valid email with a real domain (e.g. gmail.com, outlook.com)");
            return;
        }
        if (pwStrength.score < 3) {
            setError("Password is too weak. Use at least 8 chars with uppercase, lowercase, number, and special character.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE}/api/auth/signup`,
                { name, email, password }
            );

            onSignupSuccess(response.data.token);

        } catch (err: any) {
            setError(err.response?.data || "Signup failed");
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = `${API_BASE}/api/auth/google`;
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
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card"
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
                        {/* Company Name */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label>Company Name</label>
                            <div className="relative mt-2">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Your company or café name"
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
                                    placeholder="you@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmailTouched(true)}
                                    className={`w-full h-12 pl-12 pr-10 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 ${emailTouched && email.length > 0 && !emailValid
                                            ? 'border-red-500 focus:ring-red-500/30'
                                            : 'border-border focus:ring-[#6C63FF]/30'
                                        }`}
                                    required
                                />
                                {emailTouched && email.length > 0 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {emailValid ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {emailTouched && email.length > 0 && !emailValid && (
                                <p className="text-xs text-red-500 mt-1.5 ml-1">Enter a valid email with a real domain (e.g. gmail.com, outlook.com)</p>
                            )}
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}
                                    className="w-full h-12 pl-12 pr-12 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {/* Strength meter */}
                            {password.length > 0 && (
                                <div className="mt-2.5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div
                                                    key={i}
                                                    className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                                                    style={{ background: i <= pwStrength.score ? pwStrength.color : 'rgba(148,163,184,0.2)' }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium min-w-[70px] text-right" style={{ color: pwStrength.color }}>
                                            {pwStrength.label}
                                        </span>
                                    </div>
                                    {passwordTouched && pwStrength.score < 3 && (
                                        <div className="grid grid-cols-2 gap-1">
                                            {pwStrength.checks.map(c => (
                                                <div key={c.label} className="flex items-center gap-1.5">
                                                    {c.passed ? (
                                                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                                                    ) : (
                                                        <AlertCircle className="w-3 h-3 text-muted-foreground shrink-0" />
                                                    )}
                                                    <span className={`text-[11px] ${c.passed ? 'text-green-500' : 'text-muted-foreground'}`}>{c.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!canSubmit}
                            whileHover={canSubmit ? { scale: 1.02 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className={`w-full h-12 rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all ${canSubmit
                                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white hover:shadow-hover cursor-pointer'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            <UserPlus className="w-5 h-5" />
                            Create Account
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
                            onClick={handleGoogleSignIn}
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

                        {/* Switch to Login */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center"
                        >
                            <button
                                type="button"
                                onClick={onGoToLogin}
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



