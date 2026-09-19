import { motion } from 'motion/react';

interface AuthBackdropProps {
    variant?: 'login' | 'signup';
}

export function AuthBackdrop({ variant = 'login' }: AuthBackdropProps) {
    const isSignup = variant === 'signup';

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#0f0d0a]">
            {/* Base gradient layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: [
                        'radial-gradient(ellipse 80% 60% at 10% 90%, rgba(200,149,108,0.08) 0%, transparent 50%)',
                        'radial-gradient(ellipse 70% 50% at 90% 10%, rgba(217,123,60,0.06) 0%, transparent 50%)',
                        'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(42,34,24,0.5) 0%, transparent 80%)',
                    ].join(', '),
                }}
            />

            {/* Subtle dot grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(200,149,108,0.8) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Animated floating orbs */}
            <motion.div
                className="absolute rounded-full blur-[100px]"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(200,149,108,0.12) 0%, rgba(200,149,108,0.03) 50%, transparent 70%)',
                    left: isSignup ? '60%' : '-5%',
                    top: isSignup ? '-15%' : '50%',
                }}
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute rounded-full blur-[120px]"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, rgba(217,123,60,0.08) 0%, rgba(217,123,60,0.02) 50%, transparent 70%)',
                    right: isSignup ? '-10%' : '5%',
                    top: isSignup ? '40%' : '-10%',
                }}
                animate={{
                    x: [0, -30, 15, 0],
                    y: [0, 25, -35, 0],
                    scale: [1, 0.9, 1.08, 1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            <motion.div
                className="absolute rounded-full blur-[80px]"
                style={{
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(200,149,108,0.06) 0%, transparent 70%)',
                    left: '45%',
                    bottom: '10%',
                }}
                animate={{
                    x: [0, 20, -10, 0],
                    y: [0, -15, 10, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />

            {/* Subtle light streaks */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#c8956c]/15 to-transparent"
                    style={{
                        width: '40%',
                        left: isSignup ? '55%' : '5%',
                        top: '25%',
                        transform: 'rotate(-8deg)',
                    }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#d97b3c]/10 to-transparent"
                    style={{
                        width: '35%',
                        right: isSignup ? '5%' : '10%',
                        bottom: '30%',
                        transform: 'rotate(5deg)',
                    }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,13,10,0.4)_70%,rgba(15,13,10,0.8)_100%)]" />
        </div>
    );
}
