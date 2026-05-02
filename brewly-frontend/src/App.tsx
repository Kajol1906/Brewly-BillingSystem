
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
import LandingNavbar from './components/landing/LandingNavbar';


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
    const [authError, setAuthError] = useState('');  
    const { updateSettings } = useSettings();

    // Handle Google OAuth redirect — extract token or error from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorMsg = params.get('error');
        if (errorMsg) {
            setAuthError(errorMsg);
            // Route to the correct screen based on the error
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
            // Extract email from JWT and name from URL param, update settings
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
        // Auto-login if token exists in localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            const payload = decodeJwt(storedToken);
            if (payload && (payload.email || payload.sub)) {
                const userEmail = payload.email || payload.sub;
                updateSettings({ email: userEmail });
                
                // Fetch settings from backend
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
                        const savedSettings = localStorage.getItem('brewlySettings');
                        let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                        Object.assign(settingsObj, updates, { email: userEmail });
                        localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
                    }).catch(console.error);
                });
            }
        }
    }, []);

    // Called after LOGIN or SIGNUP
    const handleAuthSuccess = (token: string, name?: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
        const payload = decodeJwt(token);
        const userEmail = payload?.email || payload?.sub || '';
        const settingsUpdate: any = {};
        if (userEmail) settingsUpdate.email = userEmail;
        if (name) settingsUpdate.storeName = name;
        if (Object.keys(settingsUpdate).length > 0) {
            updateSettings(settingsUpdate);
            const savedSettings = localStorage.getItem('brewlySettings');
            let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
            Object.assign(settingsObj, settingsUpdate);
            localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
        }
        
        // Fetch full settings from backend
        import('axios').then(axios => {
            axios.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/user/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                const { storeName, phoneNumber, storeAddress } = res.data;
                const updates: any = {};
                if (storeName) updates.storeName = storeName;
                if (phoneNumber) updates.phoneNumber = phoneNumber;
                if (storeAddress) updates.storeAddress = storeAddress;
                
                updateSettings(updates);
                const savedSettings = localStorage.getItem('brewlySettings');
                let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
                Object.assign(settingsObj, updates);
                localStorage.setItem('brewlySettings', JSON.stringify(settingsObj));
            }).catch(console.error);
        });
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentScreen('landing');
    };

    // Landing page flow

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

    // Not authenticated → login/signup only
    if (!isAuthenticated) {
        if (currentScreen === 'signup') {
            return (
                <div className="dark h-full w-full">
                    <div className="min-h-screen bg-background text-foreground">
                        <SignupScreen
                            onSignupSuccess={handleAuthSuccess}
                            onGoToLogin={() => { setAuthError(''); setCurrentScreen('login'); }}
                            googleError={authError}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div className="dark h-full w-full">
                <div className="min-h-screen bg-background text-foreground">
                    <LoginScreen
                        onLoginSuccess={handleAuthSuccess}
                        onGoToSignup={() => { setAuthError(''); setCurrentScreen('signup'); }}
                        googleError={authError}
                    />
                </div>
            </div>
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
        <div className="dark h-full w-full">
            <div className="min-h-screen bg-background text-foreground">
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
        </div>
    );
}

export default App;



