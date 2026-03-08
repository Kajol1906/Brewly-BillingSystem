
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
// Landing page imports
import { HeroSection } from './components/landing/HeroSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { UseCasesSection } from './components/landing/UseCasesSection';
import { ContactSection } from './components/landing/ContactSection';
import { Footer } from './components/landing/Footer';


export type Screen =
    | 'landing'
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
    // Start with landing page if not authenticated
    const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
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
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
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
            const payload = decodeJwt(storedToken);
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
                const savedSettings = localStorage.getItem('brewlySettings');
                let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                settingsObj.email = userEmail;
                localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
            }
        }
    }, []);

    // Called after LOGIN or SIGNUP
    const handleAuthSuccess = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
        const payload = decodeJwt(token);
        if (payload && (payload.email || payload.sub)) {
            const userEmail = payload.email || payload.sub;
            updateSettings({ email: userEmail });
            const savedSettings = localStorage.getItem('brewlySettings');
            let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
            settingsObj.email = userEmail;
            localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentScreen('login');
    };

    // Landing page flow
    if (!isAuthenticated && currentScreen === 'landing') {
        return (
            <div className="min-h-screen bg-background">
                <HeroSection onGetStarted={() => setCurrentScreen('login')} />
                <FeaturesSection />
                <UseCasesSection />
                <ContactSection />
                <Footer />
            </div>
        );
    }

    // Not authenticated → login/signup only
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

    // Authenticated: main app
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

    return (
        <div className="min-h-screen bg-background">
            <Toaster />
            <Navbar
                onLogout={handleLogout}
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
                onNavigateToSettings={() => setCurrentScreen('settings')}
            />
            <div className="flex pt-16 w-full h-[auto]">
                <main className="flex-1 w-full transition-all duration-300 py-6">
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



