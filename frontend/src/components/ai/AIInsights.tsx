import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import RecommendationEngine from './RecommendationEngine';
import PeakHourForecast from './PeakHourForecast';
import RevenueForecast from './RevenueForecast';
import CategoryBreakdown from './CategoryBreakdown';
import SlowMovingItems from './SlowMovingItems';
import StockDepletion from './StockDepletion';
import PaymentInsights from './PaymentInsights';
import TableTurnover from './TableTurnover';

export default function AIInsights() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1>AI Insights</h1>
        </div>
        <p className="text-muted-foreground">
          Smart recommendations based on your order data
        </p>

        {/* Animated Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] rounded-full blur-3xl -z-10"
        />
      </motion.div>

      {/* AI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <RevenueForecast />
        <CategoryBreakdown />
        <PaymentInsights />
        <PeakHourForecast />
        <RecommendationEngine />
        <SlowMovingItems />
        <StockDepletion />
        <TableTurnover />
      </div>
    </div>
  );
}



