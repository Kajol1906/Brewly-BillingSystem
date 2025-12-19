import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Menu, 
  Package, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Screen } from '../../App';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos' as Screen, label: 'POS', icon: ShoppingCart },
  { id: 'menu' as Screen, label: 'Menu', icon: Menu },
  { id: 'inventory' as Screen, label: 'Inventory', icon: Package },
  { id: 'events' as Screen, label: 'Events', icon: Calendar },
  { id: 'vendors' as Screen, label: 'Vendors', icon: Users },
  { id: 'ai-insights' as Screen, label: 'AI Insights', icon: Sparkles },
  { id: 'reports' as Screen, label: 'Reports', icon: BarChart3 },
  { id: 'settings' as Screen, label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentScreen, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0, width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-0 top-16 bottom-0 bg-white border-r border-border shadow-soft-sm overflow-hidden"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors z-10 shadow-soft-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-[#6C63FF]/10 to-[#93E5AB]/10 text-[#6C63FF]' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6C63FF] to-[#93E5AB] rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 rounded-full bg-[#6C63FF]"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
