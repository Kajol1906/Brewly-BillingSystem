import { motion } from 'motion/react';
import MetricCard from './MetricCard';
import DailySalesChart from './DailySalesChart';
import TopSellingChart from './TopSellingChart';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, Calendar } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      title: "Today's Revenue",
      value: '₹45,280',
      change: '+12.5%',
      trend: 'up' as const,
      icon: IndianRupee,
      color: 'from-[#6C63FF] to-[#93E5AB]',
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingBag,
      color: 'from-[#FFC8A2] to-[#FFD66C]',
    },
    {
      title: 'Occupied Tables',
      value: '12/24',
      change: '50%',
      trend: 'neutral' as const,
      icon: Users,
      color: 'from-[#93E5AB] to-[#6C63FF]',
    },
    {
      title: 'Low-Stock Alerts',
      value: '5',
      change: '-2',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'from-[#FF6B6B] to-[#FFD66C]',
    },
    {
      title: 'Upcoming Events',
      value: '8',
      change: '+3',
      trend: 'up' as const,
      icon: Calendar,
      color: 'from-[#FFD66C] to-[#FFC8A2]',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesChart />
        <TopSellingChart />
      </div>
    </div>
  );
}
