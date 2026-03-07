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
      color: 'from-[#6C63FF] to-[#93E5AB]',
    },
    {
      title: ordersLabel,
      value: metricsData ? metricsData.totalOrders.toString() : '...',
      change: metricsData ? `${formatChange(metricsData.ordersChangePercent)} ${prevLabel}` : 'N/A',
      trend: ordersTrend,
      icon: ShoppingBag,
      color: 'from-[#FFC8A2] to-[#FFD66C]',
      onClick: handleOrdersClick,
    },
    {
      title: 'Occupied Tables',
      value: metricsData ? `${metricsData.occupiedTables}/${metricsData.totalTables}` : '...',
      change: 'Live',
      trend: 'neutral' as const,
      icon: Users,
      color: 'from-[#93E5AB] to-[#6C63FF]',
    },
    {
      title: 'Low-Stock Alerts',
      value: metricsData ? metricsData.lowStockItems.toString() : '...',
      change: metricsData && metricsData.lowStockItems > 0 ? 'Needs attention' : 'All stocked',
      trend: metricsData && metricsData.lowStockItems > 0 ? 'down' as const : 'neutral' as const,
      icon: AlertTriangle,
      color: 'from-[#FF6B6B] to-[#FFD66C]',
    },
    {
      title: 'Upcoming Events',
      value: metricsData ? metricsData.upcomingEvents.toString() : '...',
      change: 'Scheduled',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'from-[#FFD66C] to-[#FFC8A2]',
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
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 border border-border">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.value
                  ? 'bg-white text-[#6C63FF] shadow-sm border border-[#6C63FF]/20'
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
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '640px',
                maxHeight: '80vh',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{ordersLabel}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    {orders.length} order{orders.length !== 1 ? 's' : ''} — ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()} total
                  </p>
                </div>
                <button
                  onClick={() => setShowOrders(false)}
                  style={{
                    width: '32px', height: '32px', border: 'none', borderRadius: '8px',
                    backgroundColor: '#f3f4f6', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Orders List */}
              <div style={{ overflow: 'auto', padding: '16px 24px', flex: 1 }}>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>No orders for this period</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Table header */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto',
                      gap: '16px', padding: '8px 0', borderBottom: '2px solid #e5e7eb',
                      marginBottom: '4px',
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Item</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', textAlign: 'center', minWidth: '40px' }}>Qty</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', textAlign: 'right', minWidth: '70px' }}>Price</span>
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
                          style={{
                            display: 'grid', gridTemplateColumns: '1fr auto auto',
                            gap: '16px', padding: '10px 0', alignItems: 'center',
                            borderBottom: '1px solid #f3f4f6',
                          }}
                        >
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{name}</span>
                          <span style={{ fontSize: '14px', color: '#374151', textAlign: 'center', minWidth: '40px' }}>×{data.quantity}</span>
                          <span style={{ fontSize: '14px', fontWeight: 500, textAlign: 'right', minWidth: '70px' }}>₹{data.subtotal.toLocaleString()}</span>
                        </div>
                      ));
                    })()}
                    {/* Total */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto',
                      gap: '16px', padding: '12px 0 4px', borderTop: '2px solid #e5e7eb', marginTop: '4px',
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#6C63FF' }}>Total</span>
                      <span></span>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#6C63FF', textAlign: 'right', minWidth: '70px' }}>
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
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '560px',
                maxHeight: '80vh',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Upcoming Events</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
                <button
                  onClick={() => setShowEvents(false)}
                  style={{
                    width: '32px', height: '32px', border: 'none', borderRadius: '8px',
                    backgroundColor: '#f3f4f6', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Events List */}
              <div style={{ overflow: 'auto', padding: '16px 24px', flex: 1 }}>
                {upcomingEvents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>No upcoming events</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {upcomingEvents.map((evt) => (
                      <div
                        key={evt.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: '#fafafa',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{evt.title}</span>
                          <span style={{
                            fontSize: '12px', fontWeight: 500,
                            padding: '2px 10px', borderRadius: '20px',
                            backgroundColor: '#EEF2FF', color: '#6C63FF',
                          }}>{evt.type}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                          <span>📅 {evt.date}</span>
                          <span>🕐 {evt.time}</span>
                          <span>👥 {evt.guestCount} guests</span>
                        </div>
                        {evt.packageType && (
                          <div style={{ marginTop: '6px', fontSize: '13px', color: '#6b7280' }}>
                            📦 {evt.packageType} Package
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



