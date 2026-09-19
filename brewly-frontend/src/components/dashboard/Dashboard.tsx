import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import MetricCard from './MetricCard';
import DailySalesChart from './DailySalesChart';
import TopSellingChart from './TopSellingChart';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, Calendar, X } from 'lucide-react';
import { getDashboardMetrics, DashboardMetrics, Period, getOrderSummaries, OrderSummary, getUpcomingEvents, UpcomingEvent } from '../../services/dashboardService';

const periods: { value: Period; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('today');
  const [metricsData, setMetricsData] = useState<DashboardMetrics | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [showEvents, setShowEvents] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    getDashboardMetrics(period).then(setMetricsData);
  }, [period]);

  const handleOrdersClick = () => {
    getOrderSummaries(period).then((data) => {
      setOrders(data);
      setShowOrders(true);
    });
  };

  const handleEventsClick = () => {
    getUpcomingEvents().then((data) => {
      setUpcomingEvents(data);
      setShowEvents(true);
    });
  };

  const revenueLabel = period === 'today' ? "Today's Revenue"
    : period === 'yesterday' ? "Yesterday's Revenue"
      : period === 'week' ? "This Week's Revenue"
        : "This Month's Revenue";

  const ordersLabel = period === 'today' ? "Today's Orders"
    : period === 'yesterday' ? "Yesterday's Orders"
      : period === 'week' ? "This Week's Orders"
        : "This Month's Orders";

  const revenueTrend = metricsData
    ? metricsData.revenueChangePercent > 0 ? 'up' as const
      : metricsData.revenueChangePercent < 0 ? 'down' as const
        : 'neutral' as const
    : 'neutral' as const;

  const ordersTrend = metricsData
    ? metricsData.ordersChangePercent > 0 ? 'up' as const
      : metricsData.ordersChangePercent < 0 ? 'down' as const
        : 'neutral' as const
    : 'neutral' as const;

  const formatChange = (pct: number | undefined) => {
    if (pct === undefined || pct === null) return 'N/A';
    if (pct === 0) return '0%';
    return `${pct > 0 ? '+' : ''}${pct}%`;
  };

  const prevLabel = period === 'today' ? 'vs yesterday'
    : period === 'yesterday' ? 'vs day before'
      : period === 'week' ? 'vs last week'
        : 'vs last month';

  const metrics = [
    {
      title: revenueLabel,
      value: metricsData ? `₹${metricsData.todayRevenue.toLocaleString()}` : '...',
      change: metricsData ? `${formatChange(metricsData.revenueChangePercent)} ${prevLabel}` : 'N/A',
      trend: revenueTrend,
      icon: IndianRupee,
      color: 'from-primary to-accent',
    },
    {
      title: ordersLabel,
      value: metricsData ? metricsData.totalOrders.toString() : '...',
      change: metricsData ? `${formatChange(metricsData.ordersChangePercent)} ${prevLabel}` : 'N/A',
      trend: ordersTrend,
      icon: ShoppingBag,
      color: 'from-secondary to-warning',
      onClick: handleOrdersClick,
    },
    {
      title: 'Occupied Tables',
      value: metricsData ? `${metricsData.occupiedTables}/${metricsData.totalTables}` : '...',
      change: 'Live',
      trend: 'neutral' as const,
      icon: Users,
      color: 'from-accent to-primary',
    },
    {
      title: 'Low-Stock Alerts',
      value: metricsData ? metricsData.lowStockItems.toString() : '...',
      change: metricsData && metricsData.lowStockItems > 0 ? 'Needs attention' : 'All stocked',
      trend: metricsData && metricsData.lowStockItems > 0 ? 'down' as const : 'neutral' as const,
      icon: AlertTriangle,
      color: 'from-danger to-warning',
    },
    {
      title: 'Upcoming Events',
      value: metricsData ? metricsData.upcomingEvents.toString() : '...',
      change: 'Scheduled',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'from-warning to-secondary',
      onClick: handleEventsClick,
    },
  ];

  const subtitle = period === 'today' ? "Here's what's happening today."
    : period === 'yesterday' ? "Here's how yesterday went."
      : period === 'week' ? "Your performance this week."
        : "Monthly overview at a glance.";

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 border border-border">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.value
                  ? 'bg-white text-primary shadow-sm border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesChart period={period} />
        <TopSellingChart period={period} />
      </div>

      {/* Orders Modal */}
      {showOrders && createPortal(
        <AnimatePresence>
          <div
            onClick={() => setShowOrders(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-[640px] max-h-[80vh] rounded-3xl border flex flex-col overflow-hidden shadow-soft-lg"
              style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92, 61, 46, 0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(92, 61, 46, 0.1)' }}>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2C1810]">{ordersLabel}</h3>
                  <p className="text-sm text-[#8C7B6B] mt-1 font-medium">
                    {orders.length} order{orders.length !== 1 ? 's' : ''} — <span className="text-[#5C3D2E] font-semibold">₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</span> total
                  </p>
                </div>
                <button
                  onClick={() => setShowOrders(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#5C3D2E]/10 hover:bg-[#5C3D2E]/20 text-[#5C3D2E] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Orders List */}
              <div className="overflow-y-auto p-6 flex-1 scrollbar-thin">
                {orders.length === 0 ? (
                  <p className="text-center text-[#8C7B6B] py-12 font-medium">No orders for this period</p>
                ) : (
                  <div className="flex flex-col">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 border-b-2 border-[#5C3D2E]/15 mb-3">
                      <span className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider">Item</span>
                      <span className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider text-center min-w-[50px]">Qty</span>
                      <span className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider text-right min-w-[80px]">Price</span>
                    </div>
                    {/* Aggregated items */}
                    {(() => {
                      const aggregated = new Map<string, { quantity: number; price: number; subtotal: number }>();
                      orders.forEach((order) =>
                        order.items.forEach((item) => {
                          const existing = aggregated.get(item.name);
                          if (existing) {
                            existing.quantity += item.quantity;
                            existing.subtotal += item.subtotal;
                          } else {
                            aggregated.set(item.name, { quantity: item.quantity, price: item.price, subtotal: item.subtotal });
                          }
                        })
                      );
                      return Array.from(aggregated.entries()).map(([name, data]) => (
                        <div
                          key={name}
                          className="grid grid-cols-[1fr_auto_auto] gap-4 py-3.5 items-center border-b border-[#5C3D2E]/10 last:border-0"
                        >
                          <span className="text-sm text-[#2C1810] font-semibold">{name}</span>
                          <span className="text-sm text-[#5C3D2E] font-bold text-center min-w-[50px] bg-[#5C3D2E]/10 py-1 px-2.5 rounded-lg">×{data.quantity}</span>
                          <span className="text-sm font-bold text-[#2C1810] text-right min-w-[80px]">₹{data.subtotal.toLocaleString()}</span>
                        </div>
                      ));
                    })()}
                    {/* Total */}
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 pt-4 border-t-2 border-[#5C3D2E]/15 mt-3">
                      <span className="font-serif font-bold text-lg text-[#2C1810]">Total</span>
                      <span></span>
                      <span className="font-serif font-bold text-lg text-[#5C3D2E] text-right min-w-[80px]">
                        ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Upcoming Events Modal */}
      {showEvents && createPortal(
        <AnimatePresence>
          <div
            onClick={() => setShowEvents(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-[560px] max-h-[80vh] rounded-3xl border flex flex-col overflow-hidden shadow-soft-lg"
              style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92, 61, 46, 0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(92, 61, 46, 0.1)' }}>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2C1810]">Upcoming Events</h3>
                  <p className="text-sm text-[#8C7B6B] mt-1 font-medium">
                    {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
                <button
                  onClick={() => setShowEvents(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#5C3D2E]/10 hover:bg-[#5C3D2E]/20 text-[#5C3D2E] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Events List */}
              <div className="overflow-y-auto p-6 flex-1 scrollbar-thin">
                {upcomingEvents.length === 0 ? (
                  <p className="text-center text-[#8C7B6B] py-12 font-medium">No upcoming events</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {upcomingEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="border bg-white p-5 rounded-2xl shadow-soft hover:shadow-hover hover:border-[#5C3D2E]/40 transition-all duration-200"
                        style={{ borderColor: 'rgba(92, 61, 46, 0.15)' }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-serif font-bold text-base text-[#2C1810]">{evt.title}</span>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5C3D2E]/10 text-[#5C3D2E]">
                            {evt.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-[#8C7B6B] font-medium">
                          <span className="flex items-center gap-1">📅 {evt.date}</span>
                          <span className="flex items-center gap-1">🕐 {evt.time}</span>
                          <span className="flex items-center gap-1">👥 {evt.guestCount} guests</span>
                        </div>
                        {evt.packageType && (
                          <div className="mt-2.5 pt-2.5 border-t border-dashed border-[#5C3D2E]/10 text-xs text-[#8C7B6B] font-medium">
                            📦 <span className="text-[#2C1810] font-semibold">{evt.packageType}</span> Package
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}



