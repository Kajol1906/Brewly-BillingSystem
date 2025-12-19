import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
  index: number;
}

export default function MetricCard({ title, value, change, trend, icon: Icon, color, index }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-[#4CAF50]';
      case 'down':
        return 'text-[#FF6B6B]';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-white rounded-2xl p-6 border border-border hover:shadow-hover transition-all cursor-pointer"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-2xl blur-2xl group-hover:opacity-10 transition-opacity`} />

      <div className="relative">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <p className="text-sm text-muted-foreground mb-2">{title}</p>

        {/* Value */}
        <h2 className="mb-3">{value}</h2>

        {/* Change Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-xs">{change}</span>
        </div>

        {/* Pulse Effect on Hover */}
        <motion.div
          className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#6C63FF]"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
