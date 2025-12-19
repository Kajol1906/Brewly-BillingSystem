import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Users, Calendar, Package } from 'lucide-react';

export default function BudgetEstimator() {
  const [guestCount, setGuestCount] = useState(50);
  const [eventType, setEventType] = useState('birthday');
  
  const baseRate = 250; // per person
  const estimatedCost = guestCount * baseRate;
  const breakdown = {
    food: estimatedCost * 0.5,
    beverages: estimatedCost * 0.2,
    decoration: estimatedCost * 0.15,
    service: estimatedCost * 0.15,
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Event Budget Estimator</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate event costs instantly
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#C9B3FF] flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Guest Count Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-muted-foreground">Guest Count</label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6C63FF]" />
            <span className="text-[#6C63FF]">{guestCount}</span>
          </div>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          value={guestCount}
          onChange={(e) => setGuestCount(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#6C63FF] [&::-webkit-slider-thumb]:to-[#93E5AB] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Event Type */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-3 block">Event Type</label>
        <div className="grid grid-cols-2 gap-2">
          {['birthday', 'corporate', 'wedding', 'casual'].map(type => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEventType(type)}
              className={`
                px-4 py-2 rounded-lg border-2 capitalize transition-all
                ${eventType === type
                  ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                  : 'border-border hover:border-[#6C63FF]/30'
                }
              `}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Estimated Total */}
      <div className="p-4 bg-gradient-to-r from-[#6C63FF]/10 to-[#C9B3FF]/10 rounded-xl border border-[#6C63FF]/30 mb-4">
        <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
        <motion.div
          key={estimatedCost}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[#6C63FF]"
        >
          ₹{estimatedCost.toLocaleString()}
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-3">Cost Breakdown</p>
        {Object.entries(breakdown).map(([category, amount], index) => (
          <motion.div
            key={category}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.05 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="capitalize text-muted-foreground">{category}</span>
            <span>₹{Math.round(amount).toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
