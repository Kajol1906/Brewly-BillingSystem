import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { hour: '8AM', traffic: 20 },
  { hour: '10AM', traffic: 45 },
  { hour: '12PM', traffic: 85 },
  { hour: '2PM', traffic: 65 },
  { hour: '4PM', traffic: 55 },
  { hour: '6PM', traffic: 95 },
  { hour: '8PM', traffic: 75 },
  { hour: '10PM', traffic: 30 },
];

export default function PeakHourForecast() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Peak Hour Forecast</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Predicted customer traffic today
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFC8A2] to-[#FFD66C] flex items-center justify-center">
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

      <div className="mt-4 p-4 bg-gradient-to-r from-[#FFC8A2]/10 to-[#FFD66C]/10 rounded-xl border border-[#FFC8A2]/30">
        <p className="text-sm">
          <span className="text-[#FFC8A2]">Peak expected at 6 PM</span> - Staff up for optimal service
        </p>
      </div>
    </motion.div>
  );
}
