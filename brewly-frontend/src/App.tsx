
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

import { HeroSection } from './components/landing/HeroSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { UseCasesSection } from './components/landing/UseCasesSection';
import { ContactSection } from './components/landing/ContactSection';
import { Footer } from './components/landing/Footer';
import LandingNavbar from './components/landing/LandingNavbar';
import { ChatAssistant } from './components/ui/ChatAssistant';

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
    const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');  
    const { updateSettings } = useSettings();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorMsg = params.get('error');
        if (errorMsg) {
            setAuthError(errorMsg);
            if (errorMsg.toLowerCase().includes('login')) {
                setCurrentScreen('login');
            } else {
                setCurrentScreen('signup');
            }
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            const payload = decodeJwt(token);
            const userEmail = payload?.email || payload?.sub || '';
            const userName = params.get('name') || '';
            const settingsUpdate: any = {};
            if (userEmail) settingsUpdate.email = userEmail;
            if (userName) settingsUpdate.storeName = userName;
            if (Object.keys(settingsUpdate).length > 0) {
                updateSettings(settingsUpdate);
                const savedSettings = localStorage.getItem('brewlySettings');
                let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                Object.assign(settingsObj, settingsUpdate);
                localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
            }
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            const payload = decodeJwt(storedToken);
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
                import('axios').then(axios => {
                    axios.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/user/settings`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }).then(res => {
                        const { storeName, phoneNumber, storeAddress } = res.data;
                        const updates: any = {};
                        if (storeName) updates.storeName = storeName;
                        if (phoneNumber) updates.phoneNumber = phoneNumber;
                        if (storeAddress) updates.storeAddress = storeAddress;
                        updateSettings(updates);
                    }).catch(console.error);
                });
            }
        }
    }, []);

    const handleAuthSuccess = (token: string, name?: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentScreen('landing');
    };

    const renderContent = () => {
        if (!isAuthenticated && currentScreen === 'landing') {
            return (
                <div className="min-h-screen bg-background relative">
                    <LandingNavbar
                        onLogin={() => setCurrentScreen('login')}
                        onSignup={() => setCurrentScreen('signup')}
                    />
                    <HeroSection onGetStarted={() => setCurrentScreen('login')} />
                    <FeaturesSection />
                    <UseCasesSection />
                    <ContactSection />
                    <Footer />
                </div>
            );
        }

        if (!isAuthenticated) {
            if (currentScreen === 'signup') {
                return (
                    <SignupScreen
                        onSignupSuccess={handleAuthSuccess}
                        onGoToLogin={() => { setAuthError(''); setCurrentScreen('login'); }}
                        googleError={authError}
                    />
                );
            }
            return (
                <LoginScreen
                    onLoginSuccess={handleAuthSuccess}
                    onGoToSignup={() => { setAuthError(''); setCurrentScreen('signup'); }}
                    googleError={authError}
                />
            );
        }

        const renderScreen = () => {
            switch (currentScreen) {
                case 'dashboard': return <Dashboard />;
                case 'pos': return <POSScreen />;
                case 'events': return <EventBooking />;
                case 'menu': return <MenuItems />;
                case 'inventory': return <InventoryTable />;
                case 'ai-insights': return <AIInsights />;
                case 'settings': return <Settings />;
                default: return <Dashboard />;
            }
        };

        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar
                    onLogout={handleLogout}
                    currentScreen={currentScreen}
                    onNavigate={setCurrentScreen}
                    onNavigateToSettings={() => setCurrentScreen('settings')}
                />
                <div className="flex pt-16 w-full h-full">
                    <main className="flex-1 w-full py-6 px-4 md:px-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentScreen}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderScreen()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        );
    };

    return (
        <div className="dark h-full w-full">
            <Toaster />
            <ChatAssistant />
            {renderContent()}
        </div>
    );
}

export default App;
