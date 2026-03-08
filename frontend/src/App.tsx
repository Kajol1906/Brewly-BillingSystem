import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import SignupScreen from "./components/auth/SignupScreen";
import LoginScreen from './components/auth/LoginScreen';

import Dashboard from './components/dashboard/Dashboard';
import { POSScreen } from './components/pos/POSScreen';
import EventBooking from './components/events/EventBooking';
import MenuItems from './components/menu/MenuItems';
import InventoryTable from './components/menu/InventoryTable';
import AIInsights from './components/ai/AIInsights';
import Settings from './components/settings/Settings';

import Navbar from './components/layout/Navbar';
import { Toaster } from './components/ui/toaster';
import { useSettings } from './context/SettingsContext';
import { decodeJwt } from './utils/jwt';

export type Screen =
    | 'login'
    | 'signup'
    | 'dashboard'
    | 'pos'
    | 'menu'
    | 'inventory'
    | 'events'
    | 'ai-insights'
    | 'settings';

function App() {
    // 🔹 ALWAYS start with login
    const [currentScreen, setCurrentScreen] = useState<Screen>('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { updateSettings } = useSettings();

    // Handle Google OAuth redirect — extract token from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            // Extract email from JWT and update settings
            const payload = decodeJwt(token);
            // Use 'sub' claim as email (backend sets email as subject)
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
                // Also update localStorage for settings to persist email
                const savedSettings = localStorage.getItem('brewlySettings');
                let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                settingsObj.email = userEmail;
                localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
            }
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }
        // Auto-login if token exists in localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            // Extract email from JWT and update settings
            const payload = decodeJwt(storedToken);
            // Use 'sub' claim as email (backend sets email as subject)
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
                // Also update localStorage for settings to persist email
                const savedSettings = localStorage.getItem('brewlySettings');
                let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                settingsObj.email = userEmail;
                localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
            }
        }
        // Only run once on mount to avoid infinite loop
        // eslint-disable-next-line
    }, []);

    /* 🔹 Called after LOGIN or SIGNUP */
    const handleAuthSuccess = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
        // Extract email from JWT and update settings
        const payload = decodeJwt(token);
        // Use 'sub' claim as email (backend sets email as subject)
        if (payload && (payload.email || payload.sub)) {
            const userEmail = payload.email || payload.sub;
            updateSettings({ email: userEmail });
            // Also update localStorage for settings to persist email
            const savedSettings = localStorage.getItem('brewlySettings');
            let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
            settingsObj.email = userEmail;
            localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
        }
    };

    /* 🔹 Logout */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentScreen('login');
    };

    /* 🔹 Not authenticated → login/signup only */

    if (!isAuthenticated) {
        if (currentScreen === 'signup') {
            return (
                <SignupScreen
                    onSignupSuccess={handleAuthSuccess}
                    onGoToLogin={() => setCurrentScreen('login')}
                />
            );
        }
        return (
            <LoginScreen
                onLoginSuccess={handleAuthSuccess}
                onGoToSignup={() => setCurrentScreen('signup')}
            />
        );
    }

    /* 🔹 Screen renderer */
    const renderScreen = () => {
        switch (currentScreen) {
            case 'dashboard':
                return <Dashboard />;
            case 'pos':
                return <POSScreen />;
            case 'events':
                return <EventBooking />;
            case 'menu':
                return <MenuItems />;
            case 'inventory':
                return <InventoryTable />;
            case 'ai-insights':
                return <AIInsights />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    // @ts-ignore
    return (
        <div className="min-h-screen bg-background">
            <Toaster />

            {/* 🔧 UPDATED: userRole removed */}
            <Navbar
                onLogout={handleLogout}
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
                onNavigateToSettings={() => setCurrentScreen('settings')}
            />

            <div className="flex pt-16 w-full h-[auto]">
                <main
                    className="flex-1 w-full transition-all duration-300 py-6"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScreen}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            {renderScreen()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default App;



