import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
    storeName: string;
    phoneNumber: string;
    storeAddress: string;
    taxNumber: string;
    email: string;
    defaultTaxRate: number;
    currencySymbol: string;
    receiptHeader: string;
    receiptFooter: string;
    theme: 'light' | 'dark';
    language: string;
}

const defaultSettings: AppSettings = {
    storeName: 'Brewly Coffee Shop',
    phoneNumber: '+1 (555) 123-4567',
    storeAddress: '123 Coffee Avenue, New York, NY 10001',
    taxNumber: 'TAX-987654321',
    email: 'contact@brewly.com',
    defaultTaxRate: 18.0,
    currencySymbol: '₹',
    receiptHeader: 'Thanks for visiting Brewly! Enjoy your coffee ☕',
    receiptFooter: 'Follow us on Instagram @BrewlyCafe',
    theme: 'light',
    language: 'en',
};

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('brewlySettings');
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
        // Check system preference for dark mode if no saved preference
        if (
            !saved &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            return { ...defaultSettings, theme: 'dark' };
        }
        return defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('brewlySettings', JSON.stringify(settings));

        // Apply theme globally
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};



