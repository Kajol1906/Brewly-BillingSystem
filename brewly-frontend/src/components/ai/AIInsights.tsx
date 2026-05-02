import { motion } from 'motion/react';
import RecommendationEngine from './RecommendationEngine';
import PeakHourForecast from './PeakHourForecast';
import RevenueForecast from './RevenueForecast';
import CategoryBreakdown from './CategoryBreakdown';
import SlowMovingItems from './SlowMovingItems';
import PaymentInsights from './PaymentInsights';

export default function AIInsights() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
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
          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl -z-10"
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
      </div>
    </div>
  );
}



