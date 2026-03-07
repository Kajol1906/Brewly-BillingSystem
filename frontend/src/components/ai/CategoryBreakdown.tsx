import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategorySales, CategorySale } from '../../services/aiService';

const COLORS = ['#6C63FF', '#93E5AB', '#FFC8A2', '#FFD66C', '#FF6B6B', '#4ECDC4', '#C9B3FF', '#45B7D1'];

export default function CategoryBreakdown() {
  const [data, setData] = useState<CategorySale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategorySales()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[350px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
        <div className="h-48 bg-muted/30 rounded-full mx-auto w-48" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <PieIcon className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No category data yet.</p>
        <p className="text-xs text-muted-foreground/70">Bill some orders to see breakdown!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Category Sales</h3>
          <p className="text-sm text-muted-foreground mt-1">Revenue by menu category</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center">
          <PieIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>₹{item.revenue.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({item.percent}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
