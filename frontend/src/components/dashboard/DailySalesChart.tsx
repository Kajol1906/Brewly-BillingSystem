import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', sales: 12500 },
  { day: 'Tue', sales: 18200 },
  { day: 'Wed', sales: 15800 },
  { day: 'Thu', sales: 22400 },
  { day: 'Fri', sales: 28900 },
  { day: 'Sat', sales: 35200 },
  { day: 'Sun', sales: 31500 },
];

export default function DailySalesChart() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-border"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="mb-6">
        <h3>Daily Sales</h3>
        <p className="text-sm text-muted-foreground mt-1">Last 7 days performance</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="url(#salesGradient)"
            strokeWidth={3}
            dot={{ fill: '#6C63FF', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: '#6C63FF', stroke: 'white', strokeWidth: 2 }}
          />
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#93E5AB" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
