import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { item: 'Cappuccino', sales: 145 },
  { item: 'Latte', sales: 132 },
  { item: 'Espresso', sales: 98 },
  { item: 'Croissant', sales: 86 },
  { item: 'Sandwich', sales: 74 },
];

export default function TopSellingChart() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-border"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="mb-6">
        <h3>Top Selling Items</h3>
        <p className="text-sm text-muted-foreground mt-1">Most popular menu items today</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="item" 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
            formatter={(value: number) => [`${value} orders`, 'Sales']}
          />
          <Bar 
            dataKey="sales" 
            fill="url(#barGradient)" 
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC8A2" />
              <stop offset="100%" stopColor="#FFD66C" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
