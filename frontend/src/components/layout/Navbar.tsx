import { useState } from 'react';
import { User, LogOut, Coffee, Settings, LayoutDashboard, ShoppingCart, Menu, Package, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import type { Screen } from '../../App';

const menuItems = [
  { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos' as Screen, label: 'POS', icon: ShoppingCart },
  { id: 'menu' as Screen, label: 'Menu', icon: Menu },
  { id: 'inventory' as Screen, label: 'Inventory', icon: Package },
  { id: 'events' as Screen, label: 'Events', icon: Calendar },
  { id: 'ai-insights' as Screen, label: 'AI Insights', icon: Sparkles },
];

interface NavbarProps {
  onLogout: () => void;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onNavigateToSettings: () => void;
}

export default function Navbar({ onLogout, currentScreen, onNavigate, onNavigateToSettings }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { settings } = useSettings();
  const userName = settings.email ? settings.email.split('@')[0].charAt(0).toUpperCase() + settings.email.split('@')[0].slice(1) : 'Admin';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-lg border-b border-border z-[100]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <span className="font-['DM_Serif_Display'] text-2xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Brewly
          </span>
        </div>

        {/* Horizontal Navigation */}
        <div className="hidden md:flex flex-1 justify-center items-center px-4">
          <nav className="flex items-center space-x-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex flex-col items-center justify-center w-[4.5rem] py-1 gap-1 rounded-xl transition-colors font-medium text-xs
                    ${isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate w-full text-center">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 w-12 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-foreground font-sans">{userName}</p>
            </div>
          </motion.button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-soft-lg border border-border overflow-hidden z-[100]"
            >
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onNavigateToSettings();
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left font-bold text-foreground bg-transparent"
              >
                <Settings className="w-4 h-4" />
                <span className="font-sans">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left font-bold text-destructive bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-sans">Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}



