import { useState } from 'react';
import { User, LogOut, Coffee, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

interface NavbarProps {

  onLogout: () => void;
  sidebarCollapsed: boolean;
  onNavigateToSettings: () => void;
}

export default function Navbar({ onLogout, sidebarCollapsed: _sidebarCollapsed, onNavigateToSettings }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { settings } = useSettings();
  const userName = settings.email ? settings.email.split('@')[0].charAt(0).toUpperCase() + settings.email.split('@')[0].slice(1) : 'Admin';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-lg border-b border-border z-50"
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
              className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-soft-lg border border-border overflow-hidden"
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



