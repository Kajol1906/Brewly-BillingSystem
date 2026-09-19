import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, Coffee, ShoppingBag, Grid } from 'lucide-react';
import { API_BASE } from '../../config/api';
import { useWebSocket } from '../../services/useWebSocket';
import { useSettings } from '../../context/SettingsContext';

interface OrderItem {
  id: number;
  menuItem: {
    name: string;
    category: string;
    price: number;
  };
  quantity: number;
}

interface OrderTicket {
  id: number;
  createdAt: string;
  tableId: number | null;
  status: string;
  items: OrderItem[];
}

export default function KitchenDisplay() {
  const [tickets, setTickets] = useState<OrderTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesMap, setTablesMap] = useState<Record<number, string>>({});
  const [, setTick] = useState(0); // Force re-render for live timer
  const { settings } = useSettings();
  const isDark = settings.theme === 'dark';

  // Theme colors
  const bg = isDark ? '#0f0d0a' : '#FAF6F0';
  const cardBg = isDark ? '#1a1612' : '#ffffff';
  const titleColor = isDark ? '#f1f5f9' : '#2C1810';
  const subtitleColor = isDark ? '#94a3b8' : '#8C7B6B';
  const accentColor = isDark ? '#D4A574' : '#5C3D2E';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 61, 46, 0.15)';
  const itemNameColor = isDark ? '#e2e8f0' : '#2C1810';
  const categoryBg = isDark ? 'rgba(212, 165, 116, 0.1)' : 'rgba(92, 61, 46, 0.05)';
  const categoryTextColor = isDark ? '#D4A574' : '#8C7B6B';
  const footerBg = isDark ? '#1a1612' : '#f9fafb';

  // Live timer: re-render every 30s to update elapsed times
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Play a soft sweet high-quality dual-tone kitchen chime using Web Audio API!
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Node 1: High tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      
      // Node 2: Harmonious chord tone
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5 chord tone delayed
      gain2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);

      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.8);
      osc2.start(audioCtx.currentTime + 0.1);
      osc2.stop(audioCtx.currentTime + 0.9);
    } catch (e) {
      console.warn("Audio context not allowed yet by user interaction policy");
    }
  };

  const fetchActiveTickets = async (triggerChime = false) => {
    try {
      const response = await fetch(`${API_BASE}/api/pos/orders/active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(prev => {
          // Play chime if ticket list grew
          if (triggerChime && data.length > prev.length) {
            playChime();
          }
          return data;
        });
      }
    } catch (error) {
      console.error("Failed to load active tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tables`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const map: Record<number, string> = {};
        data.forEach((t: any) => {
          map[t.id] = t.tableNumber;
        });
        setTablesMap(map);
      }
    } catch (error) {
      console.error("Failed to load tables mapping:", error);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchActiveTickets(false);
  }, []);

  // WebSockets subscription for instant kitchen updates
  useWebSocket('/topic/orders', () => {
    fetchActiveTickets(true);
  });

  const handleCompleteTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/pos/order/${ticketId}/prepare`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        // Optimistic UI updates
        setTickets(tickets.filter(t => t.id !== ticketId));
      }
    } catch (error) {
      console.error("Failed to complete ticket:", error);
    }
  };

  const getElapsedTime = (createdStr: string) => {
    const created = new Date(createdStr);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  return (
    <div className="min-h-[80vh] flex flex-col p-4 md:p-6" style={{ background: bg }}>
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif flex items-center gap-2" style={{ color: titleColor }}>
            <Coffee className="w-6 h-6" style={{ color: accentColor }} />
            Kitchen Display System (KDS)
          </h2>
          <p className="text-sm" style={{ color: subtitleColor }}>
            Real-time incoming counter and table tickets
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-semibold" style={{ background: isDark ? 'rgba(212, 165, 116, 0.08)' : 'rgba(92, 61, 46, 0.1)', borderColor: isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(92, 61, 46, 0.1)', color: accentColor }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Live Sync Active
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center" style={{ color: subtitleColor }}>
          Loading kitchen monitor...
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(92, 61, 46, 0.2)' }}>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 opacity-80" />
          <h3 className="text-xl font-bold font-serif" style={{ color: titleColor }}>All clear!</h3>
          <p className="mt-1 text-center max-w-sm" style={{ color: subtitleColor }}>
            No pending orders to display. New orders will pop up here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {tickets.map(ticket => {
              const minutesElapsed = getElapsedTime(ticket.createdAt);
              const isUrgent = minutesElapsed >= 10;
              const isWarning = minutesElapsed >= 5 && minutesElapsed < 10;

              return (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="rounded-2xl shadow-soft hover:shadow-hover overflow-hidden flex flex-col justify-between"
                  style={{
                    background: cardBg,
                    border: `1px solid ${isUrgent ? '#c0392b' : isWarning ? '#e67e22' : borderColor}`,
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="p-4 flex items-start justify-between"
                    style={{
                      background: isUrgent 
                        ? 'rgba(192, 57, 43, 0.08)' 
                        : isWarning 
                        ? 'rgba(230, 126, 34, 0.08)' 
                        : isDark ? 'rgba(212, 165, 116, 0.04)' : 'rgba(92, 61, 46, 0.03)'
                    }}
                  >
                    <div>
                      <span className="text-xs font-semibold block" style={{ color: subtitleColor }}>
                        TICKET #{ticket.id}
                      </span>
                      <h4 className="text-lg font-bold flex items-center gap-1.5 mt-0.5" style={{ color: titleColor }}>
                        {ticket.tableId ? (
                          <>
                            <Grid className="w-4 h-4" style={{ color: accentColor }} />
                            Table {tablesMap[ticket.tableId] || ticket.tableId}
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" style={{ color: accentColor }} />
                            Takeaway
                          </>
                        )}
                      </h4>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isUrgent 
                            ? 'bg-red-100 text-red-700 animate-pulse' 
                            : isWarning 
                            ? 'bg-amber-100 text-amber-700' 
                            : ''
                        }`}
                        style={!isUrgent && !isWarning ? { background: isDark ? 'rgba(212, 165, 116, 0.12)' : 'rgba(92, 61, 46, 0.1)', color: accentColor } : {}}
                      >
                        <Clock className="w-3 h-3" />
                        {minutesElapsed} min
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-5 flex-1 space-y-4">
                    {ticket.items.map(item => (
                      <div key={item.id} className="flex justify-between items-start pb-3 last:border-0 last:pb-0" style={{ borderBottom: `1px dashed ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(92, 61, 46, 0.1)'}` }}>
                        <div>
                          <p className="font-semibold text-lg" style={{ color: itemNameColor }}>
                            {item.menuItem.name}
                          </p>
                          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: categoryBg, color: categoryTextColor }}>
                            {item.menuItem.category}
                          </span>
                        </div>
                        <span className="text-xl font-bold w-9 h-9 rounded-xl flex items-center justify-center" style={{ color: accentColor, background: isDark ? 'rgba(212, 165, 116, 0.12)' : 'rgba(92, 61, 46, 0.1)' }}>
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Complete Button */}
                  <div className="p-4 border-t" style={{ background: footerBg, borderColor }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCompleteTicket(ticket.id)}
                      className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all shadow-soft"
                      style={{
                        background: 'linear-gradient(135deg, #5C3D2E, #2C1810)'
                      }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Prepared
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
