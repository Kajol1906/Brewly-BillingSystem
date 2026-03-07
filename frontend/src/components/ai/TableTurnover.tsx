import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Clock } from 'lucide-react';
import { getTableTurnover, TableTurnoverItem } from '../../services/aiService';

export default function TableTurnover() {
  const [tables, setTables] = useState<TableTurnoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTableTurnover()
      .then(setTables)
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

  if (tables.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <RotateCcw className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No table data yet.</p>
      </div>
    );
  }

  const totalOrders = tables.reduce((sum, t) => sum + t.totalOrders, 0);
  const totalRevenue = tables.reduce((sum, t) => sum + t.totalRevenue, 0);
  const tablesWithSessions = tables.filter(t => t.avgSessionMinutes > 0);
  const avgSession = tablesWithSessions.length > 0
    ? Math.round(tablesWithSessions.reduce((sum, t) => sum + t.avgSessionMinutes, 0) / tablesWithSessions.length)
    : 0;

  const maxOrders = Math.max(...tables.map(t => t.totalOrders), 1);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Table Turnover</h3>
          <p className="text-sm text-muted-foreground mt-1">Usage and average session time per table</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#45B7D1] to-[#4ECDC4] flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-lg font-semibold">{totalOrders}</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-xs text-muted-foreground">Avg Session</p>
          <p className="text-lg font-semibold">{avgSession > 0 ? `${avgSession}m` : '—'}</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-lg font-semibold">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {tables.map((table, index) => (
          <motion.div
            key={table.tableNumber}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.04 }}
            className="p-4 rounded-xl bg-muted/10 border border-border flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#45B7D1]/20 to-[#4ECDC4]/20 flex items-center justify-center border border-[#45B7D1]/20">
                <span className="text-sm font-bold text-[#45B7D1]">T{table.tableNumber}</span>
              </div>
              <span className="text-xs text-muted-foreground">{table.seats} seats</span>
            </div>
            <p className="text-sm font-semibold mb-1">{table.totalOrders} orders</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(table.totalOrders / maxOrders) * 100}%` }}
                transition={{ delay: 1 + index * 0.04, duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-[#45B7D1] to-[#4ECDC4]"
              />
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{table.avgSessionMinutes > 0 ? `${table.avgSessionMinutes}m` : '—'}</span>
              </div>
              <span className="text-xs font-medium text-[#4CAF50]">₹{table.revenuePerOrder.toLocaleString()}/order</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
