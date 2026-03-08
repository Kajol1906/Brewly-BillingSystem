import { motion } from 'motion/react';
import { Recycle, ArrowDown } from 'lucide-react';

const suggestions = [
  { id: 1, item: 'Reduce croissant order', impact: '₹2,400/week', percentage: 18 },
  { id: 2, item: 'Use expiring milk first', impact: '₹1,800/week', percentage: 12 },
  { id: 3, item: 'Smaller sandwich portions', impact: '₹3,200/week', percentage: 24 },
];

export default function WasteReduction() {
  const totalSavings = suggestions.reduce((sum, s) => sum + parseInt(s.impact.replace(/[₹,/week]/g, '')), 0);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Waste Reduction</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Smart suggestions to minimize waste
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-success flex items-center justify-center">
          <Recycle className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Total Savings */}
      <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-success/10 rounded-xl border border-accent/30">
        <p className="text-sm text-muted-foreground mb-1">Potential Weekly Savings</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-success">₹{totalSavings.toLocaleString()}</h2>
          <div className="flex items-center gap-1 text-success">
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm">32% waste</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-accent/30 transition-all cursor-pointer"
          >
            <div className="flex-1">
              <p className="mb-1">{suggestion.item}</p>
              <p className="text-sm text-success">{suggestion.impact}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-success/20 flex items-center justify-center">
              <span className="text-success">{suggestion.percentage}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}



