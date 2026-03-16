import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import { getSlowMovingItems, SlowMovingItem } from '../../services/aiService';

export default function SlowMovingItems() {
  const [items, setItems] = useState<SlowMovingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSlowMovingItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[350px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted/30 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <TrendingDown className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No order data available yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Slow-Moving Items</h3>
          <p className="text-sm text-muted-foreground mt-1">Least ordered — consider promoting or removing</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-danger to-[#FFB347] flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.item}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.08 }}
            className="px-4 py-3.5 bg-muted/20 rounded-xl border border-border"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-sm font-semibold">{item.item}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.category} · ₹{item.price}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold">{item.totalSold} sold</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.demandPercent}%` }}
                  transition={{ delay: 0.8 + index * 0.08, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-danger to-[#FFB347] rounded-full"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground min-w-[2.5rem] text-right">{item.demandPercent}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 px-4 py-3 bg-danger/5 rounded-xl border border-danger/20">
        <p className="text-xs text-muted-foreground">
          <span className="text-danger font-medium">Tip:</span> Items with low demand may benefit from discounts, combo offers, or menu removal to reduce waste.
        </p>
      </div>
    </motion.div>
  );
}
