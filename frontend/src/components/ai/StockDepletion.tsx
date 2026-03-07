import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getStockDepletion, StockDepletionItem } from '../../services/aiService';

const statusConfig = {
  critical: { color: '#FF6B6B', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, label: 'Critical' },
  warning: { color: '#FFB347', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Clock, label: 'Low' },
  good: { color: '#4CAF50', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle, label: 'Good' },
  'no-data': { color: '#9ca3af', bg: 'bg-muted/30', border: 'border-border', icon: Package, label: 'No usage' },
};

export default function StockDepletion() {
  const [items, setItems] = useState<StockDepletionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockDepletion()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[350px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-muted/30 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <Package className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No ingredients tracked yet.</p>
      </div>
    );
  }

  const criticalCount = items.filter(i => i.status === 'critical').length;
  const warningCount = items.filter(i => i.status === 'warning').length;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Stock Depletion</h3>
          <p className="text-sm text-muted-foreground mt-1">Predicted days until restock needed</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#C9B3FF] flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
      </div>

      {(criticalCount > 0 || warningCount > 0) && (
        <div className="flex gap-2 mb-4">
          {criticalCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
              <span className="text-red-500 font-medium">{criticalCount} critical</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
              <span className="text-orange-500 font-medium">{warningCount} low stock</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {items.map((item, index) => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          const usage = Math.abs(item.dailyUsage);
          const days = item.daysLeft != null ? Math.abs(item.daysLeft) : null;
          return (
            <motion.div
              key={item.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.04 }}
              className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border} flex flex-col`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 shrink-0" style={{ color: cfg.color }} />
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm font-semibold truncate mb-1">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.currentStock} {item.unit} left
              </p>
              <div className="mt-auto pt-3 flex items-center justify-between">
                <p className="text-lg font-bold" style={{ color: cfg.color }}>
                  {days != null ? `${days}d` : '—'}
                </p>
                {usage > 0 && (
                  <p className="text-[10px] text-muted-foreground">~{usage}/{item.unit?.charAt(0) || 'u'}/day</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
