import { useState } from 'react';
import { Search, User, LogOut, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {

  onLogout: () => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ onLogout, sidebarCollapsed }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-border z-50"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center shadow-soft">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] bg-clip-text text-transparent">
            CaféHub
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div 
            className={`relative transition-all duration-200 ${
              searchFocused ? 'scale-105' : ''
            }`}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFC8A2] to-[#FFD66C] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">

              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </motion.button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-soft-lg border border-border overflow-hidden"
            >
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
