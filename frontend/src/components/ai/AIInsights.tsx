import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Lightbulb, AlertCircle, DollarSign } from 'lucide-react';
import RecommendationEngine from './RecommendationEngine';
import PeakHourForecast from './PeakHourForecast';
import WasteReduction from './WasteReduction';
import BudgetEstimator from './BudgetEstimator';

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
          Smart recommendations powered by machine learning
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Accuracy', value: '94.2%', color: 'from-[#4CAF50] to-[#93E5AB]' },
          { icon: Lightbulb, label: 'Insights Generated', value: '127', color: 'from-[#FFD66C] to-[#FFC8A2]' },
          { icon: AlertCircle, label: 'Alerts Active', value: '3', color: 'from-[#FF6B6B] to-[#FFD66C]' },
          { icon: DollarSign, label: 'Potential Savings', value: '₹12.5k', color: 'from-[#6C63FF] to-[#93E5AB]' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 border border-border shadow-soft overflow-hidden group hover:shadow-hover transition-all"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-2xl blur-2xl group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <h2>{stat.value}</h2>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationEngine />
        <PeakHourForecast />
        <WasteReduction />
        <BudgetEstimator />
      </div>
    </div>
  );
}
