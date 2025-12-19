import { useState } from 'react';
import { motion } from 'motion/react';
import MenuItems from './MenuItems';
import InventoryTable from './InventoryTable';

export default function MenuInventory() {
  const [activeTab, setActiveTab] = useState<'menu' | 'inventory'>('menu');

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1>Menu & Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Manage your menu items and track inventory
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="inline-flex bg-muted/30 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('menu')}
            className={`
              relative px-6 py-2 rounded-lg transition-all
              ${activeTab === 'menu' ? 'text-[#6C63FF]' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {activeTab === 'menu' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg shadow-soft"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Menu Items</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`
              relative px-6 py-2 rounded-lg transition-all
              ${activeTab === 'inventory' ? 'text-[#6C63FF]' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {activeTab === 'inventory' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg shadow-soft"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Ingredients / Stock</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'menu' ? <MenuItems /> : <InventoryTable />}
      </motion.div>
    </div>
  );
}
