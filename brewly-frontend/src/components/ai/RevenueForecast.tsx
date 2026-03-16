import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getRevenueForecast, RevenueForecastData } from '../../services/aiService';

export default function RevenueForecast() {
  const [data, setData] = useState<RevenueForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenueForecast()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[350px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
        <div className="h-48 bg-muted/30 rounded" />
      </div>
    );
  }

  if (!data || (data.weeklyRevenue === 0 && data.projectedWeekly === 0)) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[350px]">
        <TrendingUp className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No revenue data yet.</p>
        <p className="text-xs text-muted-foreground/70">Bill some orders to see forecasts!</p>
      </div>
    );
  }

  const chartData = [
    ...data.history.map(d => ({
      date: d.date.slice(5), // MM-DD
      actual: d.revenue,
      forecast: null as number | null,
    })),
    ...data.forecast.map(d => ({
      date: d.date.slice(5),
      actual: null as number | null,
      forecast: d.revenue,
    })),
  ];

  // Connect the two lines: last actual point also gets a forecast value
  if (data.history.length > 0 && data.forecast.length > 0) {
    chartData[data.history.length - 1].forecast = chartData[data.history.length - 1].actual;
  }

  const isUp = data.changePercent >= 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3>Revenue Forecast</h3>
          <p className="text-sm text-muted-foreground mt-1">Last 7 days + next 7 projected</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-[#81C784] flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 px-4 py-3.5 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">This Week</p>
          <p className="text-lg font-semibold">₹{data.weeklyRevenue.toLocaleString()}</p>
        </div>
        <div className="flex-1 px-4 py-3.5 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Next Week (Est.)</p>
          <p className="text-lg font-semibold">₹{data.projectedWeekly.toLocaleString()}</p>
        </div>
        <div className={`flex-1 px-4 py-3.5 rounded-xl border ${isUp ? 'bg-success/5 border-success/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <p className="text-xs text-muted-foreground mb-1">Trend</p>
          <div className="flex items-center gap-1.5">
            {isUp ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className={`text-lg font-semibold ${isUp ? 'text-success' : 'text-red-500'}`}>
              {isUp ? '+' : ''}{data.changePercent}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
            formatter={(value: number, name: string) => [`₹${value?.toLocaleString() ?? 0}`, name === 'actual' ? 'Actual' : 'Forecast']}
          />
          <Area type="monotone" dataKey="actual" stroke="#4CAF50" strokeWidth={2.5} fill="url(#actualGrad)" dot={{ fill: '#4CAF50', r: 3 }} connectNulls={false} />
          <Area type="monotone" dataKey="forecast" stroke="#6C63FF" strokeWidth={2.5} strokeDasharray="6 3" fill="url(#forecastGrad)" dot={{ fill: '#6C63FF', r: 3 }} connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
