import { motion } from 'motion/react';
import { Users, IndianRupee } from 'lucide-react';
import type { Table } from './POSScreen';

interface TableCardProps {
  table: Table;
  onClick: () => void;
  index: number;
}

export default function TableCard({ table, onClick, index }: TableCardProps) {
  const getStatusColor = () => {
    switch (table.status) {
      case 'free':
        return {
          bg: 'bg-[#93E5AB]/10',
          border: 'border-[#93E5AB]/30',
          glow: 'shadow-[#93E5AB]/20',
          text: 'text-[#93E5AB]',
        };
      case 'occupied':
        return {
          bg: 'bg-[#FF6B6B]/10',
          border: 'border-[#FF6B6B]/30',
          glow: 'shadow-[#FF6B6B]/20',
          text: 'text-[#FF6B6B]',
        };
      case 'reserved':
        return {
          bg: 'bg-[#FFD66C]/10',
          border: 'border-[#FFD66C]/30',
          glow: 'shadow-[#FFD66C]/20',
          text: 'text-[#FFD66C]',
        };
    }
  };

  const colors = getStatusColor();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative aspect-square bg-white rounded-2xl border-2 ${colors.border} ${colors.bg}
        hover:shadow-lg transition-all p-4 flex flex-col items-center justify-center
        ${colors.glow}
      `}
    >
      {/* Status Indicator */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')}`}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-full h-full rounded-full ${colors.text.replace('text-', 'bg-')}`}
        />
      </div>

      {/* Table Number */}
      <div className="mb-2">
        <span className="text-muted-foreground">Table</span>
      </div>
      <div className="mb-3">
        <span className={colors.text}>{table.number}</span>
      </div>

      {/* Seats */}
      <div className="flex items-center gap-1 text-muted-foreground mb-3">
        <Users className="w-4 h-4" />
        <span className="text-sm">{table.seats} seats</span>
      </div>

      {/* Bill Total (if occupied) */}
      {table.status === 'occupied' && table.billTotal && (
        <div className={`flex items-center gap-1 ${colors.text} px-3 py-1 rounded-lg ${colors.bg}`}>
          <IndianRupee className="w-3 h-3" />
          <span className="text-sm">{table.billTotal}</span>
        </div>
      )}

      {/* Status Badge */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs ${colors.bg} ${colors.text} capitalize`}>
        {table.status}
      </div>
    </motion.button>
  );
}
