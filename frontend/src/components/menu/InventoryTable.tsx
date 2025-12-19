import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  stockQty: number;
  minStock: number;
  status: 'low' | 'normal' | 'good';
}

const mockInventory: InventoryItem[] = [
  { id: 1, name: 'Coffee Beans', unit: 'kg', stockQty: 15, minStock: 10, status: 'good' },
  { id: 2, name: 'Milk', unit: 'liters', stockQty: 8, minStock: 15, status: 'low' },
  { id: 3, name: 'Sugar', unit: 'kg', stockQty: 25, minStock: 10, status: 'good' },
  { id: 4, name: 'Flour', unit: 'kg', stockQty: 5, minStock: 8, status: 'low' },
  { id: 5, name: 'Butter', unit: 'kg', stockQty: 12, minStock: 5, status: 'good' },
  { id: 6, name: 'Cheese', unit: 'kg', stockQty: 3, minStock: 5, status: 'low' },
  { id: 7, name: 'Eggs', unit: 'dozens', stockQty: 20, minStock: 10, status: 'good' },
  { id: 8, name: 'Chocolate', unit: 'kg', stockQty: 18, minStock: 8, status: 'good' },
];

export default function InventoryTable() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B]">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs">Low Stock</span>
          </div>
        );
      case 'good':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs">Good</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground">
            <Package className="w-3 h-3" />
            <span className="text-xs">Normal</span>
          </div>
        );
    }
  };

  const lowStockCount = inventory.filter(i => i.status === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white rounded-xl border border-border shadow-soft-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF6B6B]" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-[#FF6B6B]">{lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-border shadow-soft-sm">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#6C63FF]" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-[#6C63FF]">{inventory.length}</p>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2 shadow-soft hover:shadow-hover transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Stock</span>
        </motion.button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#6C63FF]/5 to-[#93E5AB]/5">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Unit</th>
              <th className="text-left p-4">Stock Qty</th>
              <th className="text-left p-4">Min Stock</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-border hover:bg-muted/10 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C63FF]/10 to-[#93E5AB]/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#6C63FF]" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{item.unit}</td>
                <td className="p-4">
                  <span className={item.stockQty < item.minStock ? 'text-[#FF6B6B]' : ''}>
                    {item.stockQty}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{item.minStock}</td>
                <td className="p-4">{getStatusBadge(item.status)}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] rounded-lg hover:bg-[#6C63FF]/20 transition-colors text-sm"
                    >
                      Add Stock
                    </motion.button>
                    {item.status === 'low' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-[#FFC8A2]/20 text-[#FFC8A2] rounded-lg hover:bg-[#FFC8A2]/30 transition-colors text-sm"
                      >
                        Purchase
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
