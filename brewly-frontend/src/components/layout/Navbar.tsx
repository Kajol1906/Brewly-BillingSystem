import { useState } from 'react';
import { User, LogOut, Coffee, Settings, LayoutDashboard, ShoppingCart, Menu, Package, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import { GlassButton } from '../ui/GlassButton';
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
      className="fixed top-0 left-0 right-0 h-24 border-b z-[100]" style={{ background: '#B48665', boxShadow: 'var(--shadow-sm)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
    >
      <div className="h-full px-8 flex items-center justify-between text-[#fff6e9]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <GlassButton iconOnly className="w-10 h-10 rounded-xl pointer-events-none">
            <Coffee className="w-6 h-6 text-primary" />
          </GlassButton>
          <span className="font-['DM_Serif_Display'] text-2xl tracking-wide" style={{ color: '#fff6e9' }}>
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
                  {isActive ? (
                    <GlassButton iconOnly className="w-8 h-8 rounded-lg pointer-events-none">
                      <Icon className="w-4 h-4" style={{ color: '#fff6e9' }} />
                    </GlassButton>
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#fff6e9' }} />
                  )}
                  <span className="truncate w-full text-center" style={{ color: '#fff6e9' }}>{item.label}</span>
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
            <GlassButton iconOnly className="w-10 h-10 rounded-full pointer-events-none">
              <User className="w-5 h-5 text-primary" />
            </GlassButton>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold font-sans" style={{ color: '#fff6e9' }}>{userName}</p>
            </div>
          </motion.button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#FFF6E9] dark:bg-[#1e293b] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#B48665]/20 overflow-hidden z-[100]"
            >
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onNavigateToSettings();
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left font-bold text-foreground bg-transparent"
              >
                <GlassButton iconOnly className="w-8 h-8 p-0 rounded-lg pointer-events-none">
                  <Settings className="w-4 h-4 text-primary" />
                </GlassButton>
                <span className="font-sans">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left font-bold text-destructive bg-transparent"
              >
                <GlassButton iconOnly className="w-8 h-8 p-0 rounded-lg pointer-events-none">
                  <LogOut className="w-4 h-4 text-destructive" />
                </GlassButton>
                <span className="font-sans">Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}



