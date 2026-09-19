import { motion, AnimatePresence } from 'motion/react';
import { IndianRupee, Trash2 } from 'lucide-react';
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
          bg: 'bg-accent/10',
          border: 'border-accent/30',
          glow: 'shadow-accent/20',
          text: 'text-accent',
        };
      case 'occupied':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/30',
          glow: 'shadow-danger/20',
          text: 'text-danger',
        };
      case 'reserved':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          glow: 'shadow-warning/20',
          text: 'text-warning',
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

  const renderChairs = () => {
    const chairs = [];
    const totalChairs = table.seats;
    const radius = 48; // distance from center in px
    for (let i = 0; i < totalChairs; i++) {
      const angle = (i * 2 * Math.PI) / totalChairs - Math.PI / 2; // Offset by -90deg so first chair is at the top
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));
      chairs.push(
        <div
          key={i}
          className="absolute w-3.5 h-3.5 rounded-full border transition-all duration-300 shadow-soft"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            backgroundColor: table.status === 'occupied' 
              ? '#c0392b' 
              : table.status === 'reserved' 
              ? '#e67e22' 
              : '#27ae60',
            borderColor: 'rgba(255,255,255,0.4)',
          }}
        />
      );
    }
    return chairs;
  };

  return (
    <>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`
        relative aspect-square bg-[#FAF6F0] rounded-3xl border-2 cursor-pointer ${colors.border}
        hover:shadow-hover transition-all p-4 flex flex-col items-center justify-between
        ${colors.glow}
      `}
      style={{ boxShadow: 'var(--shadow-soft)', borderColor: table.status === 'occupied' ? 'rgba(192, 57, 43, 0.25)' : table.status === 'reserved' ? 'rgba(230, 126, 34, 0.25)' : 'rgba(39, 174, 96, 0.25)' }}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 left-3 w-7 h-7 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors z-20 cursor-pointer"
        title="Delete table"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
      </button>

      {/* Status Indicator */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')}`}>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className={`w-full h-full rounded-full ${colors.text.replace('text-', 'bg-')}`}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
        {/* Dynamic Seating & Table Circle Visual */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-2">
          {/* Circular chairs */}
          {renderChairs()}

          {/* Central Table Plate */}
          <div 
            className="w-18 h-18 rounded-full border-4 flex flex-col items-center justify-center bg-white shadow-soft font-bold transition-all z-10"
            style={{
              borderColor: table.status === 'occupied' 
                ? '#c0392b' 
                : table.status === 'reserved' 
                ? '#e67e22' 
                : '#27ae60',
              color: '#2C1810',
            }}
          >
            <span className="text-xs text-[#8C7B6B] font-medium leading-none uppercase">Table</span>
            <span className="text-xl font-bold tracking-tight mt-0.5 leading-none">{table.tableNumber}</span>
          </div>
        </div>

        {/* Dynamic Seats Count text */}
        <div className="flex items-center gap-1 text-[#8C7B6B] font-medium text-xs mb-1">
          <span>{table.seats} Seats</span>
        </div>

        {/* Bill Total (if occupied) */}
        {table.status === 'occupied' && table.billTotal && (
          <div className="flex items-center gap-1 text-[#c0392b] font-bold text-sm bg-red-100/60 px-3 py-1 rounded-xl shadow-soft">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>₹{table.billTotal.toLocaleString()}</span>
          </div>
        )}

        {/* Reservation Info (if reserved) */}
        {table.status === 'reserved' && (table as any).reservedForEvent && (
          <div className="text-center px-2 bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-500/10">
            <p className="text-[10px] font-bold text-amber-800 leading-tight">
              {(table as any).reservedForEvent}
            </p>
            <p className="text-[9px] text-[#8C7B6B] font-medium leading-tight mt-0.5">
              {(table as any).reservedForDate ? ((table as any).reservedForDate.split(' ')[1] || (table as any).reservedForDate) : 'Today'}
            </p>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className={`px-3.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} capitalize mt-1 tracking-wide`}>
        {table.status}
      </div>
    </motion.div>

    {/* Delete Confirmation Dialog */}
    {createPortal(
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            {/* Dialog Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-[320px] rounded-3xl border p-6 shadow-soft-lg text-center"
              style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92,61,46,0.2)' }}
            >
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/10">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2C1810] mb-2">
                Delete Table {table.tableNumber}?
              </h3>
              <p className="text-xs text-[#8C7B6B] font-medium leading-relaxed mb-6">
                This will permanently remove this table and reset its transaction logs.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 h-10 text-xs font-semibold rounded-xl border border-[#5C3D2E]/20 text-[#5C3D2E] hover:bg-[#5C3D2E]/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-10 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: '#c0392b' }}
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



