import { motion, AnimatePresence } from 'motion/react';
import { Users, IndianRupee, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Table } from './POSScreen';


interface TableCardProps {
  table: Table;
  onClick: () => void;
  onDelete: (tableId: number) => void;
  index: number;
}

export default function TableCard({ table, onClick, onDelete, index }: TableCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(table.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative aspect-square bg-card rounded-2xl border-2 cursor-pointer ${colors.border} ${colors.bg}
        hover:shadow-lg transition-all p-4 flex flex-col items-center justify-center
        ${colors.glow}
      `}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 left-3 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors z-10"
        title="Delete table"
      >
        <Trash2 className="w-3 h-3 text-red-500" />
      </button>

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
        <span className={colors.text}>{table.tableNumber}</span>
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

      {/* Reservation Info (if reserved) */}
      {table.status === 'reserved' && (table as any).reservedForEvent && (
        <div className="text-center px-2">
          <p className="text-[10px] text-[#FFD66C]/80 leading-tight">
            Reserved for {(table as any).reservedForEvent}
          </p>
          <p className="text-[9px] text-muted-foreground leading-tight">
            {(table as any).reservedForDate}
          </p>
        </div>
      )}

      {/* Status Badge */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs ${colors.bg} ${colors.text} capitalize`}>
        {table.status}
      </div>
    </motion.div>

    {/* Delete Confirmation Dialog - rendered via portal to body */}
    {createPortal(
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsDeleteDialogOpen(false)}
            />
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-80 mx-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-2xl text-center"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Delete Table {table.tableNumber}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This will permanently remove this table. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}



