import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TableCard from './TableCard';
import OrderSidebar from './OrderSidebar';

export interface Table {
  id: number;
  number: string;
  seats: number;
  status: 'free' | 'occupied' | 'reserved';
  billTotal?: number;
  currentOrders?: string[];
}

const mockTables: Table[] = [
  { id: 1, number: '1', seats: 4, status: 'occupied', billTotal: 850, currentOrders: ['Cappuccino', 'Croissant'] },
  { id: 2, number: '2', seats: 2, status: 'free', seats: 2 },
  { id: 3, number: '3', seats: 6, status: 'reserved', seats: 6 },
  { id: 4, number: '4', seats: 4, status: 'occupied', billTotal: 1250, currentOrders: ['Latte', 'Sandwich', 'Cake'] },
  { id: 5, number: '5', seats: 2, status: 'free', seats: 2 },
  { id: 6, number: '6', seats: 8, status: 'occupied', billTotal: 3200, currentOrders: ['Multiple items'] },
  { id: 7, number: '7', seats: 4, status: 'free', seats: 4 },
  { id: 8, number: '8', seats: 2, status: 'reserved', seats: 2 },
  { id: 9, number: '9', seats: 4, status: 'free', seats: 4 },
  { id: 10, number: '10', seats: 6, status: 'occupied', billTotal: 1890, currentOrders: ['Coffee', 'Snacks'] },
  { id: 11, number: '11', seats: 2, status: 'free', seats: 2 },
  { id: 12, number: '12', seats: 4, status: 'free', seats: 4 },
];

export default function POSScreen() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>(mockTables);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleCloseSidebar = () => {
    setSelectedTable(null);
  };

  const stats = {
    free: tables.filter(t => t.status === 'free').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1>Point of Sale</h1>
        <p className="text-muted-foreground mt-1">
          Manage orders and table reservations
        </p>
      </motion.div>

      {/* Status Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-4 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#93E5AB]" />
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="mt-1">{stats.free} tables</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
            <div>
              <p className="text-sm text-muted-foreground">Occupied</p>
              <p className="mt-1">{stats.occupied} tables</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FFD66C]" />
            <div>
              <p className="text-sm text-muted-foreground">Reserved</p>
              <p className="mt-1">{stats.reserved} tables</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {tables.map((table, index) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => handleTableClick(table)}
            index={index}
          />
        ))}
      </div>

      {/* Order Sidebar */}
      <AnimatePresence>
        {selectedTable && (
          <OrderSidebar
            table={selectedTable}
            onClose={handleCloseSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
