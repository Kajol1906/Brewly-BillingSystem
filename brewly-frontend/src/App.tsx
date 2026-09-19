
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SignupScreen from "./components/auth/SignupScreen";
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/dashboard/Dashboard';
import { POSScreen } from './components/pos/POSScreen';
import KitchenDisplay from './components/pos/KitchenDisplay';
import EventBooking from './components/events/EventBooking';
import MenuItems from './components/menu/MenuItems';
import InventoryTable from './components/menu/InventoryTable';
import AIInsights from './components/ai/AIInsights';
import Settings from './components/settings/Settings';
import Navbar from './components/layout/Navbar';
import { Toaster } from './components/ui/toaster';
import RecipeManager from './components/recipes/RecipeManager';
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
    | 'kds'
    | 'menu'
    | 'inventory'
    | 'recipes'
    | 'events'
    | 'ai-insights'
    | 'settings';


function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    const { settings: appSettings, updateSettings } = useSettings();
    const [bgMousePos, setBgMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (currentScreen !== 'landing') return;
        const handleMouseMove = (e: MouseEvent) => {
            setBgMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentScreen]);

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
            // Keep currentScreen at 'landing' to show landing page first
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

    const handleAuthSuccess = (token: string, _name?: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentScreen('landing');
    };

    const renderLandingPage = (isAuthed: boolean) => {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF6F0] selection:bg-[#5C3D2E]/25 selection:text-[#2C1810]">
                {/* Unified Interactive Canvas Background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Stylized Modern Coffee Bean repeating stencils */}
                    <div className="absolute inset-0 opacity-[0.055] mix-blend-multiply">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="modernCoffeeBeansPattern" x="0" y="0" width="80" height="120" patternUnits="userSpaceOnUse">
                                    <g transform="translate(20, 30) rotate(-12)">
                                        <rect x="-7" y="-13" width="14" height="26" rx="7" fill="#5C3D2E" />
                                        <path d="M 0 -9 C 1.5 -3, -1.5 3, 0 9" stroke="#FAF6F0" strokeWidth="1.2" fill="none" />
                                    </g>
                                    <g transform="translate(60, 90) rotate(-12)">
                                        <rect x="-7" y="-13" width="14" height="26" rx="7" fill="#5C3D2E" />
                                        <path d="M 0 -9 C 1.5 -3, -1.5 3, 0 9" stroke="#FAF6F0" strokeWidth="1.2" fill="none" />
                                    </g>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#modernCoffeeBeansPattern)" />
                        </svg>
                    </div>

                    {/* Ambient Light Spotlights & Shadows */}
                    {/* Left glowing sweeping warm light */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.45)_35%,rgba(250,246,240,0)_70%)] opacity-95 mix-blend-screen" />

                    {/* Right rich dark chocolate gradient glow matching reference image */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_35%,rgba(92,61,46,0.18)_0%,rgba(44,24,16,0.06)_50%,transparent_80%)]" />

                    {/* Interactive Cursor-Following Ambient Light Orb */}
                    <motion.div
                        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.12)_0%,rgba(180,134,101,0.04)_40%,transparent_70%)] pointer-events-none mix-blend-multiply"
                        animate={{
                            x: bgMousePos.x - 300,
                            y: bgMousePos.y - 300,
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 25, mass: 0.8 }}
                    />

                    {/* Subtle drifting warm orbs in the background */}
                    <motion.div
                        className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,transparent_70%)] pointer-events-none mix-blend-overlay"
                        animate={{
                            x: [100, 300, 100],
                            y: [200, 400, 200],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 w-full">
                    <LandingNavbar
                        onLogin={() => setCurrentScreen('login')}
                        onSignup={() => setCurrentScreen('signup')}
                        isAuthenticated={isAuthed}
                        onDashboard={() => setCurrentScreen('dashboard')}
                    />
                    <HeroSection onGetStarted={() => setCurrentScreen(isAuthed ? 'dashboard' : 'login')} />
                    <FeaturesSection />
                    <UseCasesSection />
                    <ContactSection />
                    <Footer />
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (!isAuthenticated && currentScreen === 'landing') {
            return renderLandingPage(false);
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

        // Authenticated user viewing landing page
        if (currentScreen === 'landing') {
            return renderLandingPage(true);
        }

        const renderScreen = () => {
            switch (currentScreen) {
                case 'dashboard': return <Dashboard />;
                case 'pos': return <POSScreen />;
                case 'kds': return <KitchenDisplay />;
                case 'menu': return <MenuItems />;
                case 'inventory': return <InventoryTable />;
                case 'recipes': return <RecipeManager />;
                case 'events': return <EventBooking />;
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
        <div className={`${appSettings.theme === 'dark' ? 'dark' : ''} h-full w-full`}>
            <Toaster />
            <ChatAssistant />
            {renderContent()}
        </div>
    );
}

export default App;
