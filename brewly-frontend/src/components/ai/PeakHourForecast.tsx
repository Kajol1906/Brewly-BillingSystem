import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getPeakHours, PeakHourData } from '../../services/aiService';

export default function PeakHourForecast() {
  const [data, setData] = useState<PeakHourData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeakHours()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-pulse h-[300px]">
        <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
        <div className="h-40 bg-muted/30 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft flex flex-col items-center justify-center h-[300px]">
        <Clock className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No traffic data available yet.</p>
        <p className="text-xs text-muted-foreground/70">Place some orders to see insights!</p>
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Peak Hour Forecast</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Predicted customer traffic today
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC8A2" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#FFD66C" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="hour"
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          />
          <Area
            type="monotone"
            dataKey="traffic"
            stroke="#FFC8A2"
            strokeWidth={3}
            fill="url(#peakGradient)"
            dot={{ fill: '#FFC8A2', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-gradient-to-r from-secondary/10 to-warning/10 rounded-xl border border-secondary/30">
        <p className="text-sm">
          {(() => {
            const peak = data.reduce((max, d) => d.traffic > max.traffic ? d : max, data[0]);
            return peak.traffic > 0
              ? <><span className="text-secondary">Peak at {peak.hour}</span> — {peak.traffic} orders. Staff up for optimal service.</>
              : <span className="text-muted-foreground">Not enough data yet to identify peak hours.</span>;
          })()}
        </p>
      </div>
    </motion.div>
  );
}



