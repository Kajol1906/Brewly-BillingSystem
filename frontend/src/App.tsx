import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import SignupScreen from "./components/auth/SignupScreen";
import LoginScreen from './components/auth/LoginScreen';

import Dashboard from './components/dashboard/Dashboard';
import POSScreen from './components/pos/POSScreen';
import EventBooking from './components/events/EventBooking';
import MenuInventory from './components/menu/MenuInventory';
import AIInsights from './components/ai/AIInsights';
import VendorManagement from './components/vendors/VendorManagement';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { Toaster } from './components/ui/toaster';

export type Screen =
    | 'login'
    | 'signup'
    | 'dashboard'
    | 'pos'
    | 'menu'
    | 'inventory'
    | 'events'
    | 'vendors'
    | 'reports'
    | 'ai-insights'
    | 'settings';

function App() {
    // 🔹 ALWAYS start with login
    const [currentScreen, setCurrentScreen] = useState<Screen>('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /* 🔹 Called after LOGIN or SIGNUP */
    const handleAuthSuccess = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
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
            case 'inventory':
                return <MenuInventory />;
            case 'ai-insights':
                return <AIInsights />;
            case 'vendors':
                return <VendorManagement />;
            case 'reports':
                return (
                    <div className="p-8">
                        <h2>Reports</h2>
                        <p className="text-muted-foreground mt-2">
                            Reports and analytics coming soon...
                        </p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-8">
                        <h2>Settings</h2>
                        <p className="text-muted-foreground mt-2">
                            Settings panel coming soon...
                        </p>
                    </div>
                );
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
                sidebarCollapsed={sidebarCollapsed}
            />

            <div className="flex pt-16">
                <Sidebar
                    currentScreen={currentScreen}
                    onNavigate={setCurrentScreen}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() =>
                        setSidebarCollapsed(!sidebarCollapsed)
                    }
                />

                <main
                    className="flex-1 transition-all duration-300"
                    style={{
                        marginLeft: sidebarCollapsed ? '64px' : '240px',
                    }}
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
