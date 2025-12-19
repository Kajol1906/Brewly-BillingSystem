import { motion } from 'motion/react';
import { Star, TrendingUp } from 'lucide-react';

const recommendations = [
  { id: 1, item: 'Caramel Macchiato', confidence: 87, trend: '+12%' },
  { id: 2, item: 'Avocado Toast', confidence: 92, trend: '+18%' },
  { id: 3, item: 'Matcha Latte', confidence: 78, trend: '+8%' },
];

export default function RecommendationEngine() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="relative bg-white rounded-2xl p-6 border border-border shadow-soft overflow-hidden"
    >
      {/* Pulsing Highlight */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] -z-10"
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Recommendation Engine</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Top items to promote this week
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border"
          >
            <div className="flex-1">
              <p className="mb-2">{rec.item}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rec.confidence}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#6C63FF] to-[#93E5AB]"
                  />
                </div>
                <span className="text-xs text-muted-foreground min-w-[3rem]">{rec.confidence}%</span>
              </div>
            </div>
            <div className="ml-4 flex items-center gap-1 px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">{rec.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
