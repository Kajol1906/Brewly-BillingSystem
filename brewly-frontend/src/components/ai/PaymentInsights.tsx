import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getPaymentInsights, PaymentInsightsData } from '../../services/aiService';

const METHOD_CONFIG: Record<string, { icon: typeof CreditCard; color: string; label: string }> = {
  CASH: { icon: Banknote, color: '#4CAF50', label: 'Cash' },
  UPI: { icon: Smartphone, color: '#6C63FF', label: 'UPI' },
  CARD: { icon: CreditCard, color: '#FFC8A2', label: 'Card' },
};

export default function PaymentInsights() {
  const [data, setData] = useState<PaymentInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentInsights()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[350px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
        <div className="h-40 bg-muted/30 rounded-full mx-auto w-40" />
      </div>
    );
  }

  if (!data || data.totalBills === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <CreditCard className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No payment data yet.</p>
        <p className="text-xs text-muted-foreground/70">Generate some bills to see insights!</p>
      </div>
    );
  }

  const pieData = data.methods.filter(m => m.count > 0);
  const topMethod = data.methods.reduce((a, b) => a.count > b.count ? a : b);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Payment Insights</h3>
          <p className="text-sm text-muted-foreground mt-1">How customers prefer to pay</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-success flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                strokeWidth={0}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.method} fill={METHOD_CONFIG[entry.method]?.color ?? '#9ca3af'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{data.totalBills}</p>
            <p className="text-[10px] text-muted-foreground">bills</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.methods.map((method, i) => {
            const cfg = METHOD_CONFIG[method.method];
            if (!cfg) return null;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={method.method}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cfg.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{cfg.label}</span>
                    <span className="text-sm font-medium">{method.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${method.percent}%` }}
                      transition={{ delay: 0.8 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cfg.color }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">₹{method.revenue.toLocaleString()} ({method.count} bills)</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">Insight:</span>{' '}
          {topMethod.count > 0
            ? `${METHOD_CONFIG[topMethod.method]?.label ?? topMethod.method} is the most popular payment method with ${topMethod.percent}% of all transactions.`
            : 'Not enough data to identify payment trends.'}
        </p>
      </div>
    </motion.div>
  );
}
